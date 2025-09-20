const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    type: {
      type: String,
      enum: [
        "BOOKING_CONFIRMED",
        "BOOKING_CANCELLED",
        "BOOKING_RESCHEDULED",
        "BOOKING_REMINDER",
        "VENDOR_PROMPT",
        "PAYMENT_RECEIVED",
        "PAYMENT_FAILED",
        "PAYMENT_REFUNDED",
        "MISSING_RESERVATION",
      ],
      required: true,
    },
    channel: {
      type: String,
      enum: ["email", "sms", "inapp"],
      default: "email",
    },
    subject: String,
    message: String,
    link: { type: String },

    sent: { type: Boolean, default: false },
    sentAt: Date,
    error: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
