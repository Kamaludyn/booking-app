const { DateTime } = require("luxon");
const Booking = require("./booking.model.js");
const Vendor = require("../auth/auth.model.js");

const REMINDER_INTERVAL_MINUTES = 10;
const VENDOR_PROMPT_HOURS_AFTER = 2;

// Reminder stages before the appointment time
const STAGES = [
  { hoursBefore: 24, flag: "at24h" },
  { hoursBefore: 3, flag: "at3h" },
  { hoursBefore: 1, flag: "at1h" },
];

/**
 * Starts a background scheduler to:
 * - Send email reminders to clients before their appointments.
 * - Send prompts to vendors if appointments have passed but status hasn't been updated.
 *
 * Runs every 10 minutes.
 */
const startReminderScheduler = () => {
  setInterval(async () => {
    const now = DateTime.now();

    try {
      // Loop through each reminder stage (e.g., 24h, 3h, 1h before appointment)
      for (const stage of STAGES) {
        const threshold = now.plus({ hours: stage.hoursBefore });

        // Find bookings that:
        // - Have not been reminded at this stage
        // - Are still scheduled
        // - Are within the correct upcoming window
        const bookings = await Booking.find({
          [`reminderStages.${stage.flag}`]: false,
          status: { $in: ["upcoming", "rescheduled"] },
          "time.start": {
            $lte: threshold.toJSDate(),
            $gt: now.toJSDate(),
          },
        });

        // Send reminders and mark this stage as completed
        for (const booking of bookings) {
          // in-app/email notification
          if (booking.client.id) {
            await sendNotification({
              userId: booking.client.id,
              bookingId: booking._id,
              type: "BOOKING_REMINDER",
              channels: ["email", "inapp"],
              subject: `Upcoming Appointment in ${stage.hoursBefore}h`,
              message: `Reminder: You have an appointment scheduled on ${booking.date} at ${booking.time.start}.`,
            });
          }
          booking.reminderStages[stage.flag] = true;
          await booking.save();
        }
      }

      // Identify past appointments where vendor hasn't been prompted
      const promptThreshold = now.minus({ hours: VENDOR_PROMPT_HOURS_AFTER });
      const past = await Booking.find({
        vendorPromptSent: false,
        status: { $in: ["upcoming", "rescheduled"] },
        "time.end": { $lte: promptThreshold.toJSDate() },
      });

      // Send vendor prompts and mark as sent
      for (const booking of past) {
        const vendor = await Vendor.findById(booking.vendorId);

        // in-app/email notification
        await sendNotification({
          userId: vendor._id,
          bookingId: booking._id,
          type: "VENDOR_PROMPT",
          channels: ["email", "inapp"],
          subject: "Pending Appointment Update",
          message: `The appointment with ${
            booking.client.name || "a client"
          } on ${booking.date} at ${
            booking.time.start
          } has passed. Please update its status.`,
        });

        booking.vendorPromptSent = true;
        await booking.save();
      }
    } catch (error) {
      console.error("Reminder Scheduler Error");
    }
  }, REMINDER_INTERVAL_MINUTES * 60 * 1000);
};

module.exports = startReminderScheduler;
