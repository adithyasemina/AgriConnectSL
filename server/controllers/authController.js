const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Farmer Register
exports.registerFarmer = async (req, res) => {
  try {
    const { firstName, lastName, email, password, province, district } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      province,
      district,
      role: "farmer",
    });

    return res.status(201).json({
      message: "Farmer registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      message: "Register failed",
      error: error.message,
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        province: user.province,
        district: user.district,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// Get logged in user
exports.getMe = async (req, res) => {
  return res.status(200).json({
    message: "User fetched successfully",
    role: req.user.role,
    user: req.user,
  });
};