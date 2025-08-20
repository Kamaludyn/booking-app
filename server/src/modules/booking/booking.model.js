const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Reference to the vendor who owns the service
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Reference to the service being booked
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    // Client information
    client: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // Null for guest bookings
      },
      name: { type: String, required: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String },
    },
    // Appointment date and time (in vendor's timezone)
    date: {
      type: String, // Format: YYYY-MM-DD
      match: /^\d{4}-\d{2}-\d{2}$/,
      required: true,
      index: true,
    },
    time: {
      start: { type: Date, required: true }, // UTC
      end: { type: Date, required: true },
    },
    timezone: {
      type: String,
      required: true,
    }, // IANA format

    // Booking status
    status: {
      type: String,
      enum: ["upcoming", "completed", "missed", "cancelled", "rescheduled"],
      default: "upcoming",
      index: true,
    },

    // Payment info
    payment: {
      status: {
        type: String,
        enum: ["unpaid", "partial", "paid"],
        default: "unpaid",
      },
      balanceAmount: { type: Number, default: 0 },
    },
    currency: {
      type: String,
      required: true,
    },
    // Reminder status
    reminderStages: {
      at24h: { type: Boolean, default: false },
      at3h: { type: Boolean, default: false },
      at1h: { type: Boolean, default: false },
    },
    vendorPromptSent: { type: Boolean, default: false },
    // Recurrence settings for repeating bookings
    recurrence: {
      repeat: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none",
      },
      interval: { type: Number, min: 1 },
      endDate: { type: Date }, // Format: YYYY-MM-DD
    },
    // Additional notes or instructions for the booking
    notes: {
      type: String,
      trim: true,
    },
    cancellationReason: { type: String, trim: true },
    rescheduleHistory: [
      {
        oldStart: Date,
        oldEnd: Date,
        changedAt: { type: Date, default: Date.now },
        reason: String,
      },
    ],
    createdBy: {
      type: String,
      enum: ["client", "vendor", "staff"],
      required: true,
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for frequent queries
bookingSchema.index({ vendorId: 1, date: 1, status: 1 });
bookingSchema.index({ "client.email": 1 });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
