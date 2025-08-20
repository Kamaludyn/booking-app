const sendEmail = require("./sendEmail.js");
const { DateTime } = require("luxon");

// Sends a reminder email to a client about an upcoming appointment.
const sendReminderEmail = async (to, booking, hoursBefore) => {
  // Format the appointment's start time into a readable time string
  const time = DateTime.fromJSDate(booking.time.start).toFormat("ff");

  const text = `
    Hello! Just a reminder that your appointment is scheduled for ${time}.
    This reminder is being sent ${hoursBefore} hour(s) in advance.
  `;

  // Send the reminder email
  await sendEmail({ to, subject: "Appointment Reminder", text });
};
module.exports = sendReminderEmail;
