const mongoose = require("mongoose");

const soilTestSchema = new mongoose.Schema(
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
    farmerEmail: {
      type: String,
      required: true,
    },
    farmerNote: {
      type: String,
      default: "",
    },
    submitDate: {
      type: Date,
      default: Date.now,
    },
    submitTime: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "recall"],
      default: "pending",
    },

    approvedOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedOfficerName: {
      type: String,
      default: "",
    },

    recallOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    recallOfficerName: {
      type: String,
      default: "",
    },

    completedDate: {
      type: Date,
      default: null,
    },
    completedTime: {
      type: String,
      default: "",
    },

    recallDate: {
      type: Date,
      default: null,
    },
    recallTime: {
      type: String,
      default: "",
    },

    phLevel: {
      type: Number,
      default: null,
    },
    nitrogen: {
      type: Number,
      default: null,
    },
    phosphorus: {
      type: Number,
      default: null,
    },
    potassium: {
      type: Number,
      default: null,
    },
    overallStatus: {
      type: String,
      enum: ["Good", "Moderate", "Poor"],
      default: null,
    },
    recommendation: {
      type: String,
      default: "",
    },
    reason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoilTest", soilTestSchema);
