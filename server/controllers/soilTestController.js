const SoilTest = require("../models/SoilTest");
const SoilNotification = require("../models/SoilNotification");

// Get pending soil tests
exports.getPendingSoilTests = async (req, res) => {
  try {
    const soilTests = await SoilTest.find({ status: "pending" })
      .populate("farmerId", "-password")
      .sort({ submitDate: -1 });

    return res.status(200).json({
      message: "Pending soil tests retrieved successfully",
      soilTests,
    });
  } catch (error) {
    console.error("Get pending soil tests error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve pending soil tests",
      error: error.message,
    });
  }
};

// Get completed soil tests
exports.getCompletedSoilTests = async (req, res) => {
  try {
    const soilTests = await SoilTest.find({ status: "completed" })
      .populate("farmerId", "-password")
      .populate("approvedOfficerId", "-password")
      .sort({ completedDate: -1 });

    return res.status(200).json({
      message: "Completed soil tests retrieved successfully",
      soilTests,
    });
  } catch (error) {
    console.error("Get completed soil tests error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve completed soil tests",
      error: error.message,
    });
  }
};

// Get recalled soil tests
exports.getRecalledSoilTests = async (req, res) => {
  try {
    const soilTests = await SoilTest.find({ status: "recall" })
      .populate("farmerId", "-password")
      .populate("recallOfficerId", "-password")
      .sort({ recallDate: -1 });

    return res.status(200).json({
      message: "Recalled soil tests retrieved successfully",
      soilTests,
    });
  } catch (error) {
    console.error("Get recalled soil tests error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve recalled soil tests",
      error: error.message,
    });
  }
};

// Create soil test
exports.createSoilTest = async (req, res) => {
  try {
    const { farmerId, farmerName, farmerEmail, farmerNote } = req.body;

    if (!farmerId || !farmerName || !farmerEmail) {
      return res.status(400).json({
        message: "Farmer ID, name, and email are required",
      });
    }

    const soilTest = new SoilTest({
      farmerId,
      farmerName,
      farmerEmail,
      farmerNote: farmerNote || "",
      status: "pending",
      submitDate: new Date(),
    });

    await soilTest.save();

    return res.status(201).json({
      message: "Soil test created successfully",
      soilTest,
    });
  } catch (error) {
    console.error("Create soil test error:", error.message);
    return res.status(500).json({
      message: "Failed to create soil test",
      error: error.message,
    });
  }
};

// Complete soil test
exports.completeSoilTest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phLevel,
      nitrogen,
      phosphorus,
      potassium,
      overallStatus,
      recommendation,
      reason,
    } = req.body;

    if (
      phLevel === undefined ||
      nitrogen === undefined ||
      phosphorus === undefined ||
      potassium === undefined ||
      !overallStatus
    ) {
      return res.status(400).json({
        message:
          "pH level, nitrogen, phosphorus, potassium, and overall status are required",
      });
    }

    const soilTest = await SoilTest.findById(id);

    if (!soilTest) {
      return res.status(404).json({
        message: "Soil test not found",
      });
    }

    const officerId = req.user?._id;
    const officerName = req.user
      ? `${req.user.firstName} ${req.user.lastName}`
      : "Unknown Officer";

    soilTest.status = "completed";
    soilTest.phLevel = phLevel;
    soilTest.nitrogen = nitrogen;
    soilTest.phosphorus = phosphorus;
    soilTest.potassium = potassium;
    soilTest.overallStatus = overallStatus;
    soilTest.recommendation = recommendation || "";
    soilTest.reason = reason || "";
    soilTest.approvedOfficerId = officerId;
    soilTest.approvedOfficerName = officerName;

    const now = new Date();
    soilTest.completedDate = now;
    soilTest.completedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    await soilTest.save();

    // Create notification
    const notification = new SoilNotification({
      farmerId: soilTest.farmerId,
      farmerName: soilTest.farmerName,
      title: "Soil Test Results",
      message: `Your soil test has been completed. Overall Status: ${overallStatus}. Please check the details for recommendations.`,
      type: "soil_completed",
      soilTestId: soilTest._id,
      officerId: officerId,
      officerName: officerName,
      isRead: false,
    });

    await notification.save();

    return res.status(200).json({
      message: "Soil test completed successfully",
      soilTest,
      notification,
    });
  } catch (error) {
    console.error("Complete soil test error:", error.message);
    return res.status(500).json({
      message: "Failed to complete soil test",
      error: error.message,
    });
  }
};

// Recall soil test
exports.recallSoilTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Reason is required",
      });
    }

    const soilTest = await SoilTest.findById(id);

    if (!soilTest) {
      return res.status(404).json({
        message: "Soil test not found",
      });
    }

    const officerId = req.user?._id;
    const officerName = req.user
      ? `${req.user.firstName} ${req.user.lastName}`
      : "Unknown Officer";

    soilTest.status = "recall";
    soilTest.reason = reason.trim();
    soilTest.recallOfficerId = officerId;
    soilTest.recallOfficerName = officerName;

    const now = new Date();
    soilTest.recallDate = now;
    soilTest.recallTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    await soilTest.save();

    // Create notification
    const notification = new SoilNotification({
      farmerId: soilTest.farmerId,
      farmerName: soilTest.farmerName,
      title: "Soil Test Re-Call Request",
      message: `Your soil test has been recalled. Reason: ${reason}. Please submit your soil sample again.`,
      type: "soil_recall",
      soilTestId: soilTest._id,
      officerId: officerId,
      officerName: officerName,
      isRead: false,
    });

    await notification.save();

    return res.status(200).json({
      message: "Soil test recalled successfully",
      soilTest,
      notification,
    });
  } catch (error) {
    console.error("Recall soil test error:", error.message);
    return res.status(500).json({
      message: "Failed to recall soil test",
      error: error.message,
    });
  }
};

// Get soil notifications for farmer
exports.getFarmerSoilNotifications = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const notifications = await SoilNotification.find({
      farmerId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Soil notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    console.error("Get soil notifications error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve soil notifications",
      error: error.message,
    });
  }
};
