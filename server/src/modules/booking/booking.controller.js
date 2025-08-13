const Booking = require("./booking.model");
const Service = require("../services/services.model");
const User = require("../auth/auth.model");
const asyncHandler = require("express-async-handler");
const generateBookableSlots = require("../../utils/generateBookableSlots");
const toUtcDate = require("../../utils/convertTime");

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
    payment,
    createdBy,
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

  // Fetch service to check existence and pricing/deposit requirement
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ message: "Service not found." });
  }

  const servicePrice = service.price;
  const amountPaid = payment?.amountPaid || 0;
  let paymentMethod = payment?.method || "online";
  let paymentProvider = payment?.provider || "stripe";

  // Handle deposit requirement for services that need it
  if (service.requireDeposit) {
    if (paymentMethod === "offline") {
      return res.status(400).json({
        message: "Offline payment not allowed for services requiring a deposit",
      });
    }

    //  Validate minimum deposit amount
    const minDeposit = service.depositAmount || servicePrice * 0.25; // min of 25%
    if (amountPaid < minDeposit) {
      return res.status(400).json({
        message: `Minimum deposit of ${minDeposit} required`,
        requiredDeposit: minDeposit,
      });
    }
  }

  // Determine payment status
  const paymentStatus =
    amountPaid >= servicePrice ? "paid" : amountPaid > 0 ? "partial" : "unpaid";

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
      status: paymentStatus,
      method: paymentMethod,
      provider: paymentProvider,
      amountPaid,
      history:
        amountPaid > 0
          ? [
              {
                amount: amountPaid,
                method: paymentMethod,
                provider: paymentProvider,
                date: new Date(),
                note: payment?.note || "",
                transactionId: payment?.transactionId || "",
              },
            ]
          : [],
    },
    balanceAmount: paymentStatus === "partial" ? servicePrice - amountPaid : 0,
    reminder: {
      sent: false,
      sentAt: null,
    },
    recurrence: recurrence || {
      repeat: "none",
    },
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

//  @desc    Update a bookiing
//  @route   GET /api/v1/bookings/:bookingId
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

//  @desc    Delete a booking (soft delete by changing status)
//  @route   DELETE /api/v1/bookings/:bookingId
//  @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { role, userId } = req.user;

  // Find booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Authorization checks
  if (role === "client" && booking.client.id.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized as client" });
  }
  if (role === "vendor" && booking.vendorId.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized as vendor" });
  }

  // Prevent cancelling completed or past bookings
  const now = new Date();
  if (booking.status === "completed" || booking.date < now) {
    return res
      .status(400)
      .json({ message: "Cannot cancel completed or past bookings" });
  }

  // Soft delete / set status
  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    message: "Booking cancelled successfully",
    booking,
  });
});

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
};
