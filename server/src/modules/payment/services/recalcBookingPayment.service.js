const Payment = require("../payment.model");
const Booking = require("../../booking/booking.model");

const recalcBookingPayment = async (bookingId) => {
  // Get all existing(paid/refund) payments for the booking
  const existingPayments = await Payment.find({
    bookingId,
    status: { $in: ["paid", "refunded"] },
  })
    .select("amountPaid status")
    .populate("serviceId", "price");

  const booking = await Booking.findById(bookingId).select("payment");

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
  const balance = Math.max(servicePrice - netPaid, 0);

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
