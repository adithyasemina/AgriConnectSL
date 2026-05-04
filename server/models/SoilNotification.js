const mongoose = require("mongoose");

const soilNotificationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["soil_completed", "soil_recall"],
      required: true,
    },
    soilTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SoilTest",
      required: true,
    },
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    officerName: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoilNotification", soilNotificationSchema);
