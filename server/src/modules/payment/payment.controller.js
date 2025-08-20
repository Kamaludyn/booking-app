const asyncHandler = require("express-async-handler");
const createPayment = require("./createPayment.service.js");

//  @desc    Process a payment
//  @route   POST /api/v1/Payment
//  @access  Private
const processPayment = asyncHandler(async (req, res) => {
  const {
    bookingId,
    amountPaid,
    currency,
    method,
    provider,
    notes,
    idempotencyKey,
    meta,
  } = req.body;

  const { payment, booking } = await createPayment({
    bookingId,
    amount: amountPaid,
    currency,
    method,
    notes,
    idempotencyKey,
  });

  res.status(201).json({
    success: true,
    message: "Payment recorded.",
    data: { payment, booking },
  });
});

module.exports = {
  processPayment,
};
