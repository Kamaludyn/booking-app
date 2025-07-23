const express = require("express");
const availabilityController = require("./availability.controller");
const protect = require("../../middleware/auth");
const { vendorOnly } = require("../../middleware/verifyRole");

const router = express.Router();

// All routes below are protected (only Authenticated Vendor)
router.use(protect);
router.use(vendorOnly);

// @route  POST /api/v1/availability
router.post("/", availabilityController.createAvailability);

// @route  PATCH /api/v1/availability
router.patch("/", availabilityController.updateAvailability);

// @route  GET /api/v1/availability
router.get("/", availabilityController.getAvailability);

module.exports = router;
