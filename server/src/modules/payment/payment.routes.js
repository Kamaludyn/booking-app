const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const protect = require("../../middleware/auth");

// Protect all routes
router.use(protect);

// @route   POST /api/v1/payment
router.post("/", paymentController.processPayment);

// @route   GET /api/v1/payment/me
router.get("/me", paymentController.getMyPayments);

// @route   GET /api/v1/payment/booking/:bookingId
router.get("/booking/:bookingId", paymentController.getPaymentsByBooking);

// @route   GET /api/v1/payment/:paymentId
router.get("/:paymentId", paymentController.getPaymentById);

// @route   PATCH /api/v1/payments/:paymentId/status
router.patch("/:paymentId/status", paymentController.updatePaymentStatus);

module.exports = router;
