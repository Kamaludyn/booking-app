const VendorProfile = require("./vendor.model.js");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const { extractPublicId } = require("../../lib/cloudinary");

//  @desc    Save Vendor Profile
//  @route   POST /api/v1/vendor
//  @access  Private
const saveVendorProfile = asyncHandler(async (req, res) => {
  // Authenticated user's ID from request object
  const userId = req.user.userId;

  // Profile fields from request body
  const { businessName, businessEmail, phone, address, bio, category, taxId } =
    req.body;

  if (!businessName || !businessEmail || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: "Business name, email, phone and address are required",
    });
  }

  // Fields to be updated
  const updatedData = {
    businessName,
    businessEmail,
    phone,
    address,
    bio,
    category,
    taxId,
  };

  // Find and update vendor profile
  const vendor = await VendorProfile.findOneAndUpdate(
    { userId },
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  // If no vendor profile is found, create one
  if (!vendor) {
    const profile = await VendorProfile.create({
      userId,
      ...updatedData,
    });

    return res.status(201).json({
      success: true,
      message: "Profile created successfully!",
      vendor: profile,
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile saved successfully!",
    vendor,
  });
});

//  @desc    Get Vendor Profile
//  @route   GET /api/v1/vendor/me
//  @access  Private
const getVendorProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Find vendor profile by the user's ID
  const vendor = await VendorProfile.findOne({ userId });
  // Return a 404 error if vendor profile is not found,
  if (!vendor) {
    res.status(404).json({
      success: false,
      message: "You need to create a business profile",
    });
  }
  // Return the found profile
  return res.status(200).json({
    success: true,
    vendor,
  });
});

//  @desc    Upload vendor logo
//  @route   POST /api/v1/vendors/logo
//  @access  Private
const uploadVendorLogo = asyncHandler(async (req, res) => {
  // Get the authenticated user's ID
  const userId = req.user.userId;

  // Get the Cloudinary logo URL from the uploaded file
  const newLogoUrl = req.file?.path;

  // If no logo URL is provided, return a 400 error
  if (!newLogoUrl) {
    return res.status(400).json({
      success: false,
      message: "No logo uploaded",
    });
  }

  // Find the vendor profile by user ID
  const vendor = await VendorProfile.findOne({ userId });
  // If no vendor profile is found, return a 404 error
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor profile not found",
    });
  }

  // Delete old logo from Cloudinary if it exists
  if (vendor.logoUrl) {
    const publicId = extractPublicId(vendor.logo);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }
  // Save the new logo URL to the vendor profile
  vendor.logoUrl = newLogoUrl;
  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Logo uploaded successfully",
    logo: vendor.logoUrl,
  });
});

//  @desc    DELETE logo — remove from Cloudinary and DB
//  @route   DELETE /api/v1/vendors/logo
//  @access  Private
const deleteVendorLogo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const vendor = await VendorProfile.findOne({ userId });

  // If no vendor profile is found, return a 404 error
  if (!vendor || !vendor.logo) {
    return res.status(404).json({
      success: false,
      message: "No logo to delete",
    });
  }

  // Delete from Cloudinary
  const publicId = extractPublicId(vendor.logo);
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }

  // Clear logo from DB
  vendor.logo = "";
  await vendor.save();

  res.status(200).json({
    success: false,
    message: "Logo deleted",
  });
});

//  @desc    Save Vendor Payment Settings
//  @route   PATCH /api/v1/vendor/payment-settings
//  @access  Vendor
const saveVendorPaymentSettings = async (req, res) => {
  const userId = req.user._id;
  const { testSecretKey, testWebhookSecret } = req.body;

  const vendor = await Vendor.findOne({ userId });
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  if (testSecretKey) vendor.stripe.test.secretKey = testSecretKey;
  if (testWebhookSecret) vendor.stripe.test.webhookSecret = testWebhookSecret;

  // Only allow test→live switch if liveEnabled = true
  if (mode && ["test", "live"].includes(mode)) {
    if (mode === "live" && !vendor.stripe.liveEnabled) {
      return res.status(400).json({
        message: "Live mode not enabled yet. Please contact support.",
      });
    }
    vendor.stripe.mode = mode;
  }

  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Payment settings updated successfully",
    vendor,
  });
};

//  @desc    Toggle Vendor Payment Mode
//  @route   PATCH /api/v1/vendor/payment-mode
//  @access  Vendor
const toggleVendorPaymentMode = async (req, res) => {
  const userId = req.user._id;
  const { mode } = req.body;

  if (!["test", "live"].includes(mode)) {
    return res.status(400).json({ message: "Invalid mode value" });
  }

  const vendor = await Vendor.findOne({ userId });
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  // Switch mode
  vendor.stripe.mode = mode;
  await vendor.save();

  return res.json({
    message: `Stripe mode switched to ${mode.toUpperCase()} successfully.`,
    stripe: vendor.stripe,
  });
};

module.exports = {
  saveVendorProfile,
  getVendorProfile,
  uploadVendorLogo,
  deleteVendorLogo,
  saveVendorPaymentSettings,
  toggleVendorPaymentMode,
};
