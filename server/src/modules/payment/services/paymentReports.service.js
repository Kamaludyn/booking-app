const Payment = require("../payment.model");
const mongoose = require("mongoose");

/**
 * Revenue per vendor within a date range
 * Includes only successful "paid" payments.
 */
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
      },
    },
    // Third stage: reshape the output to a cleaner format
    {
      $project: {
        _id: 0, // Remove the MongoDB default _id
        vendorId: "$_id", // Rename grouped _id back to vendorId
        totalRevenue: 1, // Keep total revenue field
        totalPayments: 1, // Keep total payments count
      },
    },
  ]);

  return result.length > 0 ? result[0] : { totalRevenue: 0, payments: [] };
};

/**
 * Total refunds issued
 * Can be global (admin) or filtered by vendor.
 */
const getRefunds = async (from, to, vendorId) => {
  const matchStage = {
    vendorId: new mongoose.Types.ObjectId(vendorId),
    status: "refunded",
  };

  if (
    (from instanceof Date && !isNaN(from)) ||
    (to instanceof Date && !isNaN(to))
  ) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = from;
    if (to) matchStage.createdAt.$lte = to;
  }

  const result = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: vendorId ? "$vendorId" : null,
        totalRefunds: { $sum: "$amountPaid" },
        totalRefundCount: { $sum: 1 },
        refunds: { $push: "$$ROOT" },
      },
    },
  ]);

  return result.length > 0 ? result[0] : { totalRefunds: 0, refunds: [] };
};

module.exports = {
  getRevenue,
  getRefunds,
};
