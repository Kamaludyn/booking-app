const express = require("express");
const router = express.Router();
const { stripeWebhook } = require("./stripe.webhook");

// @route   POST /api/v1/payment/stripe/webhook
router.post("/", stripeWebhook);

module.exports = router;
