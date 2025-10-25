const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
    category: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
    taxId: {
      type: String,
      trim: true,
    },
    stripe: {
      test: {
        secretKey: { type: String },
        webhookSecret: { type: String },
      },
      mode: {
        type: String,
        enum: ["test", "live"],
        default: "test",
      },
      liveEnabled: { type: Boolean, default: false },
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
