const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amountPaid: {
      type: Number,
      required: true,
      validate: (v) => Number.isFinite(v) && v > 0,
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

    transactionId: { type: String, default: null },
    notes: { type: String, default: "" },

    // Prevent duplicate charges on retries
    idempotencyKey: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },

    // Raw gateway response or offline proof
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
