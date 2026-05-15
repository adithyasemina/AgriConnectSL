const express = require("express");
const router = express.Router();

const { addOfficer, getDashboardStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/add-officer", protect, adminOnly, addOfficer);
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);

module.exports = router;