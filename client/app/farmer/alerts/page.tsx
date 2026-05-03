"use client";

import { useState } from "react";

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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

type Alert = {
  id: number;
  title: string;
  message: string;
  priority: "Low" | "Medium" | "High";
  district: string;
  sentDate: string;
  officer: string;
};

const sampleAlerts: Alert[] = [
  {
    id: 1,
    title: "Heavy Rain Warning",
    message: "Heavy rain expected in next 24 hours. Protect crops accordingly. Ensure proper drainage in your fields.",
    priority: "High",
    district: "Kandy",
    sentDate: "2024-01-25",
    officer: "Officer Saman Kumara",
  },
  {
    id: 2,
    title: "Pest Alert - Fall Armyworm",
    message: "Fall armyworm detected in the region. Use recommended pesticides. Check your fields regularly.",
    priority: "Medium",
    district: "Kandy",
    sentDate: "2024-01-24",
    officer: "Officer Nimal Perera",
  },
  {
    id: 3,
    title: "Fertilizer Price Update",
    message: "Fertilizer prices have increased by 5%. Plan your purchases accordingly.",
    priority: "Low",
    district: "Central",
    sentDate: "2024-01-23",
    officer: "Officer Kasun Silva",
  },
  {
    id: 4,
    title: "Disease Alert - Blast",
    message: "Paddy leaf blast reported in nearby farms. Apply fungicide preventively. Monitor your crops closely.",
    priority: "High",
    district: "Kandy",
    sentDate: "2024-01-22",
    officer: "Officer Amal Fernando",
  },
  {
    id: 5,
    title: "Irrigation Schedule Update",
    message: "Updated irrigation schedule for the season. Optimal timing is early morning.",
    priority: "Medium",
    district: "Central",
    sentDate: "2024-01-21",
    officer: "Officer Roshan Jayasekara",
  },
  {
    id: 6,
    title: "Market Price Alert",
    message: "Paddy prices expected to increase next week. Consider timing your sales accordingly.",
    priority: "Low",
    district: "Western",
    sentDate: "2024-01-20",
    officer: "Officer Saman Kumara",
  },
];

type FilterType = "All" | "High" | "Medium" | "Low";

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterType>("All");

  const filteredAlerts = sampleAlerts.filter((alert) => {
    if (filter === "All") return true;
    if (filter === "High") return alert.priority === "High";
    if (filter === "Medium") return alert.priority === "Medium";
    if (filter === "Low") return alert.priority === "Low";
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("All")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            filter === "All"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
          }`}
        >
          All ({sampleAlerts.length})
        </button>
        <button
          onClick={() => setFilter("High")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            filter === "High"
              ? "bg-red-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-red-600 hover:text-red-600"
          }`}
        >
          High Priority ({sampleAlerts.filter((a) => a.priority === "High").length})
        </button>
        <button
          onClick={() => setFilter("Medium")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            filter === "Medium"
              ? "bg-yellow-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-yellow-600 hover:text-yellow-600"
          }`}
        >
          Medium ({sampleAlerts.filter((a) => a.priority === "Medium").length})
        </button>
        <button
          onClick={() => setFilter("Low")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            filter === "Low"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
          }`}
        >
          Low ({sampleAlerts.filter((a) => a.priority === "Low").length})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                    <AlertIcon className="h-6 w-6 text-slate-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-slate-900">
                      {alert.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                      {alert.message}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>📍 {alert.district}</span>
                      <span>👤 {alert.officer}</span>
                      <span>📅 {new Date(alert.sentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`mt-2 sm:mt-0 flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap ${getPriorityColor(
                    alert.priority
                  )}`}
                >
                  {alert.priority} Priority
                </span>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <button className="text-xs font-black text-blue-600 hover:text-blue-700 transition">
                  Read Full Alert →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <AlertIcon className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-500">No alerts found for this filter</p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-black text-blue-900">📢 How Alerts Work</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li>✓ Officers send alerts about weather, pests, diseases, and market updates</li>
          <li>✓ High Priority alerts need immediate attention for your safety</li>
          <li>✓ Medium alerts are recommended actions for better crop health</li>
          <li>✓ Low alerts are informational updates about prices and schedules</li>
        </ul>
      </div>
    </div>
  );
}
