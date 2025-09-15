const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const Payment = require("../payment.model");
const Booking = require("../../booking/booking.model");
const Reservation = require("../../reservation/reservation.model");
const recalcBookingPayment = require("../services/recalcBookingPayment.service.js");
const toUtcDate = require("../../../utils/convertTime");

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
    console.error("Stripe signature verification failed", error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Respond early so Stripe doesn’t retry
  res.json({ received: true });

  // Handle the webhook event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const paymentId = metadata.paymentId;
        // find our payment doc
        const payment = paymentId ? await Payment.findById(paymentId) : null;
        // Finalize payment doc if found
        if (payment) {
          if (payment.status === "paid") {
            // already processed
            break;
          }

          // mark paid
          payment.status = "paid";
          payment.providerPaymentIntentId = session.payment_intent || null;
          payment.amountPaid = Number(payment.amountExpected); // store in app units
          await payment.save();

          // If tied to an existing booking, recalc
          if (payment.bookingId) {
            await recalcBookingPayment(payment.bookingId);
          } else if (payment.reservationId) {
            // PRE-BOOKING: create booking atomically from reservation and attach payment.bookingId
            const reservation = await Reservation.findById(
              payment.reservationId
            );
            if (!reservation) {
              // reservation might have expired but payment succeeded; handle gracefully: #TODO
              // create booking using metadata + payload
            } else {
              const sessionDB = await mongoose.startSession();
              sessionDB.startTransaction();
              try {
                const { bookingPayload, serviceId, vendorId } = reservation;
                // compute start/end in UTC using your util
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
                const service =
                  await require("../../services/services.model.js").findById(
                    serviceId
                  );
                const servicePrice = Number(service?.price || 0);
                const paid = Number(payment.amountPaid || 0);
                const balanceAmount = Math.max(servicePrice - paid, 0);
                const paymentStatus = balanceAmount === 0 ? "paid" : "partial";

                const [booking] = await Booking.create(
                  [
                    {
                      vendorId: reservation.vendorId,
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
                        paidAmount: paid,
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

                // link payment to booking
                payment.bookingId = booking._id;
                await payment.save({ session: sessionDB });

                // cleanup reservation
                await Reservation.findByIdAndDelete(reservation._id, {
                  session: sessionDB,
                });

                await sessionDB.commitTransaction();
                sessionDB.endSession();

                // call recalcBookingPayment (for consistency)
                await recalcBookingPayment(booking._id);
              } catch (error) {
                await sessionDB.abortTransaction();
                sessionDB.endSession();
                console.error(
                  "Failed to create booking after stripe success",
                  error
                );
                throw error;
              }
            }
          }
        } else {
          // If there's no payment document (rare), you can create one now or log
          console.warn(
            "Stripe session completed but no local payment found. Metadata:",
            metadata
          );
        }
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

      default:
        break;
    }
  } catch (error) {
    console.error("Webhook handler error", error);
    return res.status(500).send("Webhook handler failed");
  }
};

module.exports = { stripeWebhook };
