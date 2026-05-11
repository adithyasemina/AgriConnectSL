const User = require("../models/User");
const Alert = require("../models/Alert");

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

exports.getDashboardStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({
      role: "farmer",
      isBlocked: { $ne: true },
    });

    const blockedFarmers = await User.countDocuments({
      role: "farmer",
      isBlocked: true,
    });

    return res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats: {
        totalFarmers,
        blockedFarmers,
        totalMessages: 48,
        totalSoilTests: 32,
        totalArticles: 15,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { title, message, priority, targetType, targetProvinces, targetDistricts, expiresAt } = req.body;

    if (!title || !message || !priority || !targetType) {
      return res.status(400).json({
        message: "Title, message, priority, and targetType are required",
      });
    }

    if (targetType === "provinces" && (!targetProvinces || targetProvinces.length === 0)) {
      return res.status(400).json({
        message: "At least one province must be selected for provinces targetType",
      });
    }

    if (targetType === "districts" && (!targetDistricts || targetDistricts.length === 0)) {
      return res.status(400).json({
        message: "At least one district must be selected for districts targetType",
      });
    }

    const createdByName = `${req.user.firstName} ${req.user.lastName}`;

    const alert = new Alert({
      title,
      message,
      priority,
      targetType,
      targetProvinces: targetType === "all" ? [] : targetProvinces || [],
      targetDistricts: targetType === "districts" ? targetDistricts : [],
      createdBy: req.user._id,
      createdByName,
      isActive: true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    await alert.save();

    return res.status(201).json({
      message: "Alert created successfully",
      alert,
    });
  } catch (error) {
    console.error("Create alert error:", error.message);
    return res.status(500).json({
      message: "Failed to create alert",
      error: error.message,
    });
  }
};

exports.getOfficerAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("createdBy", "-password")
      .sort({ createdAt: -1 });

    const now = new Date();
    const recentAlerts = alerts.filter(alert => !alert.expiresAt || alert.expiresAt > now);
    const expiredAlerts = alerts.filter(alert => alert.expiresAt && alert.expiresAt <= now);

    return res.status(200).json({
      message: "Alerts retrieved successfully",
      alerts: {
        recent: recentAlerts,
        expired: expiredAlerts,
      },
    });
  } catch (error) {
    console.error("Get alerts error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve alerts",
      error: error.message,
    });
  }
};

exports.getPublicAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true })
      .populate("createdBy", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Alerts retrieved successfully",
      alerts,
    });
  } catch (error) {
    console.error("Get public alerts error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve alerts",
      error: error.message,
    });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, priority, targetType, targetProvinces, targetDistricts, expiresAt } = req.body;

    if (!title || !message || !priority || !targetType) {
      return res.status(400).json({
        message: "Title, message, priority, and targetType are required",
      });
    }

    if (targetType === "provinces" && (!targetProvinces || targetProvinces.length === 0)) {
      return res.status(400).json({
        message: "At least one province must be selected for provinces targetType",
      });
    }

    if (targetType === "districts" && (!targetDistricts || targetDistricts.length === 0)) {
      return res.status(400).json({
        message: "At least one district must be selected for districts targetType",
      });
    }

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    alert.title = title;
    alert.message = message;
    alert.priority = priority;
    alert.targetType = targetType;
    alert.targetProvinces = targetType === "all" ? [] : targetProvinces || [];
    alert.targetDistricts = targetType === "districts" ? targetDistricts : [];
    if (expiresAt) {
      alert.expiresAt = new Date(expiresAt);
    } else {
      alert.expiresAt = null;
    }

    await alert.save();

    return res.status(200).json({
      message: "Alert updated successfully",
      alert,
    });
  } catch (error) {
    console.error("Update alert error:", error.message);
    return res.status(500).json({
      message: "Failed to update alert",
      error: error.message,
    });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    await Alert.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Delete alert error:", error.message);
    return res.status(500).json({
      message: "Failed to delete alert",
      error: error.message,
    });
  }
};
