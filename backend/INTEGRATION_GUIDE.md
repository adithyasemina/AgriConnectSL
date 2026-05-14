# Express Backend Integration Guide

## Step 1: Install Required Dependencies

Make sure you have the necessary packages installed in your Express backend:

```bash
npm install express multer axios form-data
```

## Step 2: Import the Predict Route in Your Main App

In your main Express app file (e.g., `server.js` or `app.js`), add the following:

```javascript
import express from 'express';
import predictRouter from './routes/predict.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', predictRouter); // This will handle POST /api/predict

// Other routes...

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 3: Environment Setup

Ensure your Flask ML service is running on `http://localhost:5000` with a `/predict` endpoint.

The Flask endpoint should:
- Accept POST requests with `multipart/form-data`
- Receive an `image` field containing the image file
- Return JSON with the following structure:

```json
{
  "disease_name": "Leaf Spot",
  "confidence": 0.92,
  "symptoms": [
    "Brown spots on leaves",
    "Yellow ring around spots",
    "Leaf wilting"
  ],
  "treatment": "Apply fungicide spray every 7 days. Ensure good air circulation and remove infected leaves."
}
```

## Step 4: Frontend Configuration

The frontend (`farmer/find/page.tsx`) is already configured to:
1. Accept image uploads via drag-and-drop or click-to-select
2. Send POST requests to `/api/predict` endpoint
3. Display results with disease name, confidence score, symptoms, and treatment recommendations

## API Endpoint Details

### POST /api/predict

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `image` file field

**Response (Success - 200):**
```json
{
  "disease_name": "string",
  "confidence": 0.0-1.0,
  "symptoms": ["string"],
  "treatment": "string"
}
```

**Response (Error):**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Error Handling

The backend automatically handles:
- Missing file uploads (400 Bad Request)
- Non-image files (400 Bad Request)
- Files larger than 10MB (413 Payload Too Large)
- Flask service unavailable (503 Service Unavailable)
- General processing errors (500 Internal Server Error)

## Testing the Endpoint

You can test the endpoint using curl:

```bash
curl -X POST http://localhost:3001/api/predict \
  -F "image=@/path/to/image.jpg"
```

Or using Postman:
1. Set method to POST
2. URL: `http://localhost:3001/api/predict`
3. Go to Body tab
4. Select "form-data"
5. Add key "image" with type "File"
6. Select your image file
7. Click Send

## Troubleshooting

### "ML service is unavailable"
- Ensure Flask service is running on `http://localhost:5000`
- Check Flask service logs for errors

### "Image file is too large"
- Image size limit is 10MB
- Compress the image or reduce its dimensions

### Connection refused errors
- Verify the Flask server is running
- Check that the port 5000 is correct in the route file
- Ensure no firewall is blocking the connection
