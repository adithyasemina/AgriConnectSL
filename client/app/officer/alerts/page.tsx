"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuPlus,
  LuEye,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuTrash2,
  LuPencil,
} from "react-icons/lu";

type Alert = {
  _id: string;
  title: string;
  message: string;
  priority: "Low" | "Medium" | "High";
  targetType: "all" | "provinces" | "districts";
  targetProvinces: string[];
  targetDistricts: string[];
  createdBy: { firstName: string; lastName: string } | string;
  createdByName?: string;
  createdAt: string;
  expiresAt?: string;
};

const locations = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
} as const;

const SRI_LANKAN_PROVINCES = Object.keys(locations) as Array<keyof typeof locations>;

export default function AlertsPage() {
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [expiredAlerts, setExpiredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [expiredPriorityFilter, setExpiredPriorityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [currentPageRecent, setCurrentPageRecent] = useState(0);
  const [currentPageExpired, setCurrentPageExpired] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedDeleteAlert, setSelectedDeleteAlert] = useState<Alert | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [pendingSendAlert, setPendingSendAlert] = useState(false);

  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [allProvinces, setAllProvinces] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    expiresAt: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRemainingTimes();
    }, 1000);
    return () => clearInterval(interval);
  }, [recentAlerts, expiredAlerts]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/officer/alerts");
      setRecentAlerts(res.data.alerts.recent || []);
      setExpiredAlerts(res.data.alerts.expired || []);
      updateRemainingTimes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch alerts");
      setRecentAlerts([]);
      setExpiredAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateRemainingTimes = () => {
    const times: Record<string, string> = {};
    const now = new Date();

    [...recentAlerts, ...expiredAlerts].forEach((alert) => {
      if (alert.expiresAt) {
        const expiryDate = new Date(alert.expiresAt);
        const diffMs = expiryDate.getTime() - now.getTime();

        if (diffMs <= 0) {
          times[alert._id] = "Expired";
        } else {
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffHours / 24);
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

          if (diffDays > 0) {
            times[alert._id] = `${diffDays}d ${diffHours % 24}h left`;
          } else if (diffHours > 0) {
            times[alert._id] = `${diffHours}h ${diffMins}m left`;
          } else {
            times[alert._id] = `${diffMins}m left`;
          }
        }
      } else {
        times[alert._id] = "No expiry";
      }
    });

    setRemainingTimes(times);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Alert title is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    if (!allProvinces && selectedProvinces.length === 0) {
      errors.provinces = "Please select at least one province or send to all provinces";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPendingSendAlert(true);
    setSendConfirmOpen(true);
  };

  const confirmSendAlert = async () => {
    try {
      let targetProvinces = selectedProvinces;
      let targetDistricts = selectedDistricts;
      let targetType: "all" | "provinces" | "districts" = "all";

      if (allProvinces) {
        targetType = "all";
        targetProvinces = [];
        targetDistricts = [];
      } else if (selectedDistricts.length > 0) {
        targetType = "districts";
        targetProvinces = selectedProvinces;
        targetDistricts = selectedDistricts;
      } else if (selectedProvinces.length > 0) {
        targetType = "provinces";
        targetProvinces = selectedProvinces;
        targetDistricts = [];
      }

      setSending(true);

      const alertPayload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        priority: formData.priority,
        targetType,
        targetProvinces,
        targetDistricts,
        expiresAt: formData.expiresAt || null,
      };

      if (editingAlertId) {
        // Update existing alert using PUT
        const response = await api.put(`/api/officer/alerts/${editingAlertId}`, alertPayload);
        console.log("Alert updated:", response.data);
        toast.success("Alert updated successfully");
        setEditingAlertId(null);
      } else {
        // Create new alert using POST
        const response = await api.post("/api/officer/alerts", alertPayload);
        console.log("Alert created:", response.data);
        toast.success("Alert created successfully");
      }

      setCreateModalOpen(false);
      resetForm();
      fetchAlerts();
    } catch (error: any) {
      console.error("Full error object:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to send alert";
      toast.error(errorMsg);
    } finally {
      setSending(false);
      setSendConfirmOpen(false);
      setPendingSendAlert(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", message: "", priority: "Medium", expiresAt: "" });
    setFormErrors({});
    setAllProvinces(false);
    setSelectedProvinces([]);
    setSelectedDistricts([]);
    setEditingAlertId(null);
  };

  const handleEditAlert = (alert: Alert) => {
    setFormData({
      title: alert.title,
      message: alert.message,
      priority: alert.priority,
      expiresAt: alert.expiresAt ? new Date(alert.expiresAt).toISOString().slice(0, 16) : "",
    });

    if (alert.targetType === "all") {
      setAllProvinces(true);
      setSelectedProvinces([]);
      setSelectedDistricts([]);
    } else {
      setAllProvinces(false);
      setSelectedProvinces(alert.targetProvinces);
      setSelectedDistricts(alert.targetDistricts);
    }

    setEditingAlertId(alert._id);
    setCreateModalOpen(true);
    setFormErrors({});
  };

  const handleDeleteClick = (alert: Alert) => {
    setSelectedDeleteAlert(alert);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteAlert) return;

    setDeleting(true);
    try {
      await api.delete(`/api/officer/alerts/${selectedDeleteAlert._id}`);
      toast.success("Alert deleted successfully");
      setDeleteConfirmOpen(false);
      setSelectedDeleteAlert(null);
      fetchAlerts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete alert");
      console.error("Delete alert error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredRecentAlerts = recentAlerts.filter((alert) => {
    if (priorityFilter === "All") return true;
    return alert.priority === priorityFilter;
  });

  const filteredExpiredAlerts = expiredAlerts.filter((alert) => {
    if (expiredPriorityFilter === "All") return true;
    return alert.priority === expiredPriorityFilter;
  });

  const paginatedRecentAlerts = filteredRecentAlerts.slice(
    currentPageRecent * ITEMS_PER_PAGE,
    (currentPageRecent + 1) * ITEMS_PER_PAGE
  );

  const paginatedExpiredAlerts = filteredExpiredAlerts.slice(
    currentPageExpired * ITEMS_PER_PAGE,
    (currentPageExpired + 1) * ITEMS_PER_PAGE
  );

  const totalRecentPages = Math.max(1, Math.ceil(filteredRecentAlerts.length / ITEMS_PER_PAGE));
  const totalExpiredPages = Math.max(1, Math.ceil(filteredExpiredAlerts.length / ITEMS_PER_PAGE));

  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "bg-red-100 text-red-700";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  const formatExpiredDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const getAvailableDistricts = () => {
    if (selectedProvinces.length === 0) return [];
    const districts: string[] = [];
    selectedProvinces.forEach((province) => {
      const provinceKey = province as keyof typeof locations;
      if (locations[provinceKey]) {
        districts.push(...locations[provinceKey]);
      }
    });
    return Array.from(new Set(districts)).sort();
  };

  const handleProvinceChange = (province: string, checked: boolean) => {
    if (checked) {
      setSelectedProvinces([...selectedProvinces, province]);
    } else {
      const newProvinces = selectedProvinces.filter((p) => p !== province);
      setSelectedProvinces(newProvinces);

      const availableDistricts = newProvinces.length === 0
        ? []
        : (() => {
            const districts: string[] = [];
            newProvinces.forEach((p) => {
              const key = p as keyof typeof locations;
              if (locations[key]) {
                districts.push(...locations[key]);
              }
            });
            return districts;
          })();

      const updatedDistricts = selectedDistricts.filter((d) =>
        availableDistricts.includes(d)
      );
      setSelectedDistricts(updatedDistricts);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-2 pb-20">
      {/* Recent Alerts Section */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title and Count */}
          <div className="flex items-center ml-4 gap-3 min-w-fit">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-slate-900">RECENT ALERTS</h2>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                {filteredRecentAlerts.length} ALERTS
                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              </p>
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 sm:justify-end">
            <div className="relative inline-block">
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value as "All" | "Low" | "Medium" | "High");
                  setCurrentPageRecent(0);
                }}
                className="appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:flex flex-col overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[25%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Alert Title
                  </th>
                  <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Remaining Time
                  </th>
                  <th className="w-[15%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Priority
                  </th>
                  <th className="w-[25%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecentAlerts.map((alert) => (
                  <tr key={alert._id} className="border-b border-slate-100 hover:bg-slate-50 h-16">
                    <td className="w-[25%] py-4 px-4 text-sm font-bold text-slate-900 truncate">
                      {alert.title}
                    </td>
                    <td className="w-[20%] py-4 px-4 text-sm text-slate-600">
                      {remainingTimes[alert._id] || "Loading..."}
                    </td>
                    <td className="w-[15%] py-4 px-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getPriorityColor(
                          alert.priority
                        )}`}
                      >
                        {alert.priority}
                      </span>
                    </td>
                    <td className="w-[25%] py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAlert(alert);
                            setViewModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                          title="View Alert"
                        >
                          <LuEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditAlert(alert)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100"
                          title="Edit Alert"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(alert)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                          title="Delete Alert"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedRecentAlerts.length === 0 && (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <p className="text-sm">No active alerts found</p>
            </div>
          )}

          {/* Pagination for Recent Alerts */}
          {totalRecentPages > 1 && (
            <div className="shrink-0 flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              <button
                onClick={() => setCurrentPageRecent(Math.max(0, currentPageRecent - 1))}
                disabled={currentPageRecent === 0}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <LuChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-600">
                Page {currentPageRecent + 1} of {totalRecentPages}
              </span>
              <button
                onClick={() => setCurrentPageRecent(Math.min(totalRecentPages - 1, currentPageRecent + 1))}
                disabled={currentPageRecent >= totalRecentPages - 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <LuChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {paginatedRecentAlerts.length > 0 ? (
            paginatedRecentAlerts.map((alert) => (
              <div key={alert._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {remainingTimes[alert._id] || "Loading..."}
                    </p>
                  </div>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap ${getPriorityColor(
                      alert.priority
                    )}`}
                  >
                    {alert.priority}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setViewModalOpen(true);
                    }}
                    className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditAlert(alert)}
                    className="flex-1 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(alert)}
                    className="flex-1 rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500">
              No active alerts found
            </div>
          )}

          {/* Mobile Pagination for Recent */}
          {totalRecentPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPageRecent(Math.max(0, currentPageRecent - 1))}
                disabled={currentPageRecent === 0}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <LuChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-600">
                Page {currentPageRecent + 1} of {totalRecentPages}
              </span>
              <button
                onClick={() => setCurrentPageRecent(Math.min(totalRecentPages - 1, currentPageRecent + 1))}
                disabled={currentPageRecent >= totalRecentPages - 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <LuChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expired Alerts Section */}
      {(filteredExpiredAlerts.length > 0 || expiredAlerts.length > 0) && (
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center ml-4 gap-3 min-w-fit">
              <div className="flex flex-col">
                <h2 className="text-lg font-black text-slate-900">EXPIRED ALERTS</h2>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                  {filteredExpiredAlerts.length} ALERTS
                  <span className="h-3 w-3 rounded-full bg-gray-500 flex-shrink-0" />
                </p>
              </div>
            </div>

            {/* Expired Priority Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 sm:justify-end">
              <div className="relative inline-block">
                <select
                  value={expiredPriorityFilter}
                  onChange={(e) => {
                    setExpiredPriorityFilter(e.target.value as "All" | "Low" | "Medium" | "High");
                    setCurrentPageExpired(0);
                  }}
                  className="appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table for Expired */}
          <div className="hidden md:flex flex-col overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Alert Title
                    </th>
                    <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Expired Date
                    </th>
                    <th className="w-[15%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Priority
                    </th>
                    <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="w-[25%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpiredAlerts.map((alert) => (
                    <tr key={alert._id} className="border-b border-slate-100 hover:bg-slate-50 h-16">
                      <td className="w-[20%] py-4 px-4 text-sm font-bold text-slate-900 truncate">
                        {alert.title}
                      </td>
                      <td className="w-[20%] py-4 px-4 text-sm text-slate-600">
                        {alert.expiresAt ? formatExpiredDate(alert.expiresAt) : "N/A"}
                      </td>
                      <td className="w-[15%] py-4 px-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getPriorityColor(
                            alert.priority
                          )}`}
                        >
                          {alert.priority}
                        </span>
                      </td>
                      <td className="w-[20%] py-4 px-4 text-sm text-red-600 font-semibold">
                        Expired
                      </td>
                      <td className="w-[25%] py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAlert(alert);
                              setViewModalOpen(true);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                            title="View Alert"
                          >
                            <LuEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(alert)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                            title="Delete Alert"
                          >
                            <LuTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedExpiredAlerts.length === 0 && expiredAlerts.length > 0 && (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <p className="text-sm">No expired alerts match this filter</p>
              </div>
            )}

            {/* Pagination for Expired */}
            {totalExpiredPages > 1 && (
              <div className="shrink-0 flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setCurrentPageExpired(Math.max(0, currentPageExpired - 1))}
                  disabled={currentPageExpired === 0}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <LuChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-600">
                  Page {currentPageExpired + 1} of {totalExpiredPages}
                </span>
                <button
                  onClick={() => setCurrentPageExpired(Math.min(totalExpiredPages - 1, currentPageExpired + 1))}
                  disabled={currentPageExpired >= totalExpiredPages - 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <LuChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Cards for Expired */}
          <div className="space-y-4 md:hidden">
            {paginatedExpiredAlerts.length > 0 ? (
              paginatedExpiredAlerts.map((alert) => (
                <div key={alert._id} className="rounded-2xl border border-slate-200 p-4 opacity-75">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{alert.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {alert.expiresAt ? formatExpiredDate(alert.expiresAt) : "N/A"}
                      </p>
                    </div>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap ${getPriorityColor(
                        alert.priority
                      )}`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-xs text-red-600 font-semibold mb-3">Expired</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setViewModalOpen(true);
                      }}
                      className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(alert)}
                      className="flex-1 rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500">
                {expiredAlerts.length === 0 ? "No expired alerts" : "No expired alerts match this filter"}
              </div>
            )}

            {/* Mobile Pagination for Expired */}
            {totalExpiredPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPageExpired(Math.max(0, currentPageExpired - 1))}
                  disabled={currentPageExpired === 0}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <LuChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-600">
                  Page {currentPageExpired + 1} of {totalExpiredPages}
                </span>
                <button
                  onClick={() => setCurrentPageExpired(Math.min(totalExpiredPages - 1, currentPageExpired + 1))}
                  disabled={currentPageExpired >= totalExpiredPages - 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <LuChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Floating Action Button */}
      <button
        onClick={() => {
          resetForm();
          setCreateModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-black shadow-lg hover:bg-blue-700 transition sm:rounded-2xl"
      >
        <LuPlus className="h-5 w-5" />
        <span className="hidden sm:inline">Create Alert</span>
      </button>

      {/* Create Alert Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl h-[90vh] rounded-[2rem] bg-white shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white p-6 flex-shrink-0">
              <h2 className="text-lg font-black text-slate-900">
                {editingAlertId ? "Edit Alert" : "Create New Alert"}
              </h2>
              <button
                onClick={() => {
                  setCreateModalOpen(false);
                  resetForm();
                }}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            {/* Form Container - Two Column Layout */}
            <form onSubmit={handleCreateAlert} className="flex-1 overflow-hidden flex flex-col lg:flex-row p-6 gap-6">
              {/* Left Side - Form Fields */}
              <div className="lg:flex-1 overflow-y-auto border border-slate-200 rounded-2xl bg-slate-50/50 p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) {
                        setFormErrors({ ...formErrors, title: "" });
                      }
                    }}
                    placeholder="e.g., Heavy Rain Warning"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as "Low" | "Medium" | "High",
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Expiry Date & Time */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Expiry Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Leave empty if the alert should never expire
                  </p>
                </div>

                {/* All Provinces Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allProvinces"
                    checked={allProvinces}
                    onChange={(e) => {
                      setAllProvinces(e.target.checked);
                      if (e.target.checked) {
                        setSelectedProvinces([]);
                        setSelectedDistricts([]);
                      }
                    }}
                    className="rounded border-slate-200 text-blue-600"
                  />
                  <label htmlFor="allProvinces" className="text-sm font-bold text-slate-700">
                    Send to All Provinces (Island-wide)
                  </label>
                </div>

                {/* Provinces */}
                {!allProvinces && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Select Provinces *
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                      {SRI_LANKAN_PROVINCES.map((province) => (
                        <label
                          key={province}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProvinces.includes(province)}
                            onChange={(e) =>
                              handleProvinceChange(province, e.target.checked)
                            }
                            className="rounded border-slate-200 text-blue-600"
                          />
                          {province}
                        </label>
                      ))}
                    </div>
                    {formErrors.provinces && (
                      <p className="mt-2 text-xs text-red-600">{formErrors.provinces}</p>
                    )}
                  </div>
                )}

                {/* Districts */}
                {!allProvinces && selectedProvinces.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Select Districts (Optional)
                    </label>
                    {getAvailableDistricts().length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                        {getAvailableDistricts().map((district) => (
                          <label
                            key={district}
                            className="flex items-center gap-2 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDistricts.includes(district)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDistricts([...selectedDistricts, district]);
                                } else {
                                  setSelectedDistricts(
                                    selectedDistricts.filter((d) => d !== district)
                                  );
                                }
                              }}
                              className="rounded border-slate-200 text-blue-600"
                            />
                            {district}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Select province first to view districts.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side - Message Box */}
              <div className="w-full lg:w-96 border border-slate-200 rounded-2xl bg-slate-50/50 p-6 flex flex-col overflow-hidden">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (formErrors.message) {
                      setFormErrors({ ...formErrors, message: "" });
                    }
                  }}
                  placeholder="Enter alert message..."
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.message}</p>
                )}
              </div>
            </form>

            {/* Fixed Buttons at Bottom Right */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex-shrink-0 justify-end">
              <button
                type="button"
                onClick={() => {
                  setCreateModalOpen(false);
                  resetForm();
                }}
                className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 min-w-fit"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlert}
                disabled={sending || pendingSendAlert}
                className="rounded-2xl bg-blue-600 px-8 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-fit"
              >
                {sending ? "Sending..." : editingAlertId ? "Update Alert" : "Send Alert"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Confirmation Modal */}
      {sendConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900">Confirm Send</h2>
              <button
                onClick={() => {
                  setSendConfirmOpen(false);
                  setPendingSendAlert(false);
                }}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <p className="text-sm font-bold text-slate-900 mb-2">
                  Are you sure you want to {editingAlertId ? "update" : "send"} this alert?
                </p>
                <p className="text-xs text-slate-600">
                  {editingAlertId
                    ? "The updated alert information will be saved and sent to all configured recipients."
                    : "This alert will be sent to all configured provinces and districts."
                  }
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
                <p className="text-xs font-bold text-blue-900">Title:</p>
                <p className="text-sm text-blue-900 mt-1">{formData.title}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSendConfirmOpen(false);
                    setPendingSendAlert(false);
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSendAlert}
                  disabled={sending}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Processing..." : editingAlertId ? "Update Alert" : "Send Alert"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Alert Modal */}
      {viewModalOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg my-8">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 z-10">
              <h2 className="text-lg font-black text-slate-900">Alert Details</h2>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedAlert(null);
                }}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Alert Title
                </label>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {selectedAlert.title}
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Message
                </label>
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedAlert.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Priority
                  </label>
                  <p className="mt-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getPriorityColor(
                        selectedAlert.priority
                      )}`}
                    >
                      {selectedAlert.priority}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Expiry Status
                  </label>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {remainingTimes[selectedAlert._id] || "Loading..."}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Target Type
                </label>
                <p className="mt-2 text-sm font-bold text-slate-900 capitalize">
                  {selectedAlert.targetType === "all"
                    ? "All Provinces (Island-wide)"
                    : selectedAlert.targetType.charAt(0).toUpperCase() +
                      selectedAlert.targetType.slice(1)}
                </p>
              </div>

              {selectedAlert.targetProvinces.length > 0 && (
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Target Provinces
                  </label>
                  <p className="mt-2 text-sm text-slate-700">
                    {selectedAlert.targetProvinces.join(", ")}
                  </p>
                </div>
              )}

              {selectedAlert.targetDistricts.length > 0 && (
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Target Districts
                  </label>
                  <p className="mt-2 text-sm text-slate-700">
                    {selectedAlert.targetDistricts.join(", ")}
                  </p>
                </div>
              )}

              <div className="sticky bottom-0 pt-4 bg-white border-t border-slate-200 -mx-6 px-6 py-4">
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedAlert(null);
                  }}
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && selectedDeleteAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-lg font-black text-slate-900">Delete Alert</h2>
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setSelectedDeleteAlert(null);
                }}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <LuTrash2 className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    Are you sure you want to delete this alert?
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    "{selectedDeleteAlert.title}" will be permanently deleted. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setSelectedDeleteAlert(null);
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Alert"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
