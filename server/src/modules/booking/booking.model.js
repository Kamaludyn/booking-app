const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Reference to the vendor who owns the service
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      required: true,
    },
    time: {
      start: { type: String, required: true }, // Format: HH:mm'
      end: { type: String, required: true }, // Format: HH:mm
    },
    //
    timezone: {
      type: String,
      required: true,
    },
    // Booking status
    status: {
      type: String,
      enum: ["upcoming", "completed", "missed", "cancelled"],
      default: "upcoming",
    },

    // Payment info
    payment: {
      status: {
        type: String,
        enum: ["unpaid", "partial", "paid"],
        default: "unpaid",
      },
      method: {
        type: String,
        enum: ["online", "offline"],
        default: "online",
      },
      provider: {
        type: String,
        enum: ["stripe", "paypal", "paystack", "manual", null],
        default: "stripe",
      },
      amountPaid: { type: Number, default: 0 },
      history: [
        {
          amount: Number,
          method: String, // online/offline
          provider: String,
          date: Date,
          note: String,
          transactionId: String, // optional
        },
      ],
    },
    balanceAmount: { type: Number, default: false },

    // Reminder status
    reminder: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date },
    },
    // Recurrence settings for repeating bookings
    recurrence: {
      repeat: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none",
      },
      interval: { type: Number },
      endDate: { type: String }, // Format: YYYY-MM-DD
    },
    // Additional notes or instructions for the booking
    notes: {
      type: String,
      trim: true,
    },
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

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
