const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
    amountExpected: {
      type: Number,
      required: true,
      validate: (v) => Number.isFinite(v) && v > 0,
    },
    amountPaid: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    provider: {
      type: String,
      enum: ["stripe", "paypal", "paystack", "manual", null],
      default: "stripe",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    providerSessionId: { type: String },
    providerPaymentIntentId: { type: String },
    ClientSnapshot: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    notes: {
      type: String,
      default: "",
    },

    // Prevent duplicate charges on retries
    idempotencyKey: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },

    // Raw gateway response or offline proof
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
