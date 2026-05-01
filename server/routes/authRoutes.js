const express = require("express");
const router = express.Router();

const {
  registerFarmer,
  loginUser,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Farmer Register
router.post("/register-farmer", registerFarmer);

// Login
router.post("/login", loginUser);

// Check real logged user
router.get("/me", protect, getMe);

module.exports = router;