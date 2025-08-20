const sendEmail = require("./sendEmail.js");
const { DateTime } = require("luxon");

// Sends a follow-up email to the vendor to prompt status update for a past appointment that hasn't been marked as "Completed" or "Missed".
const sendVendorPromptEmail = async (to, booking) => {
  // Format the appointment time to a readable date/time string
  const formattedTime = DateTime.fromJSDate(booking.time).toFormat("fff");

  const subject = "Action Needed: Update Appointment Status";

  const text = `
    Hi ${booking.vendorName || "there"},

    This is a reminder that your appointment with ${
      booking.clientName || "a client"
    } on ${formattedTime} has already passed,
    but the status is still marked as "${booking.status}".

    Please log in to your dashboard and update the appointment as either "Completed" or "No-show" to keep your records accurate.

    Thank you for keeping your schedule up to date.

    — Bookify
  `;

  // Send the email
  await sendEmail({ to, subject, text });
};

module.exports = sendVendorPromptEmail;
