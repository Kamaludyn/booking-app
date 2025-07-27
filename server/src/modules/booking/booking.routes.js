const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const protect = require("../../middleware/auth");

router.post("/", protect, bookingController.createBooking);

module.exports = router;
