const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const protect = require("../../middleware/auth");

// @route   POST /api/v1/bookings
router.post("/", bookingController.createBooking);

// Protect all routes below this point
router.use(protect);

// @route   GET /api/v1/bookings
router.get("/", bookingController.getBookings);

// @route   GET /api/v1/bookings/:bookingId
router.get("/:bookingId", bookingController.getBooking);

// @route   PATCH /api/v1/bookings/:bookingId
router.patch("/:bookingId", bookingController.updateBooking);

// @route   DELETE /api/v1/bookings/:bookingId
router.delete("/:bookingId", bookingController.deleteBooking);

module.exports = router;
