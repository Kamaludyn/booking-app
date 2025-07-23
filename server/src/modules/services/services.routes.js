const express = require("express");
const router = express.Router();
const serviceController = require("./services.controller");
const protect = require("../../middleware/auth");
const { vendorOnly } = require("../../middleware/verifyRole");

// *** Public routes *** //
//  @route GET all active services
router.get("/active", serviceController.getActiveServices);

// @route  GET /api/v1/services
router.get("/:serviceId", serviceController.getServiceById);

// *** Private - Vendor only routes *** //
router.use(protect);
router.use(vendorOnly);

// @route  POST /api/v1/services
router.post("/", serviceController.createService);

// @route  GET /api/v1/services
router.get("/", serviceController.getServices);

// @route  PATCH /api/v1/services
router.patch("/:serviceId", serviceController.updateService);

// @route  DELETE /api/v1/services/:serviceId
router.delete("/:serviceId", serviceController.deleteService);

module.exports = router;
