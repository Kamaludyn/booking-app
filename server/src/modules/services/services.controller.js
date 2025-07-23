const Service = require("./services.model");

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private (Vendor)
const createService = async (req, res, next) => {
  const vendorId = req.user.userId;
  const { name, description, duration, price, isActive, requireDeposit } =
    req.body;

  // Validate required fields
  if (!name || !description || !duration || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Save to DB
    const service = await Service.create({
      vendorId,
      name,
      description,
      duration,
      price,
      isActive,
      requireDeposit,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch all services
// @route   GET /api/v1/services
// @access  Private (Vendor)
const getServices = async (req, res, next) => {
  try {
    // Find all services
    const services = await Service.find();

    res.status(200).json({ services });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch only active services
// @route   GET /api/v1/services
// @access  Public
const getActiveServices = async (req, res, next) => {
  try {
    // Find services marked as active by vendor
    const services = await Service.find({ isActive: true });

    res.status(200).json({
      success: true,
      message: "Active services fetched successfully",
      services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch a single service
// @route   GET /api/v1/services/:serviceId
// @access  Public
const getServiceById = async (req, res, next) => {
  const { serviceId } = req.params;
  try {
    //  Find service by id
    const service = await Service.findById(serviceId);

    //  Return error if not found
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   GET /api/v1/services/:serviceId
// @access  Private (Vendor)
const updateService = async (req, res, next) => {
  const vendorId = req.user.userId;
  const { serviceId } = req.params;
  try {
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
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/v1/services/:serviceId
// @access  Private (Vendor)
const deleteService = async (req, res, next) => {
  const { serviceId } = req.params;
  const vendorId = req.user.userId;

  try {
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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getServices,
  getActiveServices,
  updateService,
  getServiceById,
  deleteService,
};
