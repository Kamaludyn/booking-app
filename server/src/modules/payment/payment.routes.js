const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const protect = require("../../middleware/auth");

// Protect all routes
router.use(protect);

// @route   POST /api/v1/payment/:bookingId/process-payment
router.post("/:bookingId/process-payment", paymentController.processPayment);

// @route   GET /api/v1/payment/me
router.get("/me", paymentController.getMyPayments);

// GET /api/v1/payment/refunds?vendorId&startDate&endDate
router.get("/refunds", paymentController.getTotalRefunds);

// GET /api/v1/payment/revenue?vendorId&startDate&endDate
router.get("/revenue", paymentController.getTotalRevenue);

// GET /api/v1/payment/balance
router.get("/balance", paymentController.getUnsettledBalance);

// @route   GET /api/v1/payment/booking/:bookingId
router.get("/booking/:bookingId", paymentController.getPaymentsByBooking);

// @route   GET /api/v1/payment/:paymentId
router.get("/:paymentId", paymentController.getPaymentById);

// @route   PATCH /api/v1/payment/:paymentId/status
router.patch("/:paymentId/status", paymentController.updatePaymentStatus);

// @route   POST /api/v1/payment/:bookingId/offline
router.post("/:bookingId/offline", paymentController.addOfflinePayment);

module.exports = router;
