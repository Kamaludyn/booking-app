const nodemailer = require("nodemailer");

// Function to send an email using Nodemailer
const sendEmail = async ({ to, subject, text }) => {
  // Create a transporter object to handle email sending
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the email using the transporter
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
