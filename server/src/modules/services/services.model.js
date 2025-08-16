const mongoose = require("mongoose");

const serviceShema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    requireDeposit: {
      type: Boolean,
      default: false,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    bufferTime: {
      type: Number,
      default: 10,
    },
  },
  { timeStamps: true }
);

const Service = mongoose.model("Service", serviceShema);

module.exports = Service;
