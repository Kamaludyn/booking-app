const express = require("express");
const router = express.Router();
const vendorController = require("./vendor.controller");
const protect = require("../../middleware/auth");
const upload = require("../../middleware/upload");

// @route   POST /api/v1/vendor
router.post("/", protect, vendorController.createVendorProfile);

// @route   GET /api/v1/vendor/me
router.get("/me", protect, vendorController.getVendorProfile);

// @route   UPDATE /api/v1/vendor/me
router.patch("/me", protect, vendorController.updateVendorProfile);

// @route   POST /api/v1/vendor/logo
router.post(
  "/logo",
  protect,
  upload.single("logo"), // File field must be named "logo"
  vendorController.uploadVendorLogo
);

// @route   DELETE /api/v1/vendor/logo
router.delete("/logo", protect, vendorController.deleteVendorLogo);

module.exports = router;
