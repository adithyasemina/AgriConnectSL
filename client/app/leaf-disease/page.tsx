"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function LeafDiseasePage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [language, setLanguage] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select a leaf image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("language", language);

      const response = await api.post("/api/leaf/predict", formData);

      setResult(response.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-green-700">
          Paddy Leaf Disease Detection
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Upload a paddy leaf image to detect disease using ML model.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Select Leaf Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full rounded-lg border p-3"
            />

            {preview && (
              <img
                src={preview}
                alt="Leaf preview"
                className="mt-5 h-72 w-full rounded-xl object-cover"
              />
            )}

            <label className="mt-5 block text-sm font-semibold text-gray-700">
              Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Predicting..." : "Predict Disease"}
            </button>
          </div>

          <div className="rounded-xl border bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-800">
              Prediction Result
            </h2>

            {!result && (
              <p className="mt-6 text-gray-500">
                Result will appear here after prediction.
              </p>
            )}

            {result && (
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Disease Name</p>
                  <p className="text-2xl font-bold text-green-700">
                    {result.disease_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="text-lg font-semibold">
                    {result.predicted_class}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {result.confidence}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Selected Language</p>
                  <p className="font-semibold">
                    {result.language === "si" ? "සිංහල" : "English"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}