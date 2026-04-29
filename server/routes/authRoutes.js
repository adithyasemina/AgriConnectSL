const express = require("express");
const router = express.Router();

const { registerFarmer, loginUser } = require("../controllers/authController");

// Farmer Register
router.post("/register-farmer", registerFarmer);

// Login
router.post("/login", loginUser);

module.exports = router;