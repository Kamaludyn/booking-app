const jwt = require("../../lib/jwt.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("./auth.model.js");
const sendEmail = require("../../lib/sendEmail.js");

//  @desc    Registers a new user
//  @route   POST /api/v1/auth/register/:role
//  @access  Public
const register = asyncHandler(async (req, res) => {
  // Extract user details from the request body
  const { surname, othername, email, password } = req.body;

  // Role is injected from route level
  const role = req.role;

  // Basic input validation
  if (!surname || !othername || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check if user with provided email already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(409).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // Create and save the new user
  const user = await User.create({
    surname,
    othername,
    email: email.toLowerCase(),
    password,
    role,
  });

  // Generate a one-time email verification token and store it on the user document
  const token = user.generateEmailVerificationToken();
  await user.save(); // Save token changes

  // Create verification link using frontend URL and token
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const message = `Click to verify your email: ${verificationUrl}`;

  // Send verification email to user's email address
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: message,
  });

  // Sanitize user object to exclude sensitive data before responding
  const userResponse = {
    _id: user._id,
    surname: user.surname,
    othername: user.othername,
    email: user.email,
    role: user.role,
  };

  res.status(201).json({
    success: true,
    message: "Registration successful. Check your email to verify.",
    userResponse,
  });
});

//  @desc   Login a user
//  @route  POST /api/v1/auth/login
//  @access Public
const login = asyncHandler(async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  // Validate the email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find the user by email and explicitly include the password field
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  // If user doesn't exist, return unauthorized error
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Compare provided password with hashed password in DB
  const passwordMatch = await user.comparePassword(password);

  // If password doesn't match, return error
  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Credentials are valid — generate JWT token
  const token = jwt.signToken({ userId: user._id, role: user.role });

  // Prepare safe user data to send back (exclude password)
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Send token and user info as response
  res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: userResponse,
  });
});

//  @desc    Verifies a user's email
//  @route   GET /api/v1/auth/verify-email/:token
//  @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params; // Get the token from the route parameter

  if (!token) {
    res.status(400).json({
      success: false,
      message: "Missing token",
    });
  }

  // Hash the received token to compare it with the stored hashed token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Look up the user with matching token and a non-expired verification timestamp
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }, // Token must still be valid
  });

  // If no user matches or token expired, respond with error
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Token is valid — mark user as verified and clear token fields
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  // Save the updated user record
  await user.save();

  // Respond with success
  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

//  @desc   Allows an authenticated user to change their password
//  @route  PATCH /api/v1/auth/change-password
//  @access Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId; // Extracted from verified JWT

  // Find the user and explicitly include the password field
  const user = await User.findById(userId).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Prevent user from reusing their current password
  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different",
    });
  }

  // 3. Compare entered current password with stored hash
  const isPasswordMatch = await user.comparePassword(currentPassword);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // 4. Update password (hashing handled in user model pre-save hook)
  user.password = newPassword;
  await user.save();

  // Issue new JWT
  // const token = jwt.signToken({ userId: user._id, role: user.role });

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    // token,
  });
});

//  @desc   Initiates a password reset process by sending a reset link to the user's email
//  @route  POST /api/v1/auth/forgot-password
//  @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body; // Extract email from request body

  // Check if user with given email exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No user with that email",
    });
  }

  // Check if a recent token already exists and is still valid
  if (user.passwordResetExpires && user.passwordResetExpires > Date.now()) {
    return res.status(429).json({
      success: false,
      message:
        "A reset token was recently sent. Please check your email or wait 10 minutes.",
    });
  }

  // Generate password reset token and attach to user
  const resetToken = user.generatePasswordResetToken();

  //  Save user without running validation (password is not being changed)
  await user.save({ validateBeforeSave: false });

  // Construct reset link
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Define email content
  const subject = "Password Reset Request";
  const message = `You requested a password reset. Click below to reset your password:\n\n${resetURL}\n\nIf you didn't request this, ignore this message.`;

  // Send email to user
  await sendEmail({
    to: user.email,
    subject,
    text: message,
  });

  res.status(200).json({
    success: true,
    message: `A password reset link is has been sent to ${email} and will expire in 10 minutes!`,
  });
});

//  @desc   Resets user password using a valid reset token
//  @route  PATCH /api/v1/auth/reset-password/:token
//  @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params; // Extract token from URL
  const { password } = req.body; // Extract new password from request body

  // Validate provided password
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }
  // Hash provided token to match the stored hashed version
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user using the valid unexpired token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token invalid or expired, send error
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Token is invalid or has expired",
    });
  }

  // Update password (pre-save hook will hash it automatically)
  user.password = password;

  // Clear reset token fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Save the user
  // (this will trigger password hashing via pre-save hook)
  await user.save();

  // Auto-login user by issuing JWT
  const tokenPayload = { userId: user._id, role: user.role };
  const authToken = jwt.signToken(tokenPayload);

  // Respond with success + token
  res.status(200).json({
    success: true,
    message: "Password reset successful",
    token: authToken, // Include token if auto-login
    user: {
      _id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

//  @desc   Log out user
//  @route  PATCH /api/v1/auth/logout
//  @access Public
const logout = (req, res) => {
  res.json({
    success: true,
    message: "You are logged out successfully!",
  });
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
};
