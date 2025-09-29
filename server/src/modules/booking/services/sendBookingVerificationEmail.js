const crypto = require("crypto");
const sendEmail = require("../../../lib/sendEmail");

// Generate a booking verification token, set expiry, and send email
const sendBookingVerificationEmail = async (bookingId, clientEmail) => {
  // Generate token & hash
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Expiry timestamp
  const expiresAt = Date.now() + 1000 * 60 * 10; // 10 minutes

  // Build verification URL
  const verificationUrl = `${process.env.CLIENT_URL}/confirm-booking/${bookingId}/${token}`;

  // Email message
  const message = `Click to confirm your booking: ${verificationUrl}. 
The link will expire in 10 minutes, after which your booking slot will be released.`;

  // Send email
  await sendEmail({
    to: clientEmail,
    subject: "Confirm your booking",
    text: message,
  });

  return { hashedToken, expiresAt };
};

module.exports = sendBookingVerificationEmail;
