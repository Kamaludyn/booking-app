const express = require("express");
const router = express.Router();
const notificationsController = require("./notifications.controller");
const protect = require("../../middleware/auth");

router.use(protect);

// @route   POST /api/v1/notifications
router.post("/", notificationsController.sendNotifications);

// @route   GET /api/v1/notifications
router.get("/", notificationsController.getNotifications);

// @route   GET /api/v1/notifications/:notificationId
router.get("/:notificationId", notificationsController.getNotificationById);

module.exports = router;
