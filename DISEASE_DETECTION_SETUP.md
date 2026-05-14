# AgriConnect Disease Detection - Complete Setup Guide

## 📋 Files Created

### Frontend (Next.js)
- ✅ `app/farmer/find/page.tsx` - Complete disease detection page component
- ✅ `app/lib/api/disease.ts` - Disease prediction API utility

### Backend (Express)
- ✅ `backend/routes/predict.js` - Express route for handling predictions
- ✅ `backend/SERVER_SETUP_EXAMPLE.js` - Example main server setup
- ✅ `backend/INTEGRATION_GUIDE.md` - Detailed integration instructions

---

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install multer form-data
```

### Step 2: Integrate the Predict Route

Add this to your main Express server file (`server.js` or `app.js`):

```javascript
import predictRouter from './routes/predict.js';

// In your app setup:
app.use('/', predictRouter);
```

### Step 3: Ensure Flask Service is Running

Your Flask ML service must be running on `http://localhost:5000` with a `/predict` endpoint:

```python
@app.route('/predict', methods=['POST'])
def predict():
    # Process image and return:
    return {
        "disease_name": "...",
        "confidence": 0.92,
        "symptoms": [...],
        "treatment": "..."
    }
```

### Step 4: Test the Flow

1. **Start Flask service:** `python app.py` (should run on port 5000)
2. **Start Express backend:** `npm start` (should run on port 3001)
3. **Start Next.js frontend:** `npm run dev` (should run on port 3000)
4. Navigate to `http://localhost:3000/farmer/find`
5. Upload an image and click "Identify Disease"

---

## 📦 Component Features

### Frontend Component (`farmer/find/page.tsx`)

**Features:**
- ✅ Drag-and-drop image upload
- ✅ Click-to-select file input
- ✅ Image preview with remove button
- ✅ File validation (type and size)
- ✅ Loading state with spinner
- ✅ Disease results display with:
  - Disease name
  - Confidence score (visual progress bar)
  - Key symptoms list
  - Treatment recommendations
- ✅ Toast notifications (success/error)
- ✅ Responsive design (mobile-friendly)
- ✅ "Analyze Another Image" button for new predictions

**Styling:**
- Uses Tailwind CSS 4
- Responsive grid layout
- Sticky right panel on desktop
- Smooth animations and transitions

**Icons Used:**
- `FiUploadCloud` - Upload icon
- `FiLoader` - Loading spinner
- `FiX` - Close/remove icon
- `MdCheckCircle` - Success checkmark

### Backend Route (`backend/routes/predict.js`)

**Features:**
- ✅ Multer file upload handling
- ✅ Memory storage (no disk I/O)
- ✅ File type validation (images only)
- ✅ File size limit (10MB)
- ✅ Forwards to Flask ML service
- ✅ Error handling and logging
- ✅ CORS-friendly responses

**Validation:**
- Accepts only image files (JPEG, PNG, GIF, WebP, etc.)
- Maximum file size: 10MB
- Returns appropriate HTTP status codes

---

## 🔄 Data Flow

```
User Action (Browser)
        ↓
[farmer/find/page.tsx]
  - State management (selectedImage, predictionResult)
  - File validation
  - POST /api/predict (with FormData)
        ↓
[backend/routes/predict.js]
  - Multer receives file
  - Validates file type and size
  - POST to Flask with FormData
        ↓
[Flask ML Service] (port 5000)
  - Process image
  - Run ML model
  - Return predictions
        ↓
[Response back through Express]
  - Format response
  - Return to frontend
        ↓
[farmer/find/page.tsx]
  - Display results
  - Show confidence score
  - Show symptoms and treatment
  - Toast notification
```

---

## 🔧 API Specification

### POST /api/predict

**Request:**
```
Content-Type: multipart/form-data
Body: 
  - image: File (PNG, JPG, GIF, up to 10MB)
```

**Response (200 OK):**
```json
{
  "disease_name": "Leaf Spot",
  "confidence": 0.92,
  "symptoms": [
    "Brown spots on leaves",
    "Yellow halo around spots"
  ],
  "treatment": "Apply fungicide spray weekly..."
}
```

**Error Responses:**
- `400` - Missing file or invalid file type
- `413` - File too large
- `500` - Server error
- `503` - Flask service unavailable

---

## 🎨 UI Breakdown

### Left Column (Upload Section)
- Title: "Upload Image"
- Upload drop zone (or image preview if selected)
- "Identify Disease" button (disabled until image is selected)

### Right Column (Results Panel)
**When no results:**
- Placeholder icon
- Text: "No analysis yet"

**When results available:**
- Disease Name (large, bold)
- Confidence Score (with visual progress bar)
- Key Symptoms (bulleted list with checkmarks)
- Treatment Recommendations (highlighted box)
- "Analyze Another Image" button

---

## 🛠️ Customization Options

### Adjust File Size Limit
In `backend/routes/predict.js`:
```javascript
limits: {
  fileSize: 20 * 1024 * 1024, // Change to 20MB
}
```

### Add More Validation
In the frontend component:
```javascript
// Add image dimension checks
const img = new Image();
img.onload = () => {
  if (img.width < 300 || img.height < 300) {
    toast.error('Image must be at least 300x300 pixels');
    return;
  }
  // Process image...
};
img.src = selectedImage;
```

### Customize Flask Port
In `backend/routes/predict.js`:
```javascript
const flaskResponse = await axios.post(
  'http://localhost:YOUR_PORT/predict', // Change port here
  formData,
  { headers: formData.getHeaders() }
);
```

---

## 📝 Flask Service Expected Response Format

Your Flask `/predict` endpoint must return:

```python
{
    "disease_name": str,           # Required: Name of the disease
    "confidence": float,           # Required: 0-1 confidence score
    "symptoms": list[str],         # Optional: List of symptoms
    "treatment": str              # Optional: Treatment recommendations
}
```

Example Flask endpoint:

```python
@app.route('/predict', methods=['POST'])
def predict():
    image = request.files['image']
    
    # Your ML model prediction logic here
    model_prediction = your_model.predict(image)
    
    return jsonify({
        "disease_name": model_prediction.disease,
        "confidence": float(model_prediction.confidence),
        "symptoms": model_prediction.symptoms,
        "treatment": model_prediction.treatment
    })
```

---

## ✅ Testing Checklist

- [ ] Flask service running on port 5000
- [ ] Express backend integrated with predict route
- [ ] Next.js frontend running on port 3000
- [ ] Can drag and drop image
- [ ] Can click to select image
- [ ] Image preview displays correctly
- [ ] File validation works (rejects non-images)
- [ ] Size validation works (rejects >10MB)
- [ ] Loading spinner shows during analysis
- [ ] Results display on success
- [ ] Error toast shows on failure
- [ ] "Analyze Another Image" button resets state
- [ ] Responsive on mobile devices

---

## 🐛 Troubleshooting

### "ML service is unavailable"
- Check Flask service is running: `python app.py`
- Verify port 5000 is correct
- Check no firewall is blocking the connection

### "Failed to analyze image"
- Check browser console for error details
- Check Express server logs
- Check Flask server logs
- Ensure Flask endpoint returns correct JSON

### Image preview not showing
- Check browser console for errors
- Verify file is a valid image
- Check file size is less than 10MB

### Toast notifications not showing
- Verify `react-hot-toast` is installed
- Check `Toaster` component is mounted in layout
- Check no CSS conflicts with toast styles

---

## 📚 Dependencies

**Frontend:**
- `next` (16.2.4 or compatible)
- `axios` - HTTP requests
- `react-hot-toast` - Notifications
- `react-icons` - UI icons
- `tailwindcss` (4.x) - Styling

**Backend:**
- `express` - Web framework
- `multer` - File upload handling
- `axios` - HTTP requests to Flask
- `form-data` - FormData handling

**ML Service:**
- Flask (Python)
- Your ML model (PyTorch, TensorFlow, etc.)

---

## 🎯 Next Steps

1. ✅ Copy all files to your project
2. ✅ Install dependencies: `npm install`
3. ✅ Integrate predict route in main server
4. ✅ Test with your Flask service
5. ✅ Deploy when ready

Happy farming! 🚜
