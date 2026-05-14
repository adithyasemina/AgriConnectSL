'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUploadCloud, FiLoader, FiX } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';

interface PredictionResult {
  disease_name: string;
  confidence: number;
  symptoms?: string[];
  treatment?: string;
}

export default function FindDiseasePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    processImage(file);
  };

  const handleDragAndDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please drop a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    processImage(file);
  };

  const processImage = (file: File) => {
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleIdentifyDisease = async () => {
    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPredictionResult(response.data);
      toast.success('Disease identification complete!');
    } catch (error) {
      console.error('Error identifying disease:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to identify disease. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImageFile(null);
    setPredictionResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Disease
          </h1>
          <p className="text-gray-600">
            Upload images and get disease diagnosis
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Upload Image
              </h2>

              {/* Image Preview */}
              {selectedImage && !predictionResult ? (
                <div className="mb-6">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected preview"
                      className="w-full h-64 md:h-96 object-contain rounded-lg border border-gray-200 bg-gray-100"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    {imageFile?.name}
                  </p>
                </div>
              ) : !predictionResult ? (
                /* Upload Drop Zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleDragAndDrop}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 md:p-12 text-center bg-blue-50 mb-6 cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <FiUploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                    <p className="text-lg font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              ) : null}

              {/* Results Preview */}
              {predictionResult && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MdCheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Analysis Complete</p>
                      <p className="text-sm text-green-700">
                        Disease identified: <strong>{predictionResult.disease_name}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {predictionResult ? (
                  <button
                    onClick={resetAnalysis}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Analyze Another Image
                  </button>
                ) : (
                  <button
                    onClick={handleIdentifyDisease}
                    disabled={!imageFile || loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin h-5 w-5" />
                        Analyzing...
                      </>
                    ) : (
                      'Identify Disease'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 sticky top-8">
              {predictionResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Diagnosis Results
                    </h3>
                  </div>

                  {/* Disease Name */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Disease Identified</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {predictionResult.disease_name}
                    </p>
                  </div>

                  {/* Confidence Score */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Confidence Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round(predictionResult.confidence * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-900 min-w-fit">
                        {Math.round(predictionResult.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Key Symptoms */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Key Symptoms</p>
                    {predictionResult.symptoms &&
                    predictionResult.symptoms.length > 0 ? (
                      <ul className="space-y-2">
                        {predictionResult.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <MdCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No symptoms data available
                      </p>
                    )}
                  </div>

                  {/* Treatment Recommendations */}
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Treatment Recommendations
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {predictionResult.treatment ||
                          'Please consult with an agricultural expert for personalized treatment recommendations.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <FiUploadCloud className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No analysis yet</p>
                  <p className="text-sm text-gray-500">
                    Upload an image to the left and click "Identify Disease" to get
                    started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
