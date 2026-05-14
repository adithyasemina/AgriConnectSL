const Alert = require("../models/Alert");

exports.getFarmerAlerts = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const farmerProvince = req.user.province;
    const farmerDistrict = req.user.district;

    if (!farmerProvince || !farmerDistrict) {
      return res.status(400).json({
        message: "Farmer location (province and district) is not set",
      });
    }

    // Find all active alerts
    const alerts = await Alert.find({ isActive: true })
      .populate("createdBy", "-password")
      .sort({ createdAt: -1 });

    // Filter alerts based on farmer's location
    const farmerAlerts = alerts.filter((alert) => {
      // All Island alerts are visible to all farmers
      if (alert.targetType === "all") {
        return true;
      }

      // Province-level alerts: check if farmer's province is in target
      if (alert.targetType === "provinces") {
        return alert.targetProvinces.some(
          (p) => p.toLowerCase() === farmerProvince.toLowerCase()
        );
      }

      // District-level alerts: check if farmer's province AND district match
      if (alert.targetType === "districts") {
        return (
          alert.targetProvinces.some(
            (p) => p.toLowerCase() === farmerProvince.toLowerCase()
          ) &&
          alert.targetDistricts.some(
            (d) => d.toLowerCase() === farmerDistrict.toLowerCase()
          )
        );
      }

      return false;
    });

    // Separate alerts into active and expired based on expiresAt
    const now = new Date();
    const activeAlerts = farmerAlerts.filter(
      (alert) => !alert.expiresAt || alert.expiresAt > now
    );
    const expiredAlerts = farmerAlerts.filter(
      (alert) => alert.expiresAt && alert.expiresAt <= now
    );

    return res.status(200).json({
      message: "Farmer alerts retrieved successfully",
      alerts: {
        active: activeAlerts,
        expired: expiredAlerts,
      },
      farmerLocation: {
        province: farmerProvince,
        district: farmerDistrict,
      },
    });
  } catch (error) {
    console.error("Get farmer alerts error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve farmer alerts",
      error: error.message,
    });
  }
};
