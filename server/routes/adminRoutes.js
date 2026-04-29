const express = require("express");
const router = express.Router();

const { addOfficer } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/add-officer", protect, adminOnly, addOfficer);

module.exports = router;