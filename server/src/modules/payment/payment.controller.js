const Payment = require("./payment.model");
const Booking = require("../booking/booking.model");
const asyncHandler = require("express-async-handler");
const createPayment = require("./createPayment.service.js");
const recalcBookingPayment = require("./recalcBookingPayment.service.js");

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
  if (role !== "vendor" && payment.vendorId.toString() !== userId.toString()) {
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

  // Get payments based on user role
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

// @desc    Update payment status (and related booking if needed)
// @route   PATCH /api/v1/payments/:paymentId/status
// @access  Vendor
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { status, notes } = req.body;
  const { userId, role } = req.user;

  // Validate input
  if (!status) {
    return res.status(400).json({
      message: "Status is required",
    });
  }

  // Restrict clients from making updates
  if (role === "client") {
    return res
      .status(403)
      .json({ message: "Clients cannot update online payments manually" });
  }

  // Fetch payment details
  const payment = await Payment.findById(paymentId).populate(
    "bookingId",
    "vendorId status"
  );

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  // Authorization checks
  if (payment.method === "offline" && role !== "vendor") {
    return res
      .status(403)
      .json({ message: "Only vendor can update offline payments" });
  }

  if (
    role === "vendor" &&
    payment.bookingId.vendorId.toString() !== userId.toString()
  ) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this payment" });
  }

  // Validate allowed status
  const validStatuses = ["pending", "paid", "failed", "refunded"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }

  // Prevent illegal transitions
  const currentStatus = payment.status;
  const method = payment.method;

  const booking = payment.bookingId;
  // payment.status = status;
  if (method === "offline" || method === "online") {
    if (currentStatus === "pending") {
      if (status === "paid") {
        payment.status = "paid";
      } else if (status === "failed") {
        payment.status = "failed";
        if (booking.status === "upcoming") {
          booking.status = "cancelled";
          await booking.save();
        }
      } else {
        return res.status(400).json({
          message: `Invalid status transition for ${method} payment`,
        });
      }
    } else if (currentStatus === "paid" && status === "refunded") {
      payment.status = "refunded";
      if (booking.status === "upcoming") {
        booking.status = "cancelled";
        await booking.save();
      }
    } else {
      return res.status(400).json({
        message: `Invalid status transition for ${method} payment`,
      });
    }
  }

  if (notes) payment.notes = notes;
  await payment.save();

  res.status(200).json({
    message: "Payment updated successfully",
    payment,
  });
});

// @desc   Add offline payment
// @route   POST /api/v1/payments/:bookingId/offline
// @access  Vendor
const addOfflinePayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { amount, method, currency, notes } = req.body;
  const { userId, role } = req.user;

  // Validate inputs
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Amount is required" });

  if (method !== "offline")
    return res.status(400).json({ message: "Invalid payment method" });
  if (!notes)
    return res
      .status(400)
      .json({ message: "A notes describing payment type is required" });

  // Fetch booking
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // Authorization check
  if (role !== "vendor" || booking.vendorId.toString() !== userId.toString())
    return res.status(403).json({ message: "Not authorized" });

  // Check if booking is already paid
  if (amount > booking.payment.balanceAmount) {
    return res
      .status(400)
      .json({ message: "Amount exceeds remaining balance" });
  }

  // Create offline payment
  const payment = await Payment.create({
    bookingId,
    serviceId: booking.serviceId,
    vendorId: userId,
    amountPaid: amount,
    currency,
    method,
    provider: "manual",
    status: "paid",
    notes,
  });

  // Recalculate booking payment and status
  await recalcBookingPayment(booking);

  res.status(201).json({ success: true, payment, booking });
});

module.exports = {
  processPayment,
  getPaymentById,
  getPaymentsByBooking,
  getMyPayments,
  updatePaymentStatus,
  addOfflinePayment,
};
