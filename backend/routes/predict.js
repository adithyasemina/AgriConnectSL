import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * POST /api/predict
 * Receives an image file, forwards it to the Flask ML service,
 * and returns the disease prediction result
 */
router.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    // Validate that file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided',
      });
    }

    console.log(`Processing image: ${req.file.originalname}`);

    // Create FormData to send to Flask
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Forward request to Flask service
    const flaskResponse = await axios.post(
      'http://localhost:5000/predict',
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('Flask response received:', flaskResponse.data);

    // Return Flask response to client
    res.json(flaskResponse.data);
  } catch (error) {
    console.error('Error predicting disease:', error.message);

    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'ML service is unavailable. Please try again later.',
      });
    }

    if (error.message.includes('File too large')) {
      return res.status(413).json({
        error: 'Image file is too large. Maximum size is 10MB.',
      });
    }

    res.status(500).json({
      error: 'Failed to analyze image. Please try again.',
    });
  }
});

export default router;
