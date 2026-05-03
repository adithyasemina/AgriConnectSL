"use client";

import { useState } from "react";

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

type AnalysisResult = {
  disease: string;
  confidence: number;
  symptoms: string[];
  recommendations: string[];
} | null;

export default function FindDiseasePage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!image) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        disease: "Paddy Leaf Blast",
        confidence: 92,
        symptoms: [
          "Brown lesions with gray centers on leaf blades",
          "Lesions have a distinctive spindle shape",
          "May appear on stems and panicles",
        ],
        recommendations: [
          "Apply fungicide: Tricyclazole or Propiconazole",
          "Ensure proper field drainage",
          "Remove infected plant debris",
          "Use blast-resistant rice varieties",
          "Maintain optimal nitrogen levels",
        ],
      });
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setFileName("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Find Paddy Disease
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Upload a paddy leaf image to check for possible diseases
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-black text-slate-900">
            Upload Image
          </h2>

          {!image ? (
            <label className="block">
              <div className="cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-6 py-12 text-center transition hover:bg-emerald-100">
                <UploadIcon className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
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
              <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={image}
                  alt="Preview"
                  className="max-h-96 w-full object-cover"
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
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
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
          {result ? (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {result.disease}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Analysis complete
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                  <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 p-4">
                    <p className="text-sm font-semibold text-slate-600">
                      Confidence Score
                    </p>
                    <div className="mt-2 flex items-end gap-3">
                      <p className="text-3xl font-black text-emerald-600">
                        {result.confidence}%
                      </p>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">Symptoms</h3>
                <ul className="mt-4 space-y-2">
                  {result.symptoms.map((symptom) => (
                    <li
                      key={symptom}
                      className="flex gap-3 rounded-lg bg-slate-50 p-3"
                    >
                      <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-700">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertIcon className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-black text-slate-900">
                    Recommendations
                  </h3>
                </div>
                <ul className="space-y-2">
                  {result.recommendations.map((rec) => (
                    <li
                      key={rec}
                      className="flex gap-3 rounded-lg bg-emerald-50 p-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        ✓
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
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  Disease identification
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  Confidence score
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  Key symptoms
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  Treatment recommendations
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
