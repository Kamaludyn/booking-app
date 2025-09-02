const Notification = require("./notifications.model");
const User = require("../auth/auth.model");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../lib/sendEmail");

//  @desc    Sends notifications to users via specified channels
//  @route   POST /api/v1/notifications
//  @access  Private
const sendNotifications = asyncHandler(async (req, res) => {
  const { userId, bookingId, type, channels = [], subject, message } = req.body;

  // Fetch the recipient user and get there email
  const user = await User.findById(userId).select("email");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

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
      } else if (channel === "in-app") {
        // in-app notifications are just stored in DB
        notif.sent = true;
        notif.sentAt = new Date();
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error sending notification", error });
    }

    // Save notification record to DB
    await notif.save();
    // Add this notification result to the response payload
    notifResults.push(notif);
  }

  res.status(200).json({ success: true, notifResults });
});

//  @desc    Get notifications
//  @route   GET /api/v1/notifications
//  @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // Fetch notifications from the database
  const notifs = await Notification.find({ userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({ success: true, notifs });
});

module.exports = {
  sendNotifications,
  getNotifications,
};
