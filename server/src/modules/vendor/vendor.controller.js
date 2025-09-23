const VendorProfile = require("./vendor.model.js");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const { extractPublicId } = require("../../lib/cloudinary");

//  @desc    Create Vendor Profile
//  @route   POST /api/v1/vendor
//  @access  Private
const createVendorProfile = asyncHandler(async (req, res) => {
  // Authenticated user's ID from request object
  const userId = req.user.userId;

  // Profile fields from request body
  const { businessName, businessEmail, phone, address, bio, category, taxId } =
    req.body;

  // Check if the user already has a vendor profile
  const vendorExist = await VendorProfile.findOne({ userId });
  // If profile exists, return a conflict status
  if (vendorExist) {
    return res.status(409).json({
      success: false,
      message: "Profile already exists",
    });
  }

  // Basic input validation
  if (!businessName || !businessEmail || !phone) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing",
    });
  }

  // Create a new Vendor Profile and associate it with the user
  const profile = await VendorProfile.create({
    userId,
    businessName,
    businessEmail,
    phone,
    address,
    bio,
    category,
    taxId,
  });

  res.status(200).json({
    success: true,
    message: "Profile created successfully!",
    vendor: profile,
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
      message: "Vendor profile not found",
    });
  }
  // Return the found profile
  return res.status(200).json({
    success: true,
    vendor,
  });
});

//  @desc    Update Vendor Profile
//  @route   PATCH /api/v1/vendor/me
//  @access  Private
const updateVendorProfile = asyncHandler(async (req, res) => {
  // Get the authenticated user's ID from the request object
  const userId = req.user.userId;

  // Get updates from the request body
  const updates = req.body;

  // Find and update the vendor profile
  const updatedVendor = await VendorProfile.findOneAndUpdate(
    { userId }, // Use userId to find the profile
    { $set: updates }, // Apply updates
    { new: true, runValidators: true } // Return updated doc and enforce schema rules
  );

  // If no vendor profile is found for the user, return a 404 error
  if (!updatedVendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor profile not found",
    });
  }

  // Return updated profile to client
  res.status(200).json({
    success: true,
    message: "Profile Update Successfull",
    vendor: updatedVendor,
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

module.exports = {
  createVendorProfile,
  getVendorProfile,
  updateVendorProfile,
  uploadVendorLogo,
  deleteVendorLogo,
};
