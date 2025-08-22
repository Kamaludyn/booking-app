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
// @route   GET /api/v1/payment/:paymentId
// @access  Vendor
const getPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { userId, role } = req.user;

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

  // Validate vendor
  if (
    role !== "vendor" &&
    payment.vendorId._id.toString() !== userId.toString()
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  res.status(200).json({
    message: "Payment fetched successfully",
    payment,
  });
});

// @desc    Get all payments for a specific booking
// @route   GET /api/v1/payment/booking/:bookingId
// @access  Public
const getPaymentsByBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { userId, role } = req.user;

  // Find all payments for the booking
  const payments = await Payment.find({ bookingId })
    .populate("bookingId", "serviceId date time client vendorId")
    .populate("vendorId", "name email")
    .sort({ createdAt: -1 });

  // Check if payments exist
  if (!payments || payments.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No payments found for this booking",
    });
  }

  const booking = payments[0].bookingId;

  // Authorization checks
  if (role === "vendor" && booking.vendorId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "Not authorized to view these payments",
    });
  }

  if (role === "client" && booking.client.id.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "Not authorized to view these payments",
    });
  }

  res.status(200).json({
    message: "All payments fetched successfully",
    count: payments.length,
    payments,
  });
});

// @desc    Get all payment related to the authenticated user
// @route   GET /api/v1/payments/me
// @access  Vendor
const getMyPayments = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;

  let payments = [];

  if (role === "vendor") {
    payments = await Payment.find({ vendorId: userId }).sort({ createdAt: -1 });
  } else if (role === "client") {
    payments = await Payment.find({ clientId: userId }).sort({ createdAt: -1 });
  } else {
    return res.status(403).json({
      message: "Not authorized to view payments",
    });
  }

  res.status(200).json({
    message: "Payments fetched successfully",
    count: payments.length,
    payments,
  });
});

module.exports = {
  processPayment,
  getPaymentById,
  getPaymentsByBooking,
  getMyPayments,
};
