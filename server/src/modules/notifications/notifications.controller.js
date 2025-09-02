const Notification = require("./notifications.model");
const User = require("../auth/auth.model");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../lib/sendEmail");
const sendNotification = require("./notifications.services");

//  @desc    Sends notifications to users via specified channels
//  @route   POST /api/v1/notifications
//  @access  Private
const sendNotifications = asyncHandler(async (req, res) => {
  // Send notifications
  const notifications = await sendNotification(req.body);

  // Return the created notifications
  res.status(200).json({ success: true, notifications });
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

//  @desc    Get a single notification
//  @route   GET /api/v1/notification
//  @access  Private
const getNotificationById = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  // Fetch notifications from the database
  const notif = await Notification.findById(notificationId);

  res.status(200).json({ success: true, notif });
});

module.exports = {
  sendNotifications,
  getNotifications,
  getNotificationById,
};
