const Booking = require("./booking.model");
const Service = require("../services/services.model");
const asyncHandler = require("express-async-handler");
const generateBookableSlots = require("../../utils/generateBookableSlots");
const toUtcDate = require("../../utils/convertTime").toUtcDate;

const createBooking = asyncHandler(async (req, res) => {
  //: Extract and validate required input fields
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

  // Convert local date/time to UTC using timezone
  const startDateUTC = toUtcDate(date, time.start, timezone);
  const endDateUTC = toUtcDate(date, time.end, timezone);

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

  //   Create and save booking
  const booking = await Booking.create({
    vendorId,
    serviceId,
    client,
    date,
    time: {
      start: startDateUTC,
      end: endDateUTC,
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

module.exports = { createBooking };
