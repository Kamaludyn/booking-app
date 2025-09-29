const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const protect = require("../../middleware/auth");

// @route   POST /api/v1/booking
router.post("/", bookingController.createBooking);

// @route   Get /api/v1/booking/confirm-booking/:bookingId/:token
router.post("/", bookingController.confirmBooking);

// Protect all routes below this point
router.use(protect);

// @route   GET /api/v1/booking
router.get("/", bookingController.getBookings);

// @route   GET /api/v1/booking/:bookingId
router.get("/:bookingId", bookingController.getBooking);

// @route   PATCH /api/v1/booking/:bookingId/reschedule
router.patch("/:bookingId/reschedule", bookingController.rescheduleBooking);

// @route   PATCH /api/v1/booking/:bookingId/cancel
router.patch("/:bookingId/cancel", bookingController.cancelBooking);

// @route   PATCH /api/v1/booking/:bookingId/cancel
router.patch("/:bookingId/cancel", bookingController.cancelBooking);

// @route   PATCH /api/v1/booking/:bookingId/completed
router.patch("/:bookingId/completed", bookingController.markAsCompleted);

module.exports = router;
