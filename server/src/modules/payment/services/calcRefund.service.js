const calculateRefund = ({
  cancelledBy, // "client" | "vendor"
  cancelTime, // Date object (when cancellation happens)
  appointmentTime, // Date object (when appointment starts)
  depositAmount, // required deposit
  paidAmount, // total amount client has already paid
  serviceDelivered = false, // for disputes / service not delivered
}) => {
  let refundable = 0;
  let reason = "";
  // If vendor cancels OR service not delivered
  if (cancelledBy === "vendor" || !serviceDelivered) {
    refundable = paidAmount; // full refund including deposit
    reason = "Vendor cancelled or service not delivered";
    return { refundable, reason };
  }

  // If client cancels
  if (cancelledBy === "client") {
    const hoursBefore = (appointmentTime - cancelTime) / (1000 * 60 * 60);

    // Cancelled >= 24 hours before appointment
    if (hoursBefore >= 24) {
      // Refund everything except deposit
      refundable = Math.max(0, paidAmount - depositAmount);
      reason = "Client cancelled early (deposit non-refundable)";
      return { refundable, reason };
    }

    // Cancelled < 24 hours before OR no-show
    refundable = 0;
    reason = "Client cancelled late or no-show (no refund)";
    return { refundable, reason };
  }

  // Fallback
  return { refundable: 0, reason: "No valid refund case" };
};

module.exports = calculateRefund;
