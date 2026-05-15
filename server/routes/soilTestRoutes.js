const express = require("express");
const router = express.Router();

const {
  issueOfficerNumber,
  getPendingSoilTests,
  getCompletedSoilTests,
  createSoilTest,
  completeSoilTest,
  updateCompletedSoilTest,
  getFarmerSoilNotifications,
  getMyFarmerNotifications,
  getFarmerMyTests,
  submitFarmerSoilTest,
} = require("../controllers/soilTestController");

const { protect, officerOnly, farmerOnly } = require("../middleware/authMiddleware");

router.post("/issue-number", protect, officerOnly, issueOfficerNumber);

router.get("/pending", protect, officerOnly, getPendingSoilTests);
router.get("/completed", protect, officerOnly, getCompletedSoilTests);

router.post("/", protect, createSoilTest);

router.put("/:id/complete", protect, officerOnly, completeSoilTest);
router.patch("/:id/update-completed", protect, officerOnly, updateCompletedSoilTest);

router.get("/notifications/me", protect, getMyFarmerNotifications);
router.get("/notifications/:farmerId", protect, getFarmerSoilNotifications);

// Farmer endpoints
router.get("/farmer/my-tests", protect, farmerOnly, getFarmerMyTests);
router.post("/farmer/submit", protect, farmerOnly, submitFarmerSoilTest);

module.exports = router;