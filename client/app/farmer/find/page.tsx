"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getToken } from "@/lib/auth";

function UploadIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function AlertIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4v2m0 0a5 5 0 110-10 5 5 0 010 10zm0-10a5 5 0 100 10 5 5 0 000-10z"
      />
    </svg>
  );
}

type PredictionResult = {
  prediction: string;
  confidence: number;
  classIndex: number;
  allPredictions: Array<{
    label: string;
    confidence: number;
  }>;
} | null;

type HistoryItem = {
  _id: string;
  imageName: string;
  prediction: string;
  confidence: number;
  classIndex: number;
  allPredictions: Array<{
    label: string;
    confidence: number;
  }>;
  createdAt: string;
  updatedAt: string;
};

const DISEASE_RECOMMENDATIONS: Record<string, string[]> = {
  "Leaf Blast": [
    "Use blast-resistant rice varieties suited to your region",
    "Avoid dense planting to improve air circulation",
    "Apply recommended fungicide if confidence is high",
    "Maintain optimal nitrogen levels",
    "Remove infected plant debris",
  ],
  "Bacterial Blight": [
    "Avoid excessive nitrogen fertilization",
    "Improve field drainage to reduce moisture",
    "Use clean, disease-free seeds",
    "Implement crop rotation",
    "Remove and destroy infected plants",
  ],
  "Brown Spot": [
    "Ensure adequate potassium fertilization",
    "Improve drainage to reduce water stress",
    "Remove infected leaves and debris",
    "Use disease-resistant varieties",
    "Maintain proper field sanitation",
  ],
  "Leaf Scald": [
    "Remove infected plant debris",
    "Avoid overhead irrigation when possible",
    "Use healthy, certified seeds",
    "Improve drainage in affected areas",
    "Monitor field regularly for spread",
  ],
  "Tungro": [
    "Remove and destroy infected plants immediately",
    "Control green leafhoppers using appropriate insecticides",
    "Use resistant rice varieties",
    "Avoid planting near infected fields",
    "Implement vector management practices",
  ],
  "Healthy Leaf": [
    "No disease detected - continue regular monitoring",
    "Maintain proper field management practices",
    "Monitor for any changes in leaf appearance",
    "Keep records of field conditions",
    "Follow crop calendar for timely interventions",
  ],
};

export default function FindDiseasePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult>(null);
  const [error, setError] = useState<string>("");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string>("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<HistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const token = getToken();

      const response = await fetch(`${apiUrl}/api/leaf/history`, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history");
      }

      setHistory(data.predictions || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch history";
      setHistoryError(message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const token = getToken();

      const response = await fetch(`${apiUrl}/api/leaf/predict`, {
        method: "POST",
        body: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (data.lowConfidence) {
        setResult(null);
        setError(data.message);
        toast.error(data.message);
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        classIndex: data.classIndex,
        allPredictions: data.allPredictions,
      });
      toast.success("Prediction completed");
      await fetchHistory();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to predict";
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewHistory = (item: HistoryItem) => {
    setSelectedDetail(item);
    setDetailModalOpen(true);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName("");
    setError("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-black text-slate-900">
            Upload Image
          </h2>

          {!previewUrl ? (
            <label className="block">
              <div className="cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 px-6 py-12 text-center transition hover:bg-blue-100">
                <UploadIcon className="mx-auto mb-4 h-10 w-10 text-blue-600" />
                <p className="text-sm font-bold text-slate-900">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center" style={{ minHeight: "300px" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-96 w-full object-contain"
                />
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Filename:</p>
                <p className="truncate text-sm font-bold text-slate-900">
                  {fileName}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Disease"}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isAnalyzing}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Change Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {error && !result && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertIcon className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-red-600">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result ? (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-slate-900">
                      {result.prediction}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Detection complete
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                    <p className="text-sm font-semibold text-slate-600">
                      Confidence Score
                    </p>
                    <div className="mt-2 flex items-end gap-3">
                      <p className="text-3xl font-black text-blue-600">
                        {result.confidence}%
                      </p>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${Math.min(result.confidence, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-4">
                  All Predictions
                </h3>
                <div className="space-y-2">
                  {result.allPredictions.map((pred, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {pred.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${Math.min(pred.confidence, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-12 text-right">
                          {pred.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-black text-slate-900">
                    Recommendations
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(DISEASE_RECOMMENDATIONS[result.prediction] || []).map((rec, idx) => (
                    <li key={idx} className="flex gap-3 rounded-lg bg-blue-50 p-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Upload an image to analyze your paddy leaf for diseases. Our AI
                will provide:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex gap-3 text-sm text-slate-600">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  Disease identification
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  Confidence score
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  All predictions ranked
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  Officer consultation recommended
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-black text-slate-900">
            Recent Disease Analyses
          </h2>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="text-sm text-slate-500">Loading history...</p>
              </div>
            </div>
          ) : historyError ? (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-700">{historyError}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-slate-500">No previous analyses yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Prediction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Confidence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-black uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-700 truncate max-w-xs">
                        {item.imageName}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">
                        {item.prediction}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(item.confidence, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-600 w-10 text-right">
                            {item.confidence}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleViewHistory(item)}
                          className="inline-flex items-center justify-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg m-4">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-6">
              <h2 className="text-xl font-black text-slate-900">
                Analysis Details
              </h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Image Info */}
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                  Image Name
                </p>
                <p className="text-sm font-bold text-slate-900 break-all">
                  {selectedDetail.imageName}
                </p>
              </div>

              {/* Disease and Confidence */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">
                    Predicted Disease
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {selectedDetail.prediction}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">
                    Confidence Score
                  </p>
                  <div className="flex items-end gap-3">
                    <p className="text-3xl font-black text-blue-600">
                      {selectedDetail.confidence}%
                    </p>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(selectedDetail.confidence, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Analyzed */}
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                  Date Analyzed
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {new Date(selectedDetail.updatedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              {/* All Predictions */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-3 uppercase">
                  All Predictions
                </h3>
                <div className="space-y-2">
                  {selectedDetail.allPredictions.map((pred, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {pred.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${Math.min(pred.confidence, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-10 text-right">
                          {pred.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-3 uppercase">
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {(DISEASE_RECOMMENDATIONS[selectedDetail.prediction] ||
                    []).map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 rounded-lg bg-blue-50 p-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-white p-6">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
