const mongoose = require("mongoose");

const diseasePredictionSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
      trim: true,
    },
    farmerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    imageName: {
      type: String,
      required: true,
      trim: true,
    },
    prediction: {
      type: String,
      required: true,
      trim: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    classIndex: {
      type: Number,
      required: true,
    },
    allPredictions: [
      {
        label: {
          type: String,
          required: true,
        },
        confidence: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DiseasePrediction", diseasePredictionSchema);
