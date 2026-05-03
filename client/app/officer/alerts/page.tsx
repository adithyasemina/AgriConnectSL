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
  LuSearch,
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
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [officerFilter, setOfficerFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const [allProvinces, setAllProvinces] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/officer/alerts");
      setAlerts(res.data.alerts || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch alerts");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
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

    setSending(true);
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

      await api.post("/api/officer/alerts", {
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        targetType,
        targetProvinces,
        targetDistricts,
      });

      toast.success("Alert created successfully");
      setCreateModalOpen(false);
      resetForm();
      fetchAlerts();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to create alert";
      toast.error(errorMsg);
      console.error("Create alert error:", error);
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", message: "", priority: "Medium" });
    setFormErrors({});
    setAllProvinces(false);
    setSelectedProvinces([]);
    setSelectedDistricts([]);
  };

  const getUniqueOfficers = () => {
    const officers = new Set<string>();
    alerts.forEach((alert) => {
      const name = typeof alert.createdBy === "string"
        ? alert.createdBy
        : `${alert.createdBy.firstName} ${alert.createdBy.lastName}`;
      officers.add(name);
    });
    return Array.from(officers).sort();
  };

  const filteredAlerts = alerts.filter((alert) => {
    const searchLower = searchQuery.toLowerCase();
    const createdByName =
      typeof alert.createdBy === "string"
        ? alert.createdBy
        : `${alert.createdBy.firstName} ${alert.createdBy.lastName}`;

    const matchesSearch = alert.title.toLowerCase().includes(searchLower) ||
      createdByName.toLowerCase().includes(searchLower);

    const matchesOfficer = officerFilter === "" || createdByName === officerFilter;

    return matchesSearch && matchesOfficer;
  });

  const paginatedAlerts = filteredAlerts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE));

  const getCreatedByName = (alert: Alert) => {
    if (typeof alert.createdBy === "string") return alert.createdBy;
    return `${alert.createdBy.firstName} ${alert.createdBy.lastName}`;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "bg-red-100 text-red-700";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-2">
      {/* Alerts Table/Cards */}
      <div className="flex h-[540px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Section: Title */}
          <h2 className="text-lg font-black text-slate-900 flex-shrink-0">
            Recent Alerts ({filteredAlerts.length})
          </h2>

          {/* Right Section: Filters and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 sm:justify-end">
            <select
              value={officerFilter}
              onChange={(e) => {
                setOfficerFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Officers</option>
              {getUniqueOfficers().map((officer) => (
                <option key={officer} value={officer}>
                  {officer}
                </option>
              ))}
            </select>

            {/* Search Bar */}
            <div className="w-full sm:w-64 relative">
              <LuSearch className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts by title or created by..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

          {/* Desktop Table */}
          <div className="hidden md:flex flex-col flex-1 overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="w-[25%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Alert Title
                    </th>
                    <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Created By
                    </th>
                    <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Time
                    </th>
                    <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Priority
                    </th>
                    <th className="w-[15%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAlerts.map((alert) => (
                    <tr key={alert._id} className="border-b border-slate-100 hover:bg-slate-50 h-16">
                      <td className="w-[25%] py-4 px-4 text-sm font-bold text-slate-900 truncate">
                        {alert.title}
                      </td>
                      <td className="w-[20%] py-4 px-4 text-sm text-slate-600 truncate">
                        {getCreatedByName(alert)}
                      </td>
                      <td className="w-[20%] py-4 px-4 text-sm text-slate-600 truncate">
                        {formatDate(alert.createdAt)}
                      </td>
                      <td className="w-[20%] py-4 px-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getPriorityColor(
                            alert.priority
                          )}`}
                        >
                          {alert.priority}
                        </span>
                      </td>
                      <td className="w-[15%] py-4 px-4">
                        <div className="flex justify-center">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {paginatedAlerts.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <p className="text-sm">No alerts found</p>
            </div>
          )}

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {paginatedAlerts.length > 0 ? (
              paginatedAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        {alert.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {getCreatedByName(alert)}
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

                  <div className="mb-3 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-500">
                      {formatDate(alert.createdAt)}
                    </p>
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
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500">
                No alerts found
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shrink-0 flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <LuChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <LuChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
      </div>

      {/* Floating Action Button */}
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
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">Create New Alert</h2>
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

            <form onSubmit={handleCreateAlert} className="space-y-4 p-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  <p className="text-xs text-slate-500 mb-3">
                    Select specific districts only if you do not want to send to the whole
                    selected province.
                  </p>
                  {getAvailableDistricts().length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

              {!allProvinces && selectedProvinces.length === 0 && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-600">
                    Select province first to view districts.
                  </p>
                </div>
              )}

              {/* Message */}
              <div>
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
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Alert"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Alert Modal */}
      {viewModalOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
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
                    Target Type
                  </label>
                  <p className="mt-2 text-sm font-bold text-slate-900 capitalize">
                    {selectedAlert.targetType === "all"
                      ? "All Provinces (Island-wide)"
                      : selectedAlert.targetType.charAt(0).toUpperCase() +
                        selectedAlert.targetType.slice(1)}
                  </p>
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Created By
                  </label>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {getCreatedByName(selectedAlert)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Created Date
                  </label>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {formatDate(selectedAlert.createdAt)}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedAlert(null);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
