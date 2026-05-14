const express = require("express");
const router = express.Router();

const { getFarmerAlerts } = require("../controllers/farmerController");
const { protect, farmerOnly } = require("../middleware/authMiddleware");

router.get("/alerts", protect, farmerOnly, getFarmerAlerts);

module.exports = router;
