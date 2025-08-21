const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const protect = require("../../middleware/auth");

// Protect all routes
router.use(protect);

// @route   POST /api/v1/payment
router.post("/", paymentController.processPayment);

// @route   GET /api/v1/payment/:paymentId
router.get("/:paymentId", paymentController.getPaymentById);

// @route   GET /api/v1/payments/booking/:bookingId
router.get("/booking/:bookingId", paymentController.getPaymentsByBooking);

module.exports = router;
