const Service = require("./services.model");
const asyncHandler = require("express-async-handler");

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private (Vendor)
const createService = asyncHandler(async (req, res) => {
  const vendorId = req.user.userId;
  const {
    name,
    description,
    duration,
    price,
    isActive,
    requireDeposit,
    depositAmount,
  } = req.body;

  // Validate required fields
  if (!name || !description || !duration || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Save to DB
  const service = await Service.create({
    vendorId,
    name,
    description,
    duration,
    price,
    isActive,
    requireDeposit,
    depositAmount,
  });

  res.status(201).json({
    message: "Service created successfully",
    service,
  });
});

// @desc    Fetch all services
// @route   GET /api/v1/services
// @access  Private (Vendor)
const getServices = asyncHandler(async (req, res) => {
  // Find all services
  const services = await Service.find();

  // Return error if no services found
  if (!services || services.length === 0) {
    return res.status(404).json({ message: "No services found" });
  }

  // Return services
  res.status(200).json({ services });
});

// @desc    Fetch only active services
// @route   GET /api/v1/services
// @access  Public
const getActiveServices = asyncHandler(async (req, res) => {
  // Find services marked as active by vendor
  const services = await Service.find({ isActive: true });

  // Return error if no active services found
  if (!services || services.length === 0) {
    return res.status(404).json({ message: "No active services found" });
  }

  // Return active services
  res.status(200).json({
    message: "Active services fetched successfully",
    services,
  });
});

// @desc    Fetch a single service
// @route   GET /api/v1/services/:serviceId
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  //  Find service by id
  const service = await Service.findById(serviceId);

  //  Return error if not found
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.status(200).json({ service });
});

// @desc    Update service
// @route   GET /api/v1/services/:serviceId
// @access  Private (Vendor)
const updateService = asyncHandler(async (req, res) => {
  const vendorId = req.user.userId;
  const { serviceId } = req.params;

  // Find service by id and update only provided fields
  const updatedService = await Service.findByIdAndUpdate(
    { _id: serviceId, vendorId },
    { $set: req.body },
    { new: true }
  );

  // Return Error if service is not found
  if (!updatedService) {
    return res
      .status(404)
      .json({ message: "Service not found or unauthorized" });
  }

  res
    .status(201)
    .json({ message: "service updated successfully", updatedService });
});

// @desc    Delete a service
// @route   DELETE /api/v1/services/:serviceId
// @access  Private (Vendor)
const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const vendorId = req.user.userId;

  // Find and Delete service by owner
  const service = await Service.findOneAndDelete({
    _id: serviceId,
    vendorId,
  });

  // Return error if srvice is not found
  if (!service) {
    return res
      .status(404)
      .json({ message: "Service not found or unauthorized" });
  }

  res.status(200).json({ message: "Service deleted successfully" });
});

module.exports = {
  createService,
  getServices,
  getActiveServices,
  updateService,
  getServiceById,
  deleteService,
};
