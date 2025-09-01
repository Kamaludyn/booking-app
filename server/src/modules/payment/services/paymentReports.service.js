const Payment = require("../payment.model");
const Booking = require("../../booking/booking.model");
const mongoose = require("mongoose");

// Revenue per vendor within a date range
const getRevenue = async (vendorId, from, to) => {
  //  Build the initial $match stage
  const matchStage = {
    vendorId: new mongoose.Types.ObjectId(vendorId), // Convert vendorId string into MongoDB ObjectId
    status: "paid",
  };

  // Only add createdAt filter if valid Date objects are provided
  if (
    (from instanceof Date && !isNaN(from)) ||
    (to instanceof Date && !isNaN(to))
  ) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = from;
    if (to) matchStage.createdAt.$lte = to;
  }
  // Run aggregation pipeline
  const result = await Payment.aggregate([
    // First stage: filter documents (only vendor's paid payments in date range)
    { $match: matchStage },
    // Second stage: group all matching payments by vendorId
    {
      $group: {
        _id: "$vendorId", // Group by vendorId
        totalRevenue: { $sum: "$amountPaid" }, // Sum of all amounts paid for this vendor
        totalPayments: { $sum: 1 }, // Count of payments (each doc = 1 payment)
        payments: { $push: "$$ROOT" },
      },
    },
    // Third stage: reshape the output to a cleaner format
    {
      $project: {
        _id: 0, // Remove the MongoDB default _id
        vendorId: "$_id", // Rename grouped _id back to vendorId
        totalRevenue: 1, // Keep total revenue field
        totalPayments: 1, // Keep total payments count
        payments: 1, // Keep payments array
      },
    },
  ]);

  return result.length > 0 ? result[0] : { totalRevenue: 0, payments: [] };
};

// Refunds issued by a vendor within a date range
const getRefunds = async (vendorId, from, to) => {
  //  Build the initial $match stage
  const matchStage = {
    vendorId: new mongoose.Types.ObjectId(vendorId),
    status: "refunded",
  };

  // Add date range to matchStage if provided
  if (
    (from instanceof Date && !isNaN(from)) ||
    (to instanceof Date && !isNaN(to))
  ) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = from;
    if (to) matchStage.createdAt.$lte = to;
  }

  // Run aggregation pipeline
  const result = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$vendorId", // Group by vendorId
        totalRefunds: { $sum: "$amountPaid" }, // sum all refunds
        totalRefundCount: { $sum: 1 }, // refunds count
        refunds: { $push: "$$ROOT" }, // keep all refund documents
      },
    },
    {
      $project: {
        _id: 0, // Remove the MongoDB default _id
        vendorId: "$_id", // Rename grouped _id back to vendorId
        totalRefunds: 1, // Keep total refunds field
        totalRefundsCount: 1, // Keep total refunds count
        refunds: 1, // Keep refunds array
      },
    },
  ]);

  return result.length > 0 ? result[0] : { totalRefunds: 0, refunds: [] };
};

// Total Unsettled balances
const getBalance = async (vendorId) => {
  const result = await Booking.aggregate([
    {
      $match: {
        vendorId: new mongoose.Types.ObjectId(vendorId),
        "payment.status": { $in: ["pending", "partial"] },
        balanceAmount: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: "$vendorId",
        totalUnsettled: { $sum: "$balanceAmount" },
        unsettledCount: { $sum: 1 },
        unsettledBookings: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        vendorId: "$_id",
        totalUnsettled: 1,
        unsettledCount: 1,
        unsettledBookings: 1,
      },
    },
  ]);

  return result.length > 0
    ? result[0]
    : { totalUnsettled: 0, unsettledCount: 0 };
};

module.exports = {
  getRevenue,
  getRefunds,
  getBalance,
};
