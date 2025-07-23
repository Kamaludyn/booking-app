const User = require("../modules/auth/auth.model");

// Verify Vendor
const vendorOnly = async (req, res, next) => {
  try {
    // If the user is not a vendor deny access
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied. Vendor only." });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { vendorOnly };
