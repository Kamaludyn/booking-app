const express = require("express");
const router = express.Router();
const notificationsController = require("./notifications.controller");

// @route   POST /api/v1/notifications
router.post("/", notificationsController.sendNotifications);

module.exports = router;
