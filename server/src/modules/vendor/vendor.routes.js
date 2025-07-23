const express = require("express");
const router = express.Router();
const vendorController = require("./vendor.controller");
const protect = require("../../middleware/auth");
const { vendorOnly } = require("../../middleware/verifyRole");
const upload = require("../../middleware/upload");

// All routes can only be accessed by an authenticated vendor
router.use(protect);
router.use(vendorOnly);

// @route   POST /api/v1/vendor
router.post("/", vendorController.createVendorProfile);

// @route   GET /api/v1/vendor/me
router.get("/me", vendorController.getVendorProfile);

// @route   UPDATE /api/v1/vendor/me
router.patch("/me", vendorController.updateVendorProfile);

// @route   POST /api/v1/vendor/logo
router.post(
  "/logo",
  upload.single("logo"), // File field must be named "logo"
  vendorController.uploadVendorLogo
);

// @route   DELETE /api/v1/vendor/logo
router.delete("/logo", vendorController.deleteVendorLogo);

module.exports = router;
