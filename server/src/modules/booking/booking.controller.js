const Booking = require("./booking.model");
const Service = require("../services/services.model");
const Payment = require("../payment/payment.model");
const asyncHandler = require("express-async-handler");
const generateBookableSlots = require("./generateBookableSlots.service");
const toUtcDate = require("../../utils/convertTime");
const createPayment = require("../payment/services/createPayment.service");
const calculateRefund = require("../payment/services/calcRefund.service");
const sendNotification = require("../notifications/notifications.services");

//  @desc    Creates a new booking
//  @route   POST /api/v1/bookings
//  @access  Public
const createBooking = asyncHandler(async (req, res) => {
  // Extract and validate required input fields
  const user = req.user;
  const {
    serviceId,
    client,
    date,
    time,
    timezone,
    notes,
    recurrence,
    createdBy,
    payment,
  } = req.body;

  if (!serviceId || !client || !date || !time || !timezone || !createdBy) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Validate client contact fields based on who initiated the booking
  if (createdBy === "client") {
    if (!client.email || !client.phone) {
      return res.status(400).json({
        message: "Email and phone number are required.",
      });
    }
  } else if (createdBy === "vendor") {
    if (!client.email && !client.phone) {
      return res.status(400).json({
        message:
          "At least client email or phone is required when creating appointment.",
      });
    }
  }

  // Fetch service
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ message: "Service not found." });
  }

  // If deposit is required, delegate to payment service (pre-booking flow)
  if (service.requireDeposit) {
    if (!payment) {
      return res.status(400).json({
        message: "Payment details are required for this service.",
      });
    }
    const { payment: payDoc, booking } = await createPayment({
      serviceId,
      amount: payment.amount,
      method: payment.method,
      provider: payment.provider,
      idempotencyKey: payment.idempotencyKey,
      meta: payment.meta,
      bookingPayload: {
        client,
        date,
        time,
        timezone,
        notes,
        recurrence,
        createdBy,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Booking created with payment",
      booking,
      payment: payDoc,
    });
  }

  // Validate recurrence if provided
  if (recurrence?.repeat && recurrence.repeat !== "none") {
    const isValidRepeat = ["daily", "weekly", "monthly"].includes(
      recurrence.repeat
    );

    if (!isValidRepeat) {
      return res.status(400).json({ message: "Invalid recurrence pattern" });
    }

    if (!recurrence.interval || !recurrence.endDate) {
      return res.status(400).json({
        message: "Recurring bookings must include interval and end date",
      });
    }
  }

  // Get vendorId from services
  const vendorId = service.vendorId;

  // Calculate the slot duration
  const slotDuration = service.duration + service.bufferTime;

  // Validate the selected time slot against vendor's availability
  const availableSlots = await generateBookableSlots(
    date,
    slotDuration,
    vendorId
  );

  // Validate available slots
  if (!availableSlots) {
    return res.status(500).json({
      message: "Error generating available time slots.",
    });
  }

  // Format the selected time slot to match the available slots
  const formattedSlot = `${time.start}`.padStart(5, "0");

  if (!availableSlots.includes(formattedSlot)) {
    return res.status(400).json({
      message: `Selected time slot (${formattedSlot}) is no longer available.`,
      availableSlots,
    });
  }

  // Convert local date/time to UTC using timezone
  const startTime = toUtcDate(date, time.start, timezone);
  const endTime = toUtcDate(date, time.end, timezone);

  //   Create and save booking
  const booking = await Booking.create({
    vendorId,
    serviceId,
    client,
    date,
    time: {
      start: startTime,
      end: endTime,
    },
    timezone,
    notes,
    createdBy,
    status: "upcoming",
    payment: {
      status: "pending",
      balanceAmount: service.price, // Initial balance is the full service price
    },
    currency: service.currency,
    recurrence: recurrence || {
      repeat: "none",
    },
  });

  // Send notification to user
  if (booking.client.id !== null) {
    await sendNotification({
      userId: booking.client?.id,
      bookingId: booking._id,
      type: "BOOKING_CONFIRMED",
      channels: ["email", "inapp"],
      subject: "Booking Confirmation",
      message: `Your booking for ${service.name} on ${date} at ${time.start} has been confirmed.`,
    });
  }

  // Send notification to vendor
  await sendNotification({
    userId: booking.vendorId,
    bookingId: booking._id,
    type: "BOOKING_CONFIRMED",
    channels: ["email", "inapp"],
    subject: "Booking Confirmation",
    message: `A new booking for ${service.name} has been confirmed for ${date} at ${time.start}.`,
  });

  res.status(201).json({
    message: "Booking created successfully",
    booking,
  });
});

//  @desc    Fetch all bookings for a user (vendor or client)
//  @route   GET /api/v1/bookings
//  @access  Private
const getBookings = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;

  // Build query object
  let query = {};

  // Filter by user role
  if (role === "vendor") {
    query.vendorId = userId;
  } else if (role === "client") {
    query.client = { _id: userId };
  }

  // Query parameters for filtering and pagination
  const { status, page = 1, limit = 10 } = req.query;

  // Add status filter if provided
  if (status) {
    query.status = status;
  }

  // Fetch bookings with pagination and sorting
  const bookings = await Booking.find(query)
    .sort({ "time.start": 1 }) // Latest(Upcoming) first
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Count total bookings matching the query
  const total = await Booking.countDocuments(query);

  res.status(200).json({
    message: "Bookings fetched successfully",
    bookings,
    total,
    page: Number(page),
    limit: Number(limit),
    hasMore: page * limit < total,
  });
});

//  @desc    Fetch a single booking by ID
//  @route   GET /api/v1/bookings/:bookingId
//  @access  Private
const getBooking = asyncHandler(async (req, res) => {
  // Extract bookingId from request parameters
  const { bookingId } = req.params;

  // Fetch booking by ID
  const booking = await Booking.findById(bookingId).populate(
    "serviceId",
    "name price duration"
  );

  // If booking not found, return error
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.status(200).json({
    message: "Booking fetched successfully",
    booking,
  });
});

//  @desc    Update a booking
//  @route   PATCH /api/v1/bookings/:bookingId
//  @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { role, userId } = req.user;

  // Find booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Users can only update their own booking
  if (role === "client" && booking.client.id.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized as client" });
  }
  if (role === "vendor" && booking.vendorId.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized as vendor" });
  }

  // Role-based editable fields
  let allowedFields = [];
  if (role === "client") {
    allowedFields = ["date", "time", "notes"];
  } else if (role === "vendor") {
    allowedFields = ["date", "time", "status", "notes"];
  }

  // Filter updates
  let updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Apply updates
  Object.assign(booking, updates);
  await booking.save();

  res.status(200).json({
    message: "Booking updated successfully",
    booking,
  });
});

//  @desc    Cancel a booking
//  @route   PATCH /api/v1/bookings/:bookingId/cancel
//  @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { cancelledBy } = req.body;

  if (!["client", "vendor"].includes(cancelledBy)) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const booking = await Booking.findById(bookingId).populate("serviceId");
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  // If booking already completed, or already cancelled, disallow cancellation
  if (
    booking.status === "completed" ||
    booking.status === `cancelled_by_${cancelledBy}`
  ) {
    return res.status(400).json({
      success: false,
      message: "Cannot cancel completed, or already cancelled bookings",
    });
  }

  const depositAmount = booking.serviceId.depositAmount || 0;
  const paidAmount = booking.payment.paidAmount || 0;
  const appointmentTime = booking.time.start;
  const cancelTime = new Date();

  // calculate refund
  const { refundable, reason } = calculateRefund({
    cancelledBy,
    cancelTime,
    appointmentTime,
    depositAmount,
    paidAmount,
    serviceDelivered: booking.status === "completed",
  });

  // Create refund payment record if refundable > 0
  let refundPayment = null;
  if (refundable > 0) {
    refundPayment = await Payment.create({
      bookingId: booking._id,
      vendorId: booking.vendorId,
      serviceId: booking.serviceId._id,
      amountPaid: refundable,
      currency: booking.currency,
      method: "online",
      status: "refunded",
      note: `Refund issued: ${reason}`,
      createdAt: new Date(),
    });
  }

  // Update booking status
  booking.status =
    cancelledBy === "vendor" ? "cancelled_by_vendor" : "cancelled_by_client";
  booking.refund = {
    amount: refundable,
    reason,
    processedAt: new Date(),
  };
  booking.payment.status = "refunded";
  booking.payment.paidAmount = depositAmount;
  booking.payment.balanceAmount = 0;
  await booking.save();

  if (cancelledBy === "vendor" && booking.client.id !== null) {
    await sendNotification({
      userId: booking.client.id,
      bookingId: booking._id,
      type: "BOOKING_CANCELLED",
      channels: ["email", "inapp"],
      subject: "Booking Cancellation",
      message: `A booking for ${booking.serviceId.name} has been cancelled.`,
    });
  } else if (cancelledBy === "client") {
    await sendNotification({
      userId: booking.vendorId,
      bookingId: booking._id,
      type: "BOOKING_CANCELLED",
      channels: ["email", "inapp"],
      subject: "Booking Cancellation",
      message: `A booking for ${booking.serviceId.name} has been cancelled.`,
    });
  }
  return res.json({
    success: true,
    message: refundable > 0 ? "Refund processed" : "No refund eligible",
    data: {
      bookingId: booking._id,
      newStatus: booking.status,
      refundable,
      reason,
      refundPayment,
    },
  });
});

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking,
};
