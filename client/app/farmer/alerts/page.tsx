"use client";

import { api } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuX, LuLoader } from "react-icons/lu";

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
  _id: string;
  title: string;
  message: string;
  priority: "Low" | "Medium" | "High";
  targetType: "all" | "provinces" | "districts";
  targetProvinces: string[];
  targetDistricts: string[];
  createdByName?: string;
  createdBy?: { firstName: string; lastName: string } | string;
  createdAt: string;
};

type FilterType = "All" | "High" | "Medium" | "Low";

export default function AlertsPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterType>("All");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const user = getAuthUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/farmer/alerts");
      const activeAlerts = res.data.alerts?.active || [];
      setAlerts(activeAlerts);
    } catch (error: any) {
      console.error("Fetch farmer alerts error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch alerts");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const visibleAlerts = alerts;

  const filteredAlerts = visibleAlerts.filter((alert) => {
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

  const getCreatedByName = (alert: Alert) => {
    if (typeof alert.createdBy === "string") return alert.createdBy;
    if (alert.createdBy) {
      return `${alert.createdBy.firstName} ${alert.createdBy.lastName}`;
    }
    return alert.createdByName || "Officer";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const getRemainingTime = (expiresAt: string | null | undefined): string => {
    if (!expiresAt) return "No expiry";

    try {
      const now = new Date();
      const expiryDate = new Date(expiresAt);
      const diffMs = expiryDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        return "Expired";
      }

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (diffDays > 0) {
        return `${diffDays}d ${diffHours % 24}h left`;
      } else if (diffHours > 0) {
        return `${diffHours}h ${diffMins}m left`;
      } else {
        return `${diffMins}m left`;
      }
    } catch {
      return "Unknown";
    }
  };

  const openAlertModal = (alert: Alert) => {
    setSelectedAlert(alert);
    setModalOpen(true);
  };

  const closeAlertModal = () => {
    setModalOpen(false);
    setSelectedAlert(null);
  };

  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <LuLoader className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Loading alerts...</p>
      </div>
    );
  }

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
          All ({filteredAlerts.length})
        </button>
        <button
          onClick={() => setFilter("High")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            filter === "High"
              ? "bg-red-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-red-600 hover:text-red-600"
          }`}
        >
          High Priority ({visibleAlerts.filter((a) => a.priority === "High").length})
        </button>
        <button
          onClick={() => setFilter("Medium")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            filter === "Medium"
              ? "bg-yellow-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-yellow-600 hover:text-yellow-600"
          }`}
        >
          Medium ({visibleAlerts.filter((a) => a.priority === "Medium").length})
        </button>
        <button
          onClick={() => setFilter("Low")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            filter === "Low"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
          }`}
        >
          Low ({visibleAlerts.filter((a) => a.priority === "Low").length})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert._id}
              onClick={() => openAlertModal(alert)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg hover:border-blue-300 transition cursor-pointer"
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
                      <span>👤 {getCreatedByName(alert)}</span>
                      <span>📅 {formatDate(alert.createdAt)}</span>
                      {alert.targetType === "districts" && alert.targetDistricts.length > 0 && (
                        <span>📍 {alert.targetDistricts.join(", ")}</span>
                      )}
                      {alert.targetType === "provinces" && alert.targetProvinces.length > 0 && (
                        <span>📍 {alert.targetProvinces.join(", ")}</span>
                      )}
                      {alert.targetType === "all" && (
                        <span>📍 Island-wide</span>
                      )}
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
                <p className="text-xs text-slate-500 line-clamp-2">{alert.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <AlertIcon className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-500">
              {visibleAlerts.length === 0
                ? "No alerts targeted to your location"
                : "No alerts found for this filter"}
            </p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-black text-blue-900">📢 How Alerts Work</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li>✓ Officers send alerts about weather, pests, diseases, and market updates</li>
          <li>✓ You only see alerts targeted to your location ({user?.province}, {user?.district})</li>
          <li>✓ High Priority alerts need immediate attention for your safety</li>
          <li>✓ Medium alerts are recommended actions for better crop health</li>
          <li>✓ Low alerts are informational updates about prices and schedules</li>
        </ul>
      </div>

      {/* Alert Details Modal */}
      {modalOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="max-h-[90vh] w-full max-w-2xl rounded-[2rem] bg-white shadow-lg overflow-hidden flex flex-col my-8">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 z-10 flex-shrink-0">
              <h2 className="text-lg font-black text-slate-900">Alert Details</h2>
              <button
                onClick={closeAlertModal}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 p-6 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Alert Title</label>
                <p className="mt-2 text-sm font-bold text-slate-900">{selectedAlert.title}</p>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Full Message</label>
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{selectedAlert.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Priority</label>
                  <p className="mt-2">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getPriorityColor(selectedAlert.priority)}`}>
                      {selectedAlert.priority}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Sent By</label>
                  <p className="mt-2 text-sm font-bold text-slate-900">{getCreatedByName(selectedAlert)}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Target Area</label>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {selectedAlert.targetType === "all" && "Island-wide (All Provinces & Districts)"}
                  {selectedAlert.targetType === "provinces" && `Provinces: ${selectedAlert.targetProvinces.join(", ")}`}
                  {selectedAlert.targetType === "districts" && `Districts: ${selectedAlert.targetDistricts.join(", ")}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Sent Date</label>
                  <p className="mt-2 text-sm text-slate-700">{formatDate(selectedAlert.createdAt)}</p>
                </div>
                {selectedAlert.expiresAt && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Expires</label>
                    <p className="mt-2 text-sm text-slate-700">{formatDate(selectedAlert.expiresAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex-shrink-0">
              <button
                onClick={closeAlertModal}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700"
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
