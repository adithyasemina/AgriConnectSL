const User = require("../models/User");
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