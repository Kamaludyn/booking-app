const mongoose = require("mongoose");
const Payment = require("../payment.model.js");
const Booking = require("../../booking/booking.model.js");
const Service = require("../../services/services.model.js");
const stripeInstance =
  require("../stripe/stripe.instance.js").getStripeInstance;

const zeroDecimalCurrencies = [
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
];

const unitAmount = (currency, amount) => {
  return zeroDecimalCurrencies.includes(currency)
    ? Math.round(amount) // no *100
    : Math.round(amount * 100); // scale to cents/kobo
};

const createPayment = async ({
  reservationId,
  bookingId,
  serviceId,
  clientEmail,
  amount,
  method,
  provider,
  idempotencyKey = null,
  meta = null,
}) => {
  // Validate amount
  if (!amount || !Number.isFinite(amount) || amount <= 0) {
    const error = new Error("Invalid amount");
    error.statusCode = 400;
    throw error;
  }

  // Validate method of payment
  if (!method || !["online", "offline"].includes(method)) {
    const error = new Error("Invalid payment method");
    error.statusCode = 400;
    throw error;
  }

  // Idempotency: if a payment with same idempotencyKey exists, return it
  if (idempotencyKey) {
    const existing = await Payment.findOne({
      idempotencyKey,
      provider: "stripe",
    });
    if (existing) {
      // If existing has providerSessionId and is pending, return it so client re-uses same URL
      if (existing.providerSessionId && existing.status === "pending") {
        return {
          sessionId: existing.providerSessionId,
          sessionUrl: existing.meta?.sessionUrl,
          payment: existing,
        };
      }
      // Otherwise return existing payment
      return {
        payment: existing,
        booking: bookingId ? await Booking.findById(bookingId) : null,
      };
    }
  }

  // POST-BOOKING FLOW (Service Booking doesn't require Deposit)
  if (bookingId) {
    const booking = await Booking.findById(bookingId).populate("serviceId");
    if (!booking) {
      const error = new Error("Booking Not Found");
      error.statusCode = 400;
      throw error;
    }

    const service = booking.serviceId;
    const vendorId = booking.vendorId;
    const servicePrice = service?.price ?? 0;

    // If service requires a deposit, disallow offline.
    if (service?.requireDeposit && method === "offline") {
      const error = new Error(
        "Offline payments are not allowed for deposit-required services"
      );
      error.statusCode = 400;
      throw error;
    }

    // Compute remaining balance from existing successful payments
    const priorPayments = await Payment.find({
      bookingId,
      status: "paid",
    }).select("amountPaid");
    const totalPaid = priorPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const remaining = Math.max(servicePrice - totalPaid, 0);

    if (amount > remaining) {
      const error = new Error(
        `Payment exceeds remaining balance (${remaining}).`
      );
      error.statusCode = 400;
      throw error;
    }

    // create pending payment record (will be finalized in webhook)
    const paymentDoc = await Payment.create({
      bookingId,
      serviceId: service._id,
      vendorId,
      amountExpected: amount,
      amountPaid: 0,
      currency: service.currency || process.env.CURRENCY,
      method,
      provider,
      status: "pending",
      idempotencyKey,
      meta,
    });

    const currency = (
      process.env.CURRENCY ||
      service.currency ||
      "usd"
    ).toLowerCase();

    const stripe = await stripeInstance(vendorId);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: booking.client?.email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `${service.name} - Booking #${bookingId}`,
            },
            unit_amount: unitAmount(currency, amount),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/booking/${bookingId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/${bookingId}?payment=cancel`,
      metadata: {
        paymentId: String(paymentDoc._id),
        bookingId: String(bookingId),
        vendorId: String(vendorId),
      },
    });
    // persist session info on payment
    paymentDoc.providerSessionId = session.id;
    paymentDoc.meta = { ...paymentDoc.meta, sessionUrl: session.url };
    await paymentDoc.save();

    return {
      sessionId: session.id,
      sessionUrl: session.url,
      payment: paymentDoc,
      booking,
    };
  }

  // PRE-BOOKING (DEPOSIT-FIRST) FLOW
  if (!serviceId) {
    const error = new Error("serviceId is required for pre-booking deposits");
    error.statusCode = 400;
    throw error;
  }

  // Validate service existence
  const service = await Service.findById(serviceId);
  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if service requires deposit
  if (!service.requireDeposit) {
    const error = new Error(
      "This service does not require a deposit; create the booking first, then pay."
    );
    error.statusCode = 400;
    throw error;
  }
  // Check if payment method is allowed
  if (method === "offline") {
    const error = new Error(
      "Offline payments are not allowed for deposit-required services"
    );
    error.statusCode = 400;
    throw error;
  }

  // Deposit validation
  const servicePrice = service.price;
  const minDeposit = service.depositAmount || servicePrice * 0.25; // min of 25%
  if (amount < minDeposit) {
    const error = new Error(`Minimum deposit of ${minDeposit} required`);
    error.statusCode = 400;
    throw error;
  }

  // Create pending payment record tied to the reservation
  const paymentDoc = await Payment.create({
    reservationId,
    serviceId,
    vendorId: service.vendorId,
    amountExpected: amount,
    amountPaid: 0,
    currency: service.currency || process.env.CURRENCY,
    method,
    provider: "stripe",
    status: "pending",
    idempotencyKey,
    meta,
  });

  const currency = (
    process.env.CURRENCY ||
    service.currency ||
    "usd"
  ).toLowerCase();

  const stripe = stripeInstance(service.vendorId);

  // Create Stripe Checkout session, attach reservation/payment ids in metadata
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: clientEmail || undefined,
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `${service.name} — Deposit`,
          },
          unit_amount: unitAmount(currency, amount),
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.CLIENT_URL}/booking/confirm?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/booking/confirm?payment=cancel`,
    metadata: {
      paymentId: String(paymentDoc._id),
      reservationId: String(reservationId),
      serviceId: String(serviceId),
      vendorId: String(service.vendorId),
    },
  });
  // persist session info on payment
  paymentDoc.providerSessionId = session.id;
  paymentDoc.meta = { ...paymentDoc.meta, sessionUrl: session.url };
  await paymentDoc.save();

  return {
    sessionId: session.id,
    sessionUrl: session.url,
    payment: paymentDoc,
  };
};

module.exports = createPayment;
