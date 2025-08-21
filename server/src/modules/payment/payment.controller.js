const Payment = require("./payment.model");
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

  // Create the payment
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

// @desc    Get single payment by ID
// @route   GET /api/v1/payments/:paymentId
// @access  Vendor
const getPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { role } = req.user;

  // Check if the user is a vendor
  if (role !== "vendor") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  // Find payment and populate booking and vendor details
  const payment = await Payment.findById(paymentId)
    .populate("bookingId", "service date time client")
    .populate("vendorId", "email");

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

module.exports = {
  processPayment,
  getPaymentById,
};
