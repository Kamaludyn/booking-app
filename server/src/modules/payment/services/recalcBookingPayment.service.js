const Payment = require("../payment.model");

const recalcBookingPayment = async (booking) => {
  // Get all existing(paid/refund) payments for the booking
  const existingPayments = await Payment.find({
    bookingId: booking._id,
    status: { $in: ["paid", "refunded"] },
  })
    .select("amountPaid status")
    .populate("serviceId", "price");

  const payments = existingPayments || [];

  // Sum up amounts by status
  const paid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amountPaid, 0);

  const refunded = payments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amountPaid, 0);

  const servicePrice = payments[0].serviceId.price;
  const netPaid = paid - refunded;
  const balance = servicePrice - netPaid;

  // update booking.payment fields
  booking.payment.paidAmount = netPaid;
  booking.payment.balanceAmount = balance;

  if (netPaid === 0) booking.payment.status = "pending";
  else if (netPaid < servicePrice && netPaid > 0)
    booking.payment.status = "partial";
  else if (netPaid >= servicePrice) booking.payment.status = "paid";

  await booking.save();
};

module.exports = recalcBookingPayment;
