const Payment = require("../payment.model");
const mongoose = require("mongoose");

/**
 * Revenue per vendor within a date range
 * Includes only successful "paid" payments.
 */
const getVendorRevenue = async (vendorId, from, to) => {
  if (!mongoose.isValidObjectId(vendorId)) {
    throw new Error("Invalid vendorId provided");
  }
  const matchStage = {
    vendorId: new mongoose.Types.ObjectId(vendorId),
    status: "paid",
  };

  if (from || to) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = new Date(from);
    if (to) matchStage.createdAt.$lte = new Date(to);
  }

  const result = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$vendorId",
        totalRevenue: { $sum: "$amountPaid" },
        totalPayments: { $sum: 1 },
        payments: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        vendorId: "$_id",
        totalRevenue: 1,
        totalPayments: 1,
      },
    },
  ]);

  return result.length > 0 ? result[0] : { totalRevenue: 0, payments: [] };
};

module.exports = {
  getVendorRevenue,
};
