const User = require("../auth/auth.model");
const Booking = require("./booking.model");
const Service = require("../services/services.model");
const Payment = require("../payment/payment.model");
const Reservation = require("../reservation/reservation.model");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const generateBookableSlots = require("./generateBookableSlots.service");
const toUtcDate = require("../../utils/convertTime");
const createPayment = require("../payment/services/createPayment.service");
const calculateRefund = require("../payment/services/calcRefund.service");
const sendNotification = require("../notifications/notifications.services");

const RESERVATION_TTL_MINUTES = process.env.RESERVATION_TTL_MINUTES || 15;

//  @desc    Creates a new booking
//  @route   POST /api/v1/bookings
//  @access  Public
const createBooking = asyncHandler(async (req, res) => {
  // Extract and validate required input fields
  const {
    serviceId,
    client,
    date,
    time,
    timezone,
    notes,
    recurrence,
    createdBy,
    payments,
  } = req.body;

  // If user is logged in, get their details
  const user = await User.findById(req.user?.userId);

  // Validate required fields
  if (!serviceId || !client || !date || !time || !timezone || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  // Validate time format
  if (
    !time.start ||
    !time.end ||
    !/^\d{2}:\d{2}$/.test(time.start) ||
    !/^\d{2}:\d{2}$/.test(time.end)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid time format. Use { start: 'HH:mm', end: 'HH:mm' }",
    });
  }

  // Validate client contact fields based on who initiated the booking
  if (!user || createdBy === "client") {
    if (!client.name && !client.email) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required.",
      });
    }
  } else if (createdBy === "vendor") {
    if (!client.email && !client.phone) {
      return res.status(400).json({
        success: false,
        message:
          "At least client email or phone is required when creating appointment.",
      });
    }
  }

  // Fetch service
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found.",
    });
  }

  // Validate recurrence if provided
  if (recurrence?.repeat && recurrence.repeat !== "none") {
    const isValidRepeat = ["daily", "weekly", "monthly"].includes(
      recurrence.repeat
    );

    if (!isValidRepeat) {
      return res.status(400).json({
        success: false,
        message: "Invalid recurrence pattern",
      });
    }

    if (!recurrence.interval || !recurrence.endDate) {
      return res.status(400).json({
        success: false,
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
      success: false,
      message: "Error generating available time slots.",
    });
  }

  // Format the selected time slot to match the available slots
  const formattedSlot = `${time.start}`.padStart(5, "0");

  if (!availableSlots.includes(formattedSlot)) {
    return res.status(400).json({
      success: false,
      message: `Selected time slot (${formattedSlot}) is no longer available. ${
        availableSlots.length > 0
          ? "These are the available slots for the date selected:" +
            availableSlots.join(", ")
          : "There are no more slots available on this date"
      }`,
    });
  }

  // If deposit is required, delegate to payment service (pre-booking flow)
  if (service.requireDeposit && user.role !== "vendor") {
    if (!payments) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required for this service.",
      });
    }

    // create reservation
    const reservation = await Reservation.create({
      vendorId,
      serviceId,
      date,
      timeStart: time.start,
      timeEnd: time.end,
      timezone,
      bookingPayload: {
        client: {
          id: user._id || null, // null for guests
          name: client.name,
          email: client.email,
          phone: client.phone || null,
        },
        date,
        time,
        timezone,
        notes,
        recurrence,
        createdBy,
      },
      expiresAt: new Date(Date.now() + RESERVATION_TTL_MINUTES * 60000),
    });

    const { payment: payDoc, sessionUrl } = await createPayment({
      reservationId: reservation._id,
      serviceId,
      vendorId,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      amount: payments.amount,
      method: payments.method,
      provider: payments.provider,
      notes: payments.notes,
    });

    return res.status(201).json({
      success: true,
      message: "Reservation created, awaiting deposit payment",
      payment: payDoc,
      checkoutUrl: sessionUrl,
    });
  }

  // Check if user is verified
  let notVerified = !user || !user.isVerified;

  // Convert local date/time to UTC using timezone
  const startTime = toUtcDate(date, time.start, timezone);
  const endTime = toUtcDate(date, time.end, timezone);

  //   Create and save booking
  const booking = await Booking.create({
    vendorId,
    serviceId,
    client: {
      id: user.userId || null, // null for guests
      name: client.name,
      email: client.email,
      phone: client.phone || null,
    },
    date,
    time: {
      start: startTime,
      end: endTime,
    },
    timezone,
    notes,
    createdBy,
    status: notVerified ? "pending_verification" : "upcoming",
    payment: {
      status: "pending",
      balanceAmount: service.price, // Initial balance is the full service price
    },
    currency: service.currency,
    recurrence: recurrence || {
      repeat: "none",
    },
  });

  if (notVerified) {
    const { hashedToken, expiresAt } = await sendBookingVerificationEmail(
      booking._id,
      client.email
    );

    booking.bookingVerificationToken = hashedToken;
    booking.bookingVerificationExpires = expiresAt;
  } else {
    // Send notification to user
    await sendNotification({
      userId: user.id,
      bookingId: booking._id,
      type: "BOOKING_CONFIRMED",
      channels: ["email", "inapp"],
      subject: "Booking Confirmation",
      message: `Your booking for ${service.name} on ${date} at ${time.start} has been confirmed.`,
    });

    // Send notification to vendor
    await sendNotification({
      userId: booking.vendorId,
      bookingId: booking._id,
      type: "BOOKING_CONFIRMED",
      channels: ["email", "inapp"],
      subject: "Booking Confirmation",
      message: `A new booking for ${service.name} has been confirmed for ${date} at ${time.start}.`,
    });
  }

  res.status(201).json({
    success: true,
    message: notVerified
      ? "Pending booking created, awaiting email confirmation"
      : "Booking created successfully",
    booking,
  });
});

//  @desc    Confirm booking through email
//  @route   GET /api/v1/booking/confirm-booking/:token
//  @access  Public
const confirmBooking = asyncHandler(async (req, res) => {
  // Get token from url parameter
  const { bookingId, token } = req.params;

  // validate parameters
  if (!bookingId || !token) {
    return res.status(400).json({
      success: false,
      message: "Booking ID and token are required.",
    });
  }

  // Hash the received token to compare it with the stored hashed token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Look up the booking with matching id, token and a non-expired verification timestamp
  const booking = await Booking.findOne({
    _id: bookingId,
    bookingVerificationToken: hashedToken,
    bookingVerificationExpires: { $gt: Date.now() }, // Token must still be valid
  });

  if (!booking) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Mark booking as verified and clear verification fields
  booking.isVerified = true;
  booking.bookingVerificationToken = undefined;
  booking.bookingVerificationExpires = undefined;

  // save updates
  await booking.save();

  // Send notification to vendor
  await sendNotification({
    userId: booking.vendorId,
    bookingId: booking._id,
    type: "BOOKING_CONFIRMED",
    channels: ["email", "inapp"],
    subject: "Booking Confirmation",
    message: `A new booking has been confirmed for ${date} at ${time.start}. Click here to view the details: ${process.env.CLIENT_URL}/bookings/${booking._id}`,
  });

  res.status(200).json({
    success: true,
    message: "Booking successfully verified!",
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
    .populate("serviceId", "name price")
    .sort({ "time.start": 1 }) // Latest(Upcoming) first
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Count total bookings matching the query
  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
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
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Booking fetched successfully",
    booking,
  });
});

//  @desc    Reschedule a booking (by updating only date or both time/date)
//  @route   PATCH /api/v1/bookings/:bookingId/reschedule
//  @access  Private
const rescheduleBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { role, userId } = req.user;

  // Find booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // Users can only update their own booking
  if (role === "client" && booking.client.id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized as client",
    });
  }
  if (role === "vendor" && booking.vendorId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized as vendor",
    });
  }

  // Only allow date and/or time updates
  let allowedFields = ["date", "time"];

  // Validate request body keys
  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid update field(s): ${invalidFields.join(", ")}`,
    });
  }

  // Apply updates
  let updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Require at least one update
  if (!updates.date && !updates.time) {
    return res.status(400).json({
      success: false,
      message: "Provide new date and/or time",
    });
  }

  // Validate date if provided
  if (updates.date) {
    const dateObj = new Date(updates.date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const now = new Date();
    if (dateObj < now) {
      return res.status(400).json({
        success: false,
        message: "Date must be in the future",
      });
    }
  }

  // Validate and convert time if provided
  if (updates.time) {
    if (!updates.time.start) {
      return res.status(400).json({
        success: false,
        message: "Start time is empty",
      });
    }
    // Expecting { start: "HH:mm", end: "HH:mm" }
    if (
      !updates.time.start ||
      !updates.time.end ||
      !/^\d{2}:\d{2}$/.test(updates.time.start) ||
      !/^\d{2}:\d{2}$/.test(updates.time.end)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use { start: 'HH:mm', end: 'HH:mm' }",
      });
    }

    // Ensure date is also provided
    if (!updates.date) {
      return res.status(400).json({
        success: false,
        message: "Updating time requires providing a date",
      });
    }

    const timezone = booking.timezone;

    // Convert local date/time to UTC using your util
    const startTime = toUtcDate(updates.date, updates.time.start, timezone);
    const endTime = toUtcDate(updates.date, updates.time.end, timezone);

    updates.time = {
      start: startTime,
      end: endTime,
    };
  }

  // Update booking status
  updates.status = "rescheduled";

  // Apply updates
  Object.assign(booking, updates);
  await booking.save();

  // Send notification
  const notificationMessage = `The booking has been rescheduled with new ${
    updates.date ? `date: ${updates.date}` : ""
  } ${
    updates.time ? `time: ${updates.time.start} to ${updates.end}` : ""
  }`.trim();

  const targetUserId =
    role === "client" ? booking.vendorId : booking.client?.id;

  // only send notification if targetUserId exists (avoid null client.id case for guest bookings)
  if (targetUserId) {
    await sendNotification({
      userId: targetUserId,
      bookingId: booking._id,
      type: "BOOKING_RESCHEDULED",
      channels: ["email", "inapp"],
      subject: "Booking Rescheduled",
      message: notificationMessage,
    });
  }

  res.status(200).json({
    success: true,
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
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
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
  return res.status(200).json({
    success: true,
    message: refundable > 0 ? "Refund processed" : "No refund eligible",
    bookingId: booking._id,
    newStatus: booking.status,
    refundable,
    reason,
    refundPayment,
  });
});

//  @desc    Mark booking as completed
//  @route   PATCH /api/v1/bookings/:bookingId/completed
//  @access  Vendor
const markAsCompleted = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { role, userId } = req.user;

  // Only vendors can mark as completed
  if (role !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Only vendors can mark a booking as completed",
    });
  }

  // Find booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // Ensure vendor owns this booking
  if (booking.vendorId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized as vendor",
    });
  }

  // Update status
  booking.status = "completed";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking marked as completed",
    booking,
  });
});

module.exports = {
  createBooking,
  confirmBooking,
  getBookings,
  getBooking,
  rescheduleBooking,
  cancelBooking,
  markAsCompleted,
};
