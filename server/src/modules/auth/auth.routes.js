const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const protect = require("../../middleware/auth");
const limiter = require("../../middleware/rateLimiter");

// Role injector middleware
const injectRole = (role) => (req, res, next) => {
  req.role = role;
  next();
};

// @route   POST /api/v1/auth/register/vendor
router.post(
  "/register/vendor",
  injectRole("vendor"),
  limiter.registerLimiter,
  authController.register
);

// @route   POST /api/v1/auth/register/client
router.post(
  "/register/client",
  injectRole("client"),
  limiter.registerLimiter,
  authController.register
);

// @route   POST /api/v1/auth/register/staff
router.post(
  "/register/staff",
  injectRole("client"),
  limiter.registerLimiter,
  authController.register
);

// @route   POST /api/v1/auth/login
router.post("/login", authController.login, limiter.loginLimiter);

// @route   GET /api/v1/auth/verify-email/:token
router.get("/verify-email/:token", authController.verifyEmail);

// @route   PATCH /api/v1/auth/change-password
router.patch("/change-password", protect, authController.changePassword);

// @route   POST /api/v1/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// @route   PATCH /api/v1/auth/reset-password/:token
router.patch("/reset-password/:token", authController.resetPassword);

// @route   Post /api/v1/auth/logout
router.post("/logout", authController.logout);

module.exports = router;
