const User = require("../models/User");

exports.getUnblockedFarmers = async (req, res) => {
  try {
    const farmers = await User.find({
      role: "farmer",
      isBlocked: { $ne: true },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Unblocked farmers retrieved successfully",
      farmers,
    });
  } catch (error) {
    console.error("Get unblocked farmers error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve unblocked farmers",
      error: error.message,
    });
  }
};

exports.getBlockedFarmers = async (req, res) => {
  try {
    const farmers = await User.find({
      role: "farmer",
      isBlocked: true,
    })
      .select("-password")
      .sort({ blockedAt: -1 });

    return res.status(200).json({
      message: "Blocked farmers retrieved successfully",
      farmers,
    });
  } catch (error) {
    console.error("Get blocked farmers error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve blocked farmers",
      error: error.message,
    });
  }
};

exports.blockFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res
        .status(400)
        .json({ message: "Block reason is required and cannot be empty" });
    }

    const farmer = await User.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    if (farmer.role !== "farmer") {
      return res
        .status(400)
        .json({ message: "Only farmers can be blocked" });
    }

    farmer.isBlocked = true;
    farmer.isActive = false;
    farmer.blockedReason = reason.trim();
    farmer.blockedAt = new Date();
    farmer.blockedBy = req.user._id;

    await farmer.save();

    const farmerWithoutPassword = farmer.toObject();
    delete farmerWithoutPassword.password;

    return res.status(200).json({
      message: "Farmer blocked successfully",
      farmer: farmerWithoutPassword,
    });
  } catch (error) {
    console.error("Block farmer error:", error.message);
    return res.status(500).json({
      message: "Failed to block farmer",
      error: error.message,
    });
  }
};

exports.unblockFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const farmer = await User.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    if (farmer.role !== "farmer") {
      return res
        .status(400)
        .json({ message: "Only farmers can be unblocked" });
    }

    farmer.isBlocked = false;
    farmer.isActive = true;
    farmer.blockedReason = "";
    farmer.blockedAt = null;
    farmer.blockedBy = null;

    await farmer.save();

    const farmerWithoutPassword = farmer.toObject();
    delete farmerWithoutPassword.password;

    return res.status(200).json({
      message: "Farmer unblocked successfully",
      farmer: farmerWithoutPassword,
    });
  } catch (error) {
    console.error("Unblock farmer error:", error.message);
    return res.status(500).json({
      message: "Failed to unblock farmer",
      error: error.message,
    });
  }
};
