const mongoose = require("mongoose");
const Payment = require("./payment.model");
const Booking = require("../booking/booking.model.js");
const Service = require("../services/services.model");
const generateBookableSlots = require("../booking/generateBookableSlots.service");
const toUtcDate = require("../../utils/convertTime");
const processMockPayment = require("../../lib/mockPaymentGateway.js");

const createPayment = async ({
  bookingId,
  serviceId,
  amount,
  method,
  provider = "stripe",
  idempotencyKey = null,
  meta = null,
  bookingPayload, // only for pre-booking flow
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

    // Process gateway payment
    const gateway = await processMockPayment({
      amount,
      currency: service.currency,
    });
    if (!gateway.success) {
      return {
        success: false,
        message: "Payment failed at gateway",
        gateway,
      };
    }

    // Record the Payment + update Booking.
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const payment = await Payment.create(
        [
          {
            bookingId,
            serviceId: service._id,
            vendorId,
            amountPaid: amount,
            currency: service.currency,
            method,
            provider,
            status: "paid",
            idempotencyKey,
            meta,
          },
        ],
        { session }
      );

      const newTotalPaid = totalPaid + amount;
      const balanceAmount = Math.max(servicePrice - newTotalPaid, 0);

      // Update payment status based on new total paid
      const newPaymentStatus =
        newTotalPaid === 0
          ? "unpaid"
          : balanceAmount === 0
          ? "paid"
          : "partial";

      booking.payment = { status: newPaymentStatus, balanceAmount };
      booking.paidAmount = newTotalPaid;
      await booking.save({ session });

      await session.commitTransaction();
      session.endSession();

      return { payment: payment[0], booking };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // PRE-BOOKING (DEPOSIT-FIRST) FLOW
  if (!serviceId || !bookingPayload) {
    const error = new Error(
      "serviceId and bookingPayload are required for pre-booking deposits"
    );
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

  // Validate slot availability before charging
  const vendorId = service.vendorId;
  const slotDuration = (service.duration || 0) + (service.bufferTime || 0);
  const { date, time, timezone, client, notes, recurrence, createdBy } =
    bookingPayload;

  const availableSlots = await generateBookableSlots(
    date,
    slotDuration,
    vendorId
  );
  const formattedSlot = `${time.start}`.padStart(5, "0");
  if (!availableSlots.includes(formattedSlot)) {
    const error = new Error(
      `Selected time slot (${formattedSlot}) is no longer available. Available slots are: ${availableSlots.join(
        ", "
      )}`
    );
    error.statusCode = 400;
    throw error;
  }

  // Process gateway payment
  const gateway = await processMockPayment({
    amount,
    currency: service.currency,
  });
  if (!gateway.success) {
    return {
      success: false,
      message: "Payment failed at gateway",
      gateway,
    };
  }

  // Create Booking + Payment atomically (so we never block a slot unless payment succeeded)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const startTime = toUtcDate(date, time.start, timezone);
    const endTime = toUtcDate(date, time.end, timezone);

    // Compute summary for the new booking
    const balanceAmount = Math.max(servicePrice - amount, 0);
    const paymentStatus = balanceAmount === 0 ? "paid" : "partial";

    const [booking] = await Booking.create(
      [
        {
          vendorId,
          serviceId,
          client,
          date,
          time: { start: startTime, end: endTime },
          timezone,
          notes,
          createdBy,
          status: "upcoming",
          payment: { status: paymentStatus, paidAmount: amount, balanceAmount },
          currency: service.currency,
          recurrence: recurrence || { repeat: "none" },
        },
      ],
      { session }
    );

    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          serviceId: service._id,
          vendorId,
          amountPaid: amount,
          currency: service.currency,
          method,
          provider,
          status: "paid",
          idempotencyKey,
          meta,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { payment, booking };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = createPayment;
