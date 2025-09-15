const express = require("express");
const router = express.Router();
const { stripeWebhook } = require("./stripe.webhook");

router.post("/", stripeWebhook);

module.exports = router;
