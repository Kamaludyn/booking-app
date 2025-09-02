const Notification = require("./notifications.model");
const User = require("../auth/auth.model");
const sendEmail = require("../../lib/sendEmail");

const sendNotification = async ({
  userId,
  bookingId,
  type,
  channels,
  subject,
  message,
}) => {
  // Fetch the recipient user and get their email
  const user = await User.findById(userId).select("email");

  const notifResults = [];

  // Loop through all requested channels and handle them one by one
  for (const channel of channels) {
    // Create a notification record for the current channel
    const notif = new Notification({
      userId,
      bookingId,
      type,
      channel,
      subject,
      message,
    });

    try {
      if (channel === "email") {
        // Send out an email notification to the user
        await sendEmail({ to: user.email, subject, text: message });
        // Mark as successfully sent

        notif.sent = true;
        notif.sentAt = new Date();
      } else if (channel === "sms") {
        // TODO: implement sendSMS later
        notif.sent = false;
      } else if (channel === "inapp") {
        // in-app notifications are just stored in DB
        notif.sent = true;
        notif.sentAt = new Date();
      }

      notif.sent = true;
      notif.sentAt = new Date();
    } catch (err) {
      notif.sent = false;
      notif.error = err.message;
      await notif.save();
      throw new Error(`Failed to send ${channel} notification: ${err.message}`);
    }

    // Save notification record to DB
    await notif.save();
    notifResults.push(notif);
  }
  return notifResults;
};

module.exports = sendNotification;
