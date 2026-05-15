const User = require("../models/User");
const SoilTest = require("../models/SoilTest");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");

// Admin adds officer
exports.addOfficer = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Officer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "officer",
    });

    res.status(201).json({
      message: "Officer added successfully",
      officer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard stats for admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: "farmer" });
    const activeOfficers = await User.countDocuments({ role: "officer", isActive: true });
    const completedSoilTests = await SoilTest.countDocuments({ status: "completed" });
    const doneMessages = await Message.countDocuments({ status: "done" });

    res.status(200).json({
      success: true,
      stats: {
        totalFarmers,
        activeOfficers,
        completedSoilTests,
        doneMessages,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};