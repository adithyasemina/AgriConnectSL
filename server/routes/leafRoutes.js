const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/predict", upload.single("image"), async (req, res) => {
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

    return res.json(response.data);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      error: error.response?.data?.error || error.message,
    });
  }
});

module.exports = router;