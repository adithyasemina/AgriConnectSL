"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuPlus,
  LuEye,
  LuX,
  LuLoader,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

type SoilTest = {
  _id: string;
  farmerNumber: string;
  farmerNote?: string;
  submitDate: string;
  status: "pending" | "completed" | "recall";
  approvedOfficerName?: string;
  completedDate?: string;
  phLevel?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  overallStatus?: "Good" | "Moderate" | "Poor";
  recommendation?: string;
  reason?: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 5;

export default function FarmerSoilTestPage() {
  const [pendingSoilTests, setPendingSoilTests] = useState<SoilTest[]>([]);
  const [completedSoilTests, setCompletedSoilTests] = useState<SoilTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [pendingPage, setPendingPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSoilTest, setSelectedSoilTest] = useState<SoilTest | null>(null);

  const [formData, setFormData] = useState({
    farmerNumber: "",
    farmerNote: "",
  });

  useEffect(() => {
    fetchSoilTests();
  }, []);

  const fetchSoilTests = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/soil-tests/farmer/my-tests");
      const { pending = [], completed = [] } = response.data.soilTests || {};
      setPendingSoilTests(pending);
      setCompletedSoilTests(completed);
    } catch (error: any) {
      console.error("Fetch soil tests error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch soil tests");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.farmerNumber.trim()) {
      toast.error("Officer number is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/api/soil-tests/farmer/submit", {
        farmerNumber: formData.farmerNumber.trim(),
        farmerNote: formData.farmerNote.trim(),
      });

      toast.success("Soil test request submitted successfully");
      setPendingSoilTests((prev) => [response.data.soilTest, ...prev]);
      setSubmitModalOpen(false);
      setFormData({ farmerNumber: "", farmerNote: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit soil test request");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const paginatedPending = pendingSoilTests.slice(
    pendingPage * ITEMS_PER_PAGE,
    (pendingPage + 1) * ITEMS_PER_PAGE
  );

  const paginatedCompleted = completedSoilTests.slice(
    completedPage * ITEMS_PER_PAGE,
    (completedPage + 1) * ITEMS_PER_PAGE
  );

  const pendingPages = Math.max(1, Math.ceil(pendingSoilTests.length / ITEMS_PER_PAGE));
  const completedPages = Math.max(1, Math.ceil(completedSoilTests.length / ITEMS_PER_PAGE));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
        <LuLoader className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Loading soil tests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-0">
      {/* Header Card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 sm:text-2xl">Soil Tests</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Submit and track your soil sample requests and results.
          </p>
        </div>

        <button
          onClick={() => setSubmitModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
        >
          <LuPlus className="h-4 w-4" />
          Submit Sample
        </button>
      </div>

      {/* Pending Soil Tests Table */}
      <SoilTestTable
        title="PENDING SOIL TESTS"
        count={pendingSoilTests.length}
        tests={paginatedPending}
        tableType="pending"
        currentPage={pendingPage}
        setCurrentPage={setPendingPage}
        totalPages={pendingPages}
        formatDate={formatDate}
        onDetail={(test) => {
          setSelectedSoilTest(test);
          setDetailModalOpen(true);
        }}
      />

      {/* Completed Soil Tests Table */}
      <SoilTestTable
        title="COMPLETED SOIL TESTS"
        count={completedSoilTests.length}
        tests={paginatedCompleted}
        tableType="completed"
        currentPage={completedPage}
        setCurrentPage={setCompletedPage}
        totalPages={completedPages}
        formatDate={formatDate}
        onDetail={(test) => {
          setSelectedSoilTest(test);
          setDetailModalOpen(true);
        }}
      />

      {/* Submit Sample Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white p-6 flex-shrink-0">
              <h2 className="text-lg font-black text-slate-900">Submit Soil Sample</h2>
              <button
                onClick={() => {
                  setSubmitModalOpen(false);
                  setFormData({ farmerNumber: "", farmerNote: "" });
                }}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitSoilTest} className="flex-1 overflow-y-auto flex flex-col p-6 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Officer Number *
                </label>
                <input
                  type="text"
                  value={formData.farmerNumber}
                  onChange={(e) => setFormData({ ...formData, farmerNumber: e.target.value })}
                  placeholder="Enter the officer number provided to you"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Note / Description (Optional)
                </label>
                <textarea
                  value={formData.farmerNote}
                  onChange={(e) => setFormData({ ...formData, farmerNote: e.target.value })}
                  placeholder="Add any notes about your soil sample..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </form>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex-shrink-0 justify-end">
              <button
                type="button"
                onClick={() => {
                  setSubmitModalOpen(false);
                  setFormData({ farmerNumber: "", farmerNote: "" });
                }}
                disabled={submitting}
                className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 min-w-fit"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSoilTest}
                disabled={submitting}
                className="rounded-2xl bg-blue-600 px-8 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-fit"
              >
                {submitting ? "Submitting..." : "Submit Sample"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="max-h-[90vh] w-full max-w-2xl rounded-[2rem] bg-white shadow-lg overflow-hidden flex flex-col my-8">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 z-10 flex-shrink-0">
              <h2 className="text-lg font-black text-slate-900">
                {selectedSoilTest.status === "pending" ? "Pending" : "Completed"} Test Details
              </h2>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedSoilTest(null);
                }}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Officer Number</label>
                <p className="mt-2 text-sm font-bold text-slate-900">{selectedSoilTest.farmerNumber}</p>
              </div>

              {selectedSoilTest.farmerNote && (
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Your Note</label>
                  <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{selectedSoilTest.farmerNote}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Submitted Date</label>
                  <p className="mt-2 text-sm font-bold text-slate-900">{formatDate(selectedSoilTest.submitDate)}</p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Status</label>
                  <p className="mt-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        selectedSoilTest.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {selectedSoilTest.status === "pending" ? "Pending" : "Completed"}
                    </span>
                  </p>
                </div>
              </div>

              {selectedSoilTest.status === "completed" && (
                <>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Officer</label>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {selectedSoilTest.approvedOfficerName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Completed Date</label>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {formatDate(selectedSoilTest.completedDate)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Overall Status</label>
                      <p className="mt-2">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            selectedSoilTest.overallStatus === "Good"
                              ? "bg-green-100 text-green-700"
                              : selectedSoilTest.overallStatus === "Moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedSoilTest.overallStatus || "N/A"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">pH Level</label>
                      <p className="mt-2 text-sm font-bold text-slate-900">{selectedSoilTest.phLevel || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Nitrogen</label>
                      <p className="mt-2 text-sm font-bold text-slate-900">{selectedSoilTest.nitrogen || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Phosphorus</label>
                      <p className="mt-2 text-sm font-bold text-slate-900">{selectedSoilTest.phosphorus || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Potassium</label>
                      <p className="mt-2 text-sm font-bold text-slate-900">{selectedSoilTest.potassium || "N/A"}</p>
                    </div>
                  </div>

                  {selectedSoilTest.recommendation && (
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Recommendation</label>
                      <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                        {selectedSoilTest.recommendation}
                      </p>
                    </div>
                  )}

                  {selectedSoilTest.reason && (
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">Reason</label>
                      <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{selectedSoilTest.reason}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex-shrink-0">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedSoilTest(null);
                }}
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

// Soil Test Table Component
function SoilTestTable({
  title,
  count,
  tests,
  tableType,
  currentPage,
  setCurrentPage,
  totalPages,
  formatDate,
  onDetail,
}: {
  title: string;
  count: number;
  tests: SoilTest[];
  tableType: "pending" | "completed";
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  formatDate: (date?: string) => string;
  onDetail: (test: SoilTest) => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">{count} tests</p>
        </div>
      </div>

      {/* Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="w-[25%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                {tableType === "pending" ? "Submit Date" : "Completed Date"}
              </th>
              <th className="w-[25%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                Officer Number
              </th>
              <th className="w-[30%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                {tableType === "completed" ? "Result" : "Note"}
              </th>
              <th className="w-[20%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tests.length > 0 ? (
              tests.map((test) => (
                <tr key={test._id} className="border-b border-slate-100 hover:bg-slate-50 h-16">
                  <td className="w-[25%] py-4 px-4 text-sm text-slate-600">
                    {formatDate(tableType === "pending" ? test.submitDate : test.completedDate)}
                  </td>
                  <td className="w-[25%] py-4 px-4 text-sm font-bold text-slate-900">{test.farmerNumber}</td>
                  <td className="w-[30%] py-4 px-4 text-sm text-slate-600 truncate">
                    {tableType === "completed"
                      ? test.overallStatus || "N/A"
                      : (test.farmerNote || "No note").substring(0, 50)}
                  </td>
                  <td className="w-[20%] py-4 px-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onDetail(test)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100"
                        title="View Details"
                      >
                        <LuEye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-slate-500">
                  No {tableType} soil tests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div key={test._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{test.farmerNumber}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(tableType === "pending" ? test.submitDate : test.completedDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDetail(test)}
                className="w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-slate-500 py-8">No {tableType} soil tests</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-slate-200 p-4">
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
  );
}
