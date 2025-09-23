const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const Payment = require("../payment.model");
const Booking = require("../../booking/booking.model");
const Reservation = require("../../reservation/reservation.model");
const recalcBookingPayment = require("../services/recalcBookingPayment.service.js");
const toUtcDate = require("../../../utils/convertTime");
const Service = require("../../services/services.model.js");
const sendNotification = require("../notifications/notifications.services.js");

// @desc   Stripe payment webhook
// @route   GET /api/v1/payments/stripe/webhook
// @access  Stripe
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the webhook event
  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const paymentId = metadata.paymentId;

        if (!paymentId) {
          console.warn(
            "Session completed without a paymentId in metadata.",
            metadata
          );
          break;
        }

        // Use a transaction for the entire process
        const sessionDB = await mongoose.startSession();
        await sessionDB.withTransaction(async () => {
          // Find the payment doc and lock it for update
          const payment = await Payment.findById(paymentId)
            .populate("bookingId", "client date time")
            .session(sessionDB);

          if (!payment) {
            throw new Error(`Payment with ID {paymentId} not found.`);
          }

          // Finalize payment doc if found
          // Idempotency check
          if (payment.status === "paid") {
            console.log(`Payment ${paymentId} already processed. Skipping.`);
            return;
          }

          // mark paid
          payment.status = "paid";
          payment.providerPaymentIntentId = session.payment_intent;
          payment.amountPaid = session.amount_total / 100;
          await payment.save({ session: sessionDB });

          // If tied to an existing booking, recalc
          if (payment.bookingId) {
            const booking = payment.bookingId;

            await recalcBookingPayment(payment.bookingId);

            // Send notification to user
            await sendNotification({
              email: booking.client.email,
              userId: booking.client.Id,
              bookingId: booking._id,
              type: "PAYMENT_RECEIVED",
              channels: ["email", "inapp"],
              subject: "Payment Confirmation",
              message: `We’ve received your payment of ${payment.currency}${
                payment.amountPaid
              } for your booking on ${
                booking.date
              } at ${booking.time.start.toLocaleTimeString()}. Thank you!`,
            });

            // Send notification to vendor
            await sendNotification({
              userId: payment.vendorId,
              bookingId: payment.bookingId,
              type: "PAYMENT_RECEIVED",
              channels: ["email", "inapp"],
              subject: "Payment Confirmation",
              message: `${booking.client.name || "A client"} has paid ${
                payment.currncy
              }${payment.amountPaid} for their booking on ${
                booking.date
              } at ${booking.time.start.toLocaleTimeString()}.`,
              link: `/dashboard/payments/${payment._id}`,
            });
          } else if (payment.reservationId) {
            // PRE-BOOKING: create booking from reservation and attach payment.bookingId
            const reservation = await Reservation.findById(
              payment.reservationId
            ).session(sessionDB);
            if (!reservation) {
              // reservation might have expired but payment succeeded.

              //  Send notification to vendor
              await sendNotification({
                userId: payment.vendorId,
                type: "MISSING_RESERVATION",
                channel: ["email", "inapp"],
                subject: "Payment received without reservation",
                message: `A payment was successfully received for your service "${
                  payment.serviceId.name
                }"
                from client ${payment.clientSnapshot.name} (${
                  payment.clientSnapshot.email || payment.clientSnapshot.phone
                }).
                However, the associated reservation could not be found, so no booking was created automatically.
                Please review this payment and create a booking manually if needed or contact the client.`,
                link: `/dashboard/payments/${payment._id}`,
              });

              // Abort the transaction
              throw new Error(
                `Reservation ${payment.reservationId} not found for payment ${paymentId}. Transaction aborted.`
              );
            }

            const { bookingPayload, serviceId, vendorId } = reservation;
            // compute start/end in UTC
            const startTime = toUtcDate(
              bookingPayload.date,
              bookingPayload.time.start,
              bookingPayload.timezone
            );
            const endTime = toUtcDate(
              bookingPayload.date,
              bookingPayload.time.end,
              bookingPayload.timezone
            );
            // compute balance
            const service = await Service.findById(serviceId);
            const servicePrice = Number(service?.price || 0);
            const paid = Number(payment.amountPaid || 0);
            const balanceAmount = Math.max(servicePrice - paid, 0);
            const paymentStatus = balanceAmount === 0 ? "paid" : "partial";

            const [booking] = await Booking.create(
              [
                {
                  vendorId,
                  serviceId,
                  client: bookingPayload.client,
                  date: bookingPayload.date,
                  time: { start: startTime, end: endTime },
                  timezone: bookingPayload.timezone,
                  notes: bookingPayload.notes,
                  createdBy: bookingPayload.createdBy,
                  status: "upcoming",
                  payment: {
                    status: paymentStatus,
                    paidAmount: payment.amountPaid,
                    balanceAmount,
                  },
                  currency: service.currency || process.env.CURRENCY,
                  recurrence: bookingPayload.recurrence || {
                    repeat: "none",
                  },
                },
              ],
              { session: sessionDB }
            );

            // link payment to new booking
            payment.bookingId = booking._id;
            await payment.save({ session: sessionDB });

            // cleanup reservation
            await Reservation.findByIdAndDelete(reservation._id, {
              session: sessionDB,
            });

            // Send notification to user
            await sendNotification({
              email: booking.client.email,
              userId: booking.client?.id,
              bookingId: booking._id,
              type: "PAYMENT_RECEIVED",
              channels: ["email", "inapp"],
              subject: "Payment Confirmation",
              message: `We’ve received your payment of ${payment.curreny}${
                payment.amountPaid
              } for your booking on ${
                booking.date
              } at ${booking.time.start.toLocaleTimeString()}. Thank you!`,
            });

            // Send notification to vendor
            await sendNotification({
              userId: booking.vendorId,
              bookingId: booking._id,
              type: "PAYMENT_RECEIVED",
              channels: ["email", "inapp"],
              subject: "Payment Confirmation",
              message: `${
                booking.client?.name || "A client"
              } has paid ${amountPaid} ${currency} for their booking on ${
                booking.date
              } at ${booking.time.start.toLocaleTimeString()}.`,
            });
          }
        });

        await sessionDB.endSession();
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const paymentId = metadata.paymentId;
        if (paymentId) {
          await Payment.findByIdAndUpdate(paymentId, { status: "failed" });
        }
        // release reservation if present
        const reservationId = metadata.reservationId;
        if (reservationId) {
          await Reservation.findByIdAndDelete(reservationId);
        }
        break;
      }
      case "payment_intent.succeeded": {
        const intent = event.data.object;
        console.log(
          `PaymentIntent ${intent.id} succeeded for ${intent.amount / 100} ${
            intent.currency
          }`
        );

        // Update Payment doc if metadata exists
        const metadata = intent.metadata || {};
        if (metadata.paymentId) {
          const payment = await Payment.findById(metadata.paymentId);
          if (payment && payment.status !== "paid") {
            payment.status = "paid";
            payment.amountPaid = Number(payment.amountExpected);
            payment.providerPaymentIntentId = intent.id;
            await payment.save();
          }
        }

        break;
      }

      default:
        break;
    }
    res.json({ received: true });
  } catch (error) {
    return res.status(500).send("Webhook handler failed");
  }
};

module.exports = { stripeWebhook };
