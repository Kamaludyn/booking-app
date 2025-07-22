const Availability = require("./availability.model.js");

// @desc    Create Availability
// @route   POST /api/v1/availability
// @access  Private (Vendor)
const createAvailability = async (req, res, next) => {
  try {
    const vendorId = req.user.userId;
    const { timezone, weeklyAvailability } = req.body;

    // Validate inputs
    if (!timezone || !Array.isArray(weeklyAvailability)) {
      return res.status(400).json({
        message: "Timezone, and weekly availability are required.",
      });
    }

    // Find and Check if availability already exists for the vendor
    const existing = await Availability.findOne({ vendorId });
    if (existing) {
      return res.status(400).json({
        message: "Availability already exists. Use the update endpoint.",
      });
    }

    // Create a new availability document
    const availability = await Availability.create({
      vendorId,
      timezone,
      weeklyAvailability,
    });

    res.status(201).json({
      message: "Availability created successfully.",
      availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a vendor's availability partially (day by day)
// @route   PATCH /api/v1/availability
// @access  Private (Vendor)
const updateAvailability = async (req, res, next) => {
  try {
    const vendorId = req.user.userId;
    const { timezone, weeklyAvailability } = req.body;

    // Find the vendor's availability document
    const availability = await Availability.findOne({ vendorId });
    if (!availability) {
      return res.status(404).json({
        message: "No availability found to update.",
      });
    }

    // Update timezone
    if (timezone) {
      availability.timezone = timezone;
    }

    // Loop through current days and update only matching ones
    availability.weeklyAvailability.forEach((day) => {
      //   Find if this day is being updated
      const updatedDay = weeklyAvailability.find((d) => d.day === day.day);
      if (updatedDay) {
        // If isOpen was provided as a boolean, update it
        if (typeof updatedDay.isOpen === "boolean") {
          day.isOpen = updatedDay.isOpen;
        }
        // If working hours were provided, update them
        if (
          updatedDay.workingHours &&
          updatedDay.workingHours.start &&
          updatedDay.workingHours.end
        ) {
          day.workingHours = updatedDay.workingHours;
        }
        // If breaks were provided as an array, update them
        if (Array.isArray(updatedDay.breaks)) {
          day.breaks = updatedDay.breaks;
        }
      }
    });

    // Save the updated availability
    await availability.save();

    res.status(200).json({
      message: "Availability updated successfully.",
      availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Availability vendor's availability
// @route   GET /api/v1/availability
// @access  Private (Vendor)
const getAvailability = async (req, res, next) => {
  try {
    const vendorId = req.user.userId;

    // Find the vendor's availability document
    const availability = await Availability.findOne({ vendorId });
    // If no availability document is found, return a 404 error
    if (!availability) {
      return res.status(404).json({
        message: "Availability not found.",
      });
    }

    res.status(200).json({
      availability,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAvailability,
  getAvailability,
  updateAvailability,
};
