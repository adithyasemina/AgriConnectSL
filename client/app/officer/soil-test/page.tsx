"use client";

import { useState } from "react";

function SendIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
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

function BeakerIcon({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.36-4.24l.707-.707M9 12a3 3 0 110-6 3 3 0 010 6z"
      />
    </svg>
  );
}

type SoilTest = {
  id: number;
  farmerName: string;
  soilPH: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  status: string;
  recommendation: string;
  sentDate: string;
};

const sampleFarmers = [
  "Nimal Perera",
  "Saman Kumara",
  "Kasun Silva",
  "Amal Fernando",
  "Roshan Jayasekara",
];

const sampleSoilTests: SoilTest[] = [
  {
    id: 1,
    farmerName: "Nimal Perera",
    soilPH: 6.5,
    nitrogen: "High",
    phosphorus: "Medium",
    potassium: "High",
    status: "Good",
    recommendation: "Soil is suitable for paddy cultivation. Maintain current practices.",
    sentDate: "2024-01-20",
  },
  {
    id: 2,
    farmerName: "Kasun Silva",
    soilPH: 5.8,
    nitrogen: "Low",
    phosphorus: "Low",
    potassium: "Medium",
    status: "Moderate",
    recommendation: "Apply nitrogen fertilizer and phosphate rock. Retest in 2 months.",
    sentDate: "2024-01-18",
  },
  {
    id: 3,
    farmerName: "Amal Fernando",
    soilPH: 7.2,
    nitrogen: "Medium",
    phosphorus: "Low",
    potassium: "Low",
    status: "Poor",
    recommendation: "Soil pH is too high. Apply sulfur to lower pH. Apply organic matter.",
    sentDate: "2024-01-15",
  },
];

export default function SoilTestPage() {
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [soilPH, setSoilPH] = useState("");
  const [nitrogen, setNitrogen] = useState("Medium");
  const [phosphorus, setPhosphorus] = useState("Medium");
  const [potassium, setPotassium] = useState("Medium");
  const [status, setStatus] = useState("Good");
  const [recommendation, setRecommendation] = useState("");
  const [soilTests, setSoilTests] = useState<SoilTest[]>(sampleSoilTests);
  const [sentMessage, setSentMessage] = useState(false);

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFarmer || !soilPH || !recommendation) {
      return;
    }

    const newTest: SoilTest = {
      id: soilTests.length + 1,
      farmerName: selectedFarmer,
      soilPH: parseFloat(soilPH),
      nitrogen,
      phosphorus,
      potassium,
      status,
      recommendation,
      sentDate: new Date().toISOString().split("T")[0],
    };

    setSoilTests([newTest, ...soilTests]);
    setSelectedFarmer("");
    setSoilPH("");
    setNitrogen("Medium");
    setPhosphorus("Medium");
    setPotassium("Medium");
    setStatus("Good");
    setRecommendation("");
    setSentMessage(true);

    setTimeout(() => setSentMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Soil Test Reports
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Send soil test results and recommendations to farmers
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-6 text-lg font-black text-slate-900">
            Send Soil Report
          </h2>

          <form onSubmit={handleSendReport} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Select Farmer
              </label>
              <select
                value={selectedFarmer}
                onChange={(e) => setSelectedFarmer(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Choose farmer...</option>
                {sampleFarmers.map((farmer) => (
                  <option key={farmer} value={farmer}>
                    {farmer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Soil pH Level
              </label>
              <input
                type="number"
                step="0.1"
                value={soilPH}
                onChange={(e) => setSoilPH(e.target.value)}
                placeholder="e.g., 6.5"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nitrogen
                </label>
                <select
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phosphorus
                </label>
                <select
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Potassium
                </label>
                <select
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Overall Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option>Good</option>
                <option>Moderate</option>
                <option>Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Recommendation
              </label>
              <textarea
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Provide recommendations based on soil test results..."
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <SendIcon />
              Send Soil Report Notification
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-black text-slate-900">Info</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-slate-900">Test Parameters</p>
              <p className="text-slate-600 text-xs mt-1">
                pH level, nitrogen, phosphorus, and potassium levels are measured.
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Status</p>
              <p className="text-slate-600 text-xs mt-1">
                Good: Soil is suitable for cultivation
              </p>
              <p className="text-slate-600 text-xs">
                Moderate: Minor amendments needed
              </p>
              <p className="text-slate-600 text-xs">
                Poor: Significant improvements required
              </p>
            </div>
          </div>
        </div>
      </div>

      {sentMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex gap-3">
          <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-emerald-900">Report sent successfully!</p>
            <p className="text-sm text-emerald-700">
              The soil test report has been sent to the farmer.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-black text-slate-900">
          Recent Soil Tests ({soilTests.length})
        </h2>

        <div className="space-y-4">
          {soilTests.map((test) => (
            <div
              key={test.id}
              className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <BeakerIcon className="h-4 w-4 text-emerald-600" />
                    {test.farmerName}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {test.recommendation}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    test.status === "Good"
                      ? "bg-emerald-100 text-emerald-700"
                      : test.status === "Moderate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {test.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-500">pH</p>
                  <p className="font-bold text-slate-900">{test.soilPH}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-500">N</p>
                  <p className="font-bold text-slate-900">{test.nitrogen}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-500">P</p>
                  <p className="font-bold text-slate-900">{test.phosphorus}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-500">K</p>
                  <p className="font-bold text-slate-900">{test.potassium}</p>
                </div>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>{new Date(test.sentDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
