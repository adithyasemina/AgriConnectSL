const SoilTest = require("../models/SoilTest");
const SoilNotification = require("../models/SoilNotification");
const OfficerNumber = require("../models/OfficerNumber");

const getTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const getOfficerDistrict = (req) => req.user?.district;

const getOfficerName = (user) =>
  `${user.firstName || ""} ${user.lastName || ""}`.trim();

exports.issueOfficerNumber = async (req, res) => {
  try {
    const { number } = req.body;

    if (!number || !number.trim()) {
      return res.status(400).json({
        message: "Officer number is required",
      });
    }

    const exists = await OfficerNumber.findOne({
      number: number.trim(),
    });

    if (exists) {
      return res.status(400).json({
        message: "Officer number already exists",
      });
    }

    const officerNumber = await OfficerNumber.create({
      number: number.trim(),
      officerId: req.user._id,
      officerName: getOfficerName(req.user),
      province: req.user.province,
      district: req.user.district,
    });

    return res.status(201).json({
      message: "Officer number issued successfully",
      officerNumber,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to issue officer number",
      error: error.message,
    });
  }
};

exports.getPendingSoilTests = async (req, res) => {
  try {
    const officerDistrict = getOfficerDistrict(req);

    if (!officerDistrict) {
      return res.status(400).json({
        message: "Officer district not found",
      });
    }

    const soilTests = await SoilTest.find({
      status: "pending",
      district: officerDistrict,
    })
      .populate("farmerId", "-password")
      .sort({ submitDate: -1 });

    return res.status(200).json({
      message: "Pending soil tests retrieved successfully",
      soilTests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve pending soil tests",
      error: error.message,
    });
  }
};

exports.getCompletedSoilTests = async (req, res) => {
  try {
    const officerDistrict = getOfficerDistrict(req);

    if (!officerDistrict) {
      return res.status(400).json({
        message: "Officer district not found",
      });
    }

    const soilTests = await SoilTest.find({
      status: "completed",
      district: officerDistrict,
    })
      .populate("farmerId", "-password")
      .populate("approvedOfficerId", "-password")
      .sort({ completedDate: -1 });

    return res.status(200).json({
      message: "Completed soil tests retrieved successfully",
      soilTests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve completed soil tests",
      error: error.message,
    });
  }
};

exports.createSoilTest = async (req, res) => {
  try {
    const {
      farmerId,
      farmerName,
      farmerEmail,
      province,
      district,
      farmerNumber,
      farmerNote,
    } = req.body;

    if (
      !farmerId ||
      !farmerName ||
      !farmerEmail ||
      !province ||
      !district ||
      !farmerNumber
    ) {
      return res.status(400).json({
        message:
          "Farmer ID, name, email, province, district, and farmer number are required",
      });
    }

    const issuedNumber = await OfficerNumber.findOne({
      number: farmerNumber.trim(),
      province,
      district,
    });

    if (!issuedNumber) {
      return res.status(400).json({
        message: "Invalid officer number",
      });
    }

    if (issuedNumber.isUsed) {
      return res.status(400).json({
        message: "This officer number has already been used",
      });
    }

    const soilTest = await SoilTest.create({
      farmerId,
      farmerName,
      farmerEmail,
      province,
      district,
      farmerNumber: farmerNumber.trim(),
      farmerNote: farmerNote || "",
      status: "pending",
      submitDate: new Date(),
      submitTime: getTime(),
    });

    issuedNumber.isUsed = true;
    issuedNumber.usedByFarmerId = farmerId;
    issuedNumber.usedAt = new Date();
    await issuedNumber.save();

    return res.status(201).json({
      message: "Soil test request submitted successfully",
      soilTest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create soil test",
      error: error.message,
    });
  }
};

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

    const officerDistrict = getOfficerDistrict(req);

    if (!officerDistrict) {
      return res.status(400).json({
        message: "Officer district not found",
      });
    }

    const soilTest = await SoilTest.findOne({
      _id: id,
      status: "pending",
      district: officerDistrict,
    });

    if (!soilTest) {
      return res.status(404).json({
        message: "Soil test not found for your district",
      });
    }

    const officerId = req.user?._id;
    const officerName = getOfficerName(req.user) || "Unknown Officer";

    soilTest.status = "completed";
    soilTest.phLevel = phLevel;
    soilTest.nitrogen = nitrogen;
    soilTest.phosphorus = phosphorus;
    soilTest.potassium = potassium;
    soilTest.overallStatus = overallStatus;
    soilTest.recommendation = recommendation || "";
    soilTest.reason = reason || "";
    soilTest.approvedOfficerId = officerId || null;
    soilTest.approvedOfficerName = officerName;
    soilTest.completedDate = new Date();
    soilTest.completedTime = getTime();

    await soilTest.save();

    const notification = await SoilNotification.create({
      farmerId: soilTest.farmerId,
      farmerName: soilTest.farmerName,
      title: "Soil Test Results",
      message: `Your soil test has been completed. Overall Status: ${overallStatus}.`,
      type: "soil_completed",
      soilTestId: soilTest._id,
      officerId,
      officerName,
      isRead: false,
    });

    return res.status(200).json({
      message: "Soil test completed successfully",
      soilTest,
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to complete soil test",
      error: error.message,
    });
  }
};

exports.updateCompletedSoilTest = async (req, res) => {
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

    const officerDistrict = getOfficerDistrict(req);

    if (!officerDistrict) {
      return res.status(400).json({
        message: "Officer district not found",
      });
    }

    const soilTest = await SoilTest.findOne({
      _id: id,
      status: "completed",
      district: officerDistrict,
    });

    if (!soilTest) {
      return res.status(404).json({
        message: "Completed soil test not found for your district",
      });
    }

    if (phLevel !== undefined) soilTest.phLevel = phLevel;
    if (nitrogen !== undefined) soilTest.nitrogen = nitrogen;
    if (phosphorus !== undefined) soilTest.phosphorus = phosphorus;
    if (potassium !== undefined) soilTest.potassium = potassium;
    if (overallStatus !== undefined) soilTest.overallStatus = overallStatus;
    if (recommendation !== undefined) soilTest.recommendation = recommendation;
    if (reason !== undefined) soilTest.reason = reason;

    await soilTest.save();

    return res.status(200).json({
      message: "Completed soil test updated successfully",
      soilTest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update completed soil test",
      error: error.message,
    });
  }
};

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
    return res.status(500).json({
      message: "Failed to retrieve soil notifications",
      error: error.message,
    });
  }
};