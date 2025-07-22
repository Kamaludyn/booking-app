const express = require("express");
const availabilityController = require("./availability.controller");
const protect = require("../../middleware/auth");

const router = express.Router();

// All routes below are protected
router.use(protect);

// @route  POST /api/v1/availability
router.post("/", availabilityController.createAvailability);

// @route  PATCH /api/v1/availability
router.patch("/", availabilityController.updateAvailability);

// @route  GET /api/v1/availability
router.get("/", availabilityController.getAvailability);

module.exports = router;
