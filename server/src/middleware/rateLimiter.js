const rateLimit = require("express-rate-limit");

// Rate limiting middleware for register user route (10 requests per hour)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many signups from this IP, slow down." },
});

// Rate limiting middleware for login route (5 requests per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts, try again later." },
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per window
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Include rate limit headers
  legacyHeaders: false,
});

module.exports = {
  registerLimiter,
  loginLimiter,
  globalLimiter,
};
