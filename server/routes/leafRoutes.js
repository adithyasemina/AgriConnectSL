const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const router = express.Router();
const { protect, farmerOnly } = require("../middleware/authMiddleware");
const DiseasePrediction = require("../models/DiseasePrediction");

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/predict", protect, farmerOnly, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Image file is required",
      });
    }

    const language = req.body.language || "en";
    const flaskUrl = process.env.FLASK_ML_URL || "http://127.0.0.1:5000";

    const formData = new FormData();

    formData.append("image", fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    formData.append("language", language);

    const response = await axios.post(
      `${flaskUrl}/predict-leaf`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    fs.unlinkSync(req.file.path);

    if (response.data.success) {
      const confidence = response.data.confidence;

      if (confidence < 70) {
        return res.status(200).json({
          success: false,
          lowConfidence: true,
          message: "Invalid image or low confidence. Please upload a clear rice leaf image.",
          confidence: confidence,
        });
      }

      try {
        const existingPrediction = await DiseasePrediction.findOne({
          farmerId: req.user._id,
          imageName: req.file.originalname,
        });

        if (existingPrediction) {
          existingPrediction.prediction = response.data.prediction;
          existingPrediction.confidence = response.data.confidence;
          existingPrediction.classIndex = response.data.classIndex;
          existingPrediction.allPredictions = response.data.allPredictions;
          await existingPrediction.save();
          console.log(`Prediction updated for farmer ${req.user._id}, image: ${req.file.originalname}`);
        } else {
          await DiseasePrediction.create({
            farmerId: req.user._id,
            farmerName: `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim(),
            farmerEmail: req.user.email,
            imageName: req.file.originalname,
            prediction: response.data.prediction,
            confidence: response.data.confidence,
            classIndex: response.data.classIndex,
            allPredictions: response.data.allPredictions,
          });
          console.log(`Prediction saved for farmer ${req.user._id}`);
        }
      } catch (dbError) {
        console.error("Failed to save prediction to database:", dbError.message);
      }
    }

    return res.json(response.data);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        error.message ||
                        "Prediction failed";

    console.error("Leaf prediction error:", {
      status: error.response?.status,
      message: errorMessage,
      details: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage,
    });
  }
});

router.get("/history", protect, farmerOnly, async (req, res) => {
  try {
    const predictions = await DiseasePrediction.find({
      farmerId: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/history/:id", protect, farmerOnly, async (req, res) => {
  try {
    const prediction = await DiseasePrediction.findOne({
      _id: req.params.id,
      farmerId: req.user._id,
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        error: "Prediction not found",
      });
    }

    return res.status(200).json({
      success: true,
      prediction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;