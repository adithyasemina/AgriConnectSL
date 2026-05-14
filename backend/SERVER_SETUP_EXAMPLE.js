/**
 * Example Express Server Setup with Disease Prediction Route
 *
 * This file shows how to integrate the predict route into your main Express app.
 * Adapt this to your existing server structure.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import the prediction route
import predictRouter from './routes/predict.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE =====

// CORS - Allow requests from your Next.js frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (optional but helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Disease prediction route - This is your new route!
app.use('/', predictRouter);

// Other existing routes would go here
// app.use('/api/auth', authRouter);
// app.use('/api/users', usersRouter);
// etc.

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // Handle multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({
        error: 'File is too large. Maximum size is 10MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Only one file can be uploaded at a time.',
      });
    }
  }

  // Handle custom validation errors
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({
      error: 'Only image files are allowed. Supported formats: PNG, JPG, GIF.',
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred',
  });
});

// ===== SERVER STARTUP =====

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════╗');
  console.log('║   AgriConnect Backend Server       ║');
  console.log('║   Status: Running ✓                ║');
  console.log(`║   Port: ${PORT}                       ║`);
  console.log(`║   Environment: ${process.env.NODE_ENV || 'development'}              ║`);
  console.log('╚════════════════════════════════════╝');
  console.log();
  console.log('Available endpoints:');
  console.log(`  GET  /api/health           - Health check`);
  console.log(`  POST /api/predict          - Disease prediction`);
  console.log();
  console.log(`Flask ML Service expected at: http://localhost:5000`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received: shutting down gracefully');
  process.exit(0);
});
