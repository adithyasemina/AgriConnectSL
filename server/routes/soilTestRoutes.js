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
} = require("../controllers/soilTestController");

const { protect, officerOnly } = require("../middleware/authMiddleware");

router.post("/issue-number", protect, officerOnly, issueOfficerNumber);

router.get("/pending", protect, officerOnly, getPendingSoilTests);
router.get("/completed", protect, officerOnly, getCompletedSoilTests);

router.post("/", protect, createSoilTest);

router.put("/:id/complete", protect, officerOnly, completeSoilTest);
router.patch("/:id/update-completed", protect, officerOnly, updateCompletedSoilTest);

router.get("/notifications/:farmerId", protect, getFarmerSoilNotifications);

module.exports = router;