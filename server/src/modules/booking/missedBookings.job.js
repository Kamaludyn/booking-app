const Booking = require("./booking.model");
const sendNotification = require("../notifications/notifications.services");

const checkMissedBookings = async () => {
  const now = new Date();

  try {
    const missedBookings = await Booking.find({
      "time.end": { $lt: now },
      status: { $in: ["upcoming", "rescheduled"] },
    }).populate("serviceId");

    for (let booking of missedBookings) {
      booking.status = "missed";
      await booking.save({ validateBeforeSave: false });

      // notify client (if not a guest)
      if (booking.client.id) {
        await sendNotification({
          userId: booking.client.id,
          bookingId: booking._id,
          type: "BOOKING_CANCELLED",
          channels: ["email", "inapp"],
          subject: "Missed Appointment",
          message: "You missed your scheduled appointment.",
        });
      }

      // notify vendor
      await sendNotification({
        userId: booking.vendorId,
        bookingId: booking._id,
        type: "BOOKING_CANCELLED",
        channels: ["email", "inapp"],
        subject: "Missed Appointment",
        message: `Client ${
          booking.client.name || "Guest"
        } missed their appointment for ${
          booking.serviceId.name || "a service"
        } on ${booking.date} at ${booking.time.start}.`,
      });
    }
  } catch (err) {
    console.error("Error checking missed bookings:", err.message);
  }
};

// run every 10 minute
setInterval(checkMissedBookings, 10 * 60 * 1000);

module.exports = checkMissedBookings;
