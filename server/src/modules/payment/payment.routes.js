const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const protect = require("../../middleware/auth");

// Protect all routes
router.use(protect);

// @route   POST /api/v1/payment
router.post("/", paymentController.processPayment);

module.exports = router;
