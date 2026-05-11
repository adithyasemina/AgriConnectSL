const express = require("express");
const router = express.Router();

const {
  getPendingSoilTests,
  getCompletedSoilTests,
  getRecalledSoilTests,
  createSoilTest,
  completeSoilTest,
  recallSoilTest,
  updateCompletedSoilTest,
  updateRecalledSoilTest,
  rePendingSoilTest,
  getFarmerSoilNotifications,
} = require("../controllers/soilTestController");

const { protect, officerOnly } = require("../middleware/authMiddleware");

// Soil test endpoints
router.get("/pending", protect, officerOnly, getPendingSoilTests);
router.get("/completed", protect, officerOnly, getCompletedSoilTests);
router.get("/recall", protect, officerOnly, getRecalledSoilTests);
router.post("/", protect, createSoilTest);
router.put("/:id/complete", protect, officerOnly, completeSoilTest);
router.put("/:id/recall", protect, officerOnly, recallSoilTest);
router.put("/:id/re-pending", protect, officerOnly, rePendingSoilTest);
router.patch("/:id/update-completed", protect, officerOnly, updateCompletedSoilTest);
router.patch("/:id/update-recall", protect, officerOnly, updateRecalledSoilTest);
router.get("/notifications/:farmerId", protect, getFarmerSoilNotifications);

module.exports = router;
