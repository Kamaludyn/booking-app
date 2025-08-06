const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const protect = require("../../middleware/auth");

router.use(protect);

router.post("/", bookingController.createBooking);

router.get("/", bookingController.getBookings);

module.exports = router;
