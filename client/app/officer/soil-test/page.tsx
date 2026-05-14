"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuSearch,
  LuEye,
  LuCheck,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuRotateCcw,
  LuInfo,
  LuPencil,
} from "react-icons/lu";

type SoilTest = {
  _id: string;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  farmerNote?: string;
  submitDate: string;
  submitTime?: string;
  status: "pending" | "completed" | "recall";
  approvedOfficerId?: string;
  approvedOfficerName?: string;
  recallOfficerId?: string;
  recallOfficerName?: string;
  completedDate?: string;
  completedTime?: string;
  recallDate?: string;
  recallTime?: string;
  phLevel?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  overallStatus?: "Good" | "Moderate" | "Poor";
  recommendation?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
};

const ITEMS_PER_PAGE = 5;

export default function SoilTestPage() {
  const [pendingSoilTests, setPendingSoilTests] = useState<SoilTest[]>([]);
  const [completedSoilTests, setCompletedSoilTests] = useState<SoilTest[]>([]);
  const [recalledSoilTests, setRecalledSoilTests] = useState<SoilTest[]>([]);
  const [loading, setLoading] = useState(true);

  const [pendingSearch, setPendingSearch] = useState("");
  const [completedSearch, setCompletedSearch] = useState("");
  const [recalledSearch, setRecalledSearch] = useState("");

  const [pendingPage, setPendingPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);
  const [recalledPage, setRecalledPage] = useState(0);

  // Modals
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [recallModalOpen, setRecallModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editCompletedModalOpen, setEditCompletedModalOpen] = useState(false);
  const [editRecalledModalOpen, setEditRecalledModalOpen] = useState(false);
  const [rePendingConfirmOpen, setRePendingConfirmOpen] = useState(false);
  const [rePendingType, setRePendingType] = useState<"completed" | "recall">("completed");
  const [detailType, setDetailType] = useState<"completed" | "recall">("completed");

  const [selectedSoilTest, setSelectedSoilTest] = useState<SoilTest | null>(null);

  const [completeFormData, setCompleteFormData] = useState({
    phLevel: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    overallStatus: "Good",
    recommendation: "",
    reason: "",
  });

  const [recallFormData, setRecallFormData] = useState({
    reason: "",
  });

  const [editCompletedFormData, setEditCompletedFormData] = useState({
    phLevel: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    overallStatus: "Good",
    recommendation: "",
    reason: "",
  });

  const [editRecalledFormData, setEditRecalledFormData] = useState({
    reason: "",
  });

  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSoilTests();
  }, []);

  const fetchSoilTests = async () => {
    setLoading(true);
    try {
      const [pendingRes, completedRes, recallRes] = await Promise.all([
        api.get("/api/soil-tests/pending"),
        api.get("/api/soil-tests/completed"),
        api.get("/api/soil-tests/recall"),
      ]);

      setPendingSoilTests(pendingRes.data.soilTests || []);
      setCompletedSoilTests(completedRes.data.soilTests || []);
      setRecalledSoilTests(recallRes.data.soilTests || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch soil tests");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setCompleteFormData({
      phLevel: "",
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      overallStatus: "Good",
      recommendation: "",
      reason: "",
    });
    setCompleteModalOpen(true);
  };

  const handleRecallClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setRecallFormData({ reason: "" });
    setRecallModalOpen(true);
  };

  const handleNoteClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setNoteModalOpen(true);
  };

  const handleDetailClick = (soilTest: SoilTest, type: "completed" | "recall") => {
    setSelectedSoilTest(soilTest);
    setDetailType(type);
    setDetailModalOpen(true);
  };

  const handleEditCompletedClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setEditCompletedFormData({
      phLevel: soilTest.phLevel?.toString() || "",
      nitrogen: soilTest.nitrogen?.toString() || "",
      phosphorus: soilTest.phosphorus?.toString() || "",
      potassium: soilTest.potassium?.toString() || "",
      overallStatus: soilTest.overallStatus || "Good",
      recommendation: soilTest.recommendation || "",
      reason: soilTest.reason || "",
    });
    setEditCompletedModalOpen(true);
  };

  const handleEditRecalledClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setEditRecalledFormData({
      reason: soilTest.reason || "",
    });
    setEditRecalledModalOpen(true);
  };

  const handleUpdateCompletedSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !editCompletedFormData.phLevel ||
      !editCompletedFormData.nitrogen ||
      !editCompletedFormData.phosphorus ||
      !editCompletedFormData.potassium
    ) {
      toast.error("All soil test fields are required");
      return;
    }

    setSending(true);
    try {
      const response = await api.patch(
        `/api/soil-tests/${selectedSoilTest?._id}/update-completed`,
        {
          phLevel: parseFloat(editCompletedFormData.phLevel),
          nitrogen: parseFloat(editCompletedFormData.nitrogen),
          phosphorus: parseFloat(editCompletedFormData.phosphorus),
          potassium: parseFloat(editCompletedFormData.potassium),
          overallStatus: editCompletedFormData.overallStatus,
          recommendation: editCompletedFormData.recommendation,
          reason: editCompletedFormData.reason,
        }
      );

      toast.success("Completed soil test updated successfully");

      // Update local state
      setCompletedSoilTests(
        completedSoilTests.map((test) =>
          test._id === selectedSoilTest?._id ? response.data.soilTest : test
        )
      );

      setEditCompletedModalOpen(false);
      setSelectedSoilTest(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update completed soil test";
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateRecalledSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editRecalledFormData.reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    setSending(true);
    try {
      const response = await api.patch(
        `/api/soil-tests/${selectedSoilTest?._id}/update-recall`,
        {
          reason: editRecalledFormData.reason,
        }
      );

      toast.success("Recalled soil test updated successfully");

      // Update local state
      setRecalledSoilTests(
        recalledSoilTests.map((test) =>
          test._id === selectedSoilTest?._id ? response.data.soilTest : test
        )
      );

      setEditRecalledModalOpen(false);
      setSelectedSoilTest(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update recalled soil test";
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleRePendingClick = (soilTest: SoilTest, type: "completed" | "recall") => {
    setSelectedSoilTest(soilTest);
    setRePendingType(type);
    setRePendingConfirmOpen(true);
  };

  const handleConfirmRePending = async () => {
    setSending(true);
    try {
      const response = await api.put(`/api/soil-tests/${selectedSoilTest?._id}/re-pending`);

      toast.success("Soil test moved to pending successfully");

      // Update local state
      if (rePendingType === "completed") {
        setCompletedSoilTests(
          completedSoilTests.filter((test) => test._id !== selectedSoilTest?._id)
        );
      } else {
        setRecalledSoilTests(
          recalledSoilTests.filter((test) => test._id !== selectedSoilTest?._id)
        );
      }
      setPendingSoilTests([response.data.soilTest, ...pendingSoilTests]);

      setRePendingConfirmOpen(false);
      setSelectedSoilTest(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to move soil test to pending";
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleCompleteSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !completeFormData.phLevel ||
      !completeFormData.nitrogen ||
      !completeFormData.phosphorus ||
      !completeFormData.potassium
    ) {
      toast.error("All soil test fields are required");
      return;
    }

    setSending(true);
    try {
      const response = await api.put(`/api/soil-tests/${selectedSoilTest?._id}/complete`, {
        phLevel: parseFloat(completeFormData.phLevel),
        nitrogen: parseFloat(completeFormData.nitrogen),
        phosphorus: parseFloat(completeFormData.phosphorus),
        potassium: parseFloat(completeFormData.potassium),
        overallStatus: completeFormData.overallStatus,
        recommendation: completeFormData.recommendation,
        reason: completeFormData.reason,
      });

      toast.success("Soil test completed successfully");

      // Update local state
      setPendingSoilTests(
        pendingSoilTests.filter((test) => test._id !== selectedSoilTest?._id)
      );
      setCompletedSoilTests([response.data.soilTest, ...completedSoilTests]);

      setCompleteModalOpen(false);
      setSelectedSoilTest(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to complete soil test";
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleRecallSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recallFormData.reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    setSending(true);
    try {
      const response = await api.put(`/api/soil-tests/${selectedSoilTest?._id}/recall`, {
        reason: recallFormData.reason,
      });

      toast.success("Soil test recalled successfully");

      // Update local state
      setPendingSoilTests(
        pendingSoilTests.filter((test) => test._id !== selectedSoilTest?._id)
      );
      setRecalledSoilTests([response.data.soilTest, ...recalledSoilTests]);

      setRecallModalOpen(false);
      setSelectedSoilTest(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to recall soil test";
      toast.error(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const filterTests = (tests: SoilTest[], searchQuery: string) => {
    return tests.filter((test) =>
      test.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.farmerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getPaginatedTests = (tests: SoilTest[], page: number) => {
    return tests.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Pending tests filtering
  const filteredPending = filterTests(pendingSoilTests, pendingSearch);
  const paginatedPending = getPaginatedTests(filteredPending, pendingPage);
  const pendingPages = Math.max(1, Math.ceil(filteredPending.length / ITEMS_PER_PAGE));

  // Completed tests filtering
  const filteredCompleted = filterTests(completedSoilTests, completedSearch);
  const paginatedCompleted = getPaginatedTests(filteredCompleted, completedPage);
  const completedPages = Math.max(1, Math.ceil(filteredCompleted.length / ITEMS_PER_PAGE));

  // Recalled tests filtering
  const filteredRecalled = filterTests(recalledSoilTests, recalledSearch);
  const paginatedRecalled = getPaginatedTests(filteredRecalled, recalledPage);
  const recalledPages = Math.max(1, Math.ceil(filteredRecalled.length / ITEMS_PER_PAGE));

  const SoilTestTable = ({
    title,
    count,
    tests,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    onComplete,
    onRecall,
    onNote,
    onDetail,
    onEditCompleted,
    onEditRecalled,
    onRePending,
    tableType,
  }: {
    title: string;
    count: number;
    tests: SoilTest[];
    searchQuery: string;
    setSearchQuery: (s: string) => void;
    currentPage: number;
    setCurrentPage: (p: number) => void;
    totalPages: number;
    onComplete?: (test: SoilTest) => void;
    onRecall?: (test: SoilTest) => void;
    onNote?: (test: SoilTest) => void;
    onDetail?: (test: SoilTest, type: "completed" | "recall") => void;
    onEditCompleted?: (test: SoilTest) => void;
    onEditRecalled?: (test: SoilTest) => void;
    onRePending?: (test: SoilTest, type: "completed" | "recall") => void;
    tableType: "pending" | "completed" | "recall";
  }) => (
    <div className="flex h-[560px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Section: Title and Count */}
        <div className="flex items-center ml-4 gap-3 min-w-fit">
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-slate-900">{title}</h2>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
              {count} TESTS
              {/* <span className="h-3 w-3 rounded-full bg-orange-500 animate-pulse flex-shrink-0" /> */}
            </p>
          </div>
        </div>

        {/* Right Section: Search */}
        <div className="w-full sm:w-64 relative">
          <LuSearch className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${tableType} tests...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-slate-200">
                {tableType === "pending" && (
                  <>
                    <th className="w-[25%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Farmer Name
                    </th>
                    <th className="w-[20%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Submit Date
                    </th>
                    <th className="w-[15%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Submit Time
                    </th>
                    <th className="w-[40%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </>
                )}
                {tableType === "completed" && (
                  <>
                    <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Farmer Name
                    </th>
                    <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Approved Officer
                    </th>
                    <th className="w-[12%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                    <th className="w-[12%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Time
                    </th>
                    <th className="w-[40%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </>
                )}
                {tableType === "recall" && (
                  <>
                    <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Farmer Name
                    </th>
                    <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Re Call Officer
                    </th>
                    <th className="w-[12%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                    <th className="w-[12%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Time
                    </th>
                    <th className="w-[40%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {tests.length > 0 ? (
                tests.map((test) => (
                  <tr key={test._id} className="border-b border-slate-100 hover:bg-slate-50 h-16">
                    {tableType === "pending" && (
                      <>
                        <td className="w-[25%] py-4 px-4 text-sm font-bold text-slate-900 truncate">
                          {test.farmerName}
                        </td>
                        <td className="w-[20%] py-4 px-4 text-sm text-slate-600 truncate">
                          {formatDate(test.submitDate)}
                        </td>
                        <td className="w-[15%] py-4 px-4 text-sm text-slate-600 truncate">
                          {test.submitTime || "-"}
                        </td>
                        <td className="w-[40%] py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => onComplete?.(test)}
                              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-600 hover:bg-green-100"
                              title="Complete"
                            >
                              <LuCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onRecall?.(test)}
                              className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-100"
                              title="Re Call"
                            >
                              <LuRotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onNote?.(test)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                              title="Farmer Note"
                            >
                              <LuInfo className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                    {tableType === "completed" && (
                      <>
                        <td className="w-[18%] py-4 px-4 text-sm font-bold text-slate-900 truncate">
                          {test.farmerName}
                        </td>
                        <td className="w-[18%] py-4 px-4 text-sm text-slate-600 truncate">
                          {test.approvedOfficerName || "-"}
                        </td>
                        <td className="w-[12%] py-4 px-4 text-sm text-slate-600 truncate">
                          {test.completedDate ? formatDate(test.completedDate) : "-"}
                        </td>
                        <td className="w-[12%] py-4 px-4 text-sm text-slate-600 truncate">
                          {test.completedTime || "-"}
                        </td>
                        <td className="w-[40%] py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => onDetail?.(test, "completed")}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                              title="View"
                            >
                              <LuEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onEditCompleted?.(test)}
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                              title="Edit"
                            >
                              <LuPencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onRePending?.(test, "completed")}
                              className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-600 hover:bg-purple-100"
                              title="Re Pending"
                            >
                              <LuRotateCcw className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                    {tableType === "recall" && (
                      <>
                        <td className="w-[18%] py-4 px-4 text-sm font-bold text-slate-900 truncate">
                          {test.farmerName}
                        </td>
                        <td className="w-[18%] py-4 px-4 text-sm text-slate-600 truncate">
                          {test.recallOfficerName || "-"}
                        </td>
                        <td className="w-[12%] py-4 px-4 text-sm text-slate-600 truncate">
                          {test.recallDate ? formatDate(test.recallDate) : "-"}
                        </td>
                        <td className="w-[12%] py-4 px-4 text-sm text-slate-600 truncate">
                          {test.recallTime || "-"}
                        </td>
                        <td className="w-[40%] py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => onDetail?.(test, "recall")}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                              title="View"
                            >
                              <LuEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onEditRecalled?.(test)}
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                              title="Edit"
                            >
                              <LuPencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onRePending?.(test, "recall")}
                              className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-600 hover:bg-purple-100"
                              title="Re Pending"
                            >
                              <LuRotateCcw className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableType === "pending" ? 3 : 5} className="h-16">
                    <div className="flex items-center justify-center text-slate-500">
                      <p className="text-sm">No soil tests found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {tests.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <p className="text-sm">No soil tests found</p>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div key={test._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 truncate">{test.farmerName}</p>
                  <p className="text-xs text-slate-500 mt-1">{test.farmerEmail}</p>
                </div>
              </div>

              <div className="mb-3 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">
                  {tableType === "pending" && `Submitted: ${formatDate(test.submitDate)}`}
                  {tableType === "completed" && `Completed: ${test.completedDate ? formatDate(test.completedDate) : "-"}`}
                  {tableType === "recall" && `Recalled: ${test.recallDate ? formatDate(test.recallDate) : "-"}`}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {tableType === "pending" && (
                  <>
                    <button
                      onClick={() => onComplete?.(test)}
                      className="flex-1 rounded-lg border border-green-200 bg-green-50 py-2 text-xs font-bold text-green-600 hover:bg-green-100"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => onRecall?.(test)}
                      className="flex-1 rounded-lg border border-orange-200 bg-orange-50 py-2 text-xs font-bold text-orange-600 hover:bg-orange-100"
                    >
                      Re Call
                    </button>
                    <button
                      onClick={() => onNote?.(test)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Note
                    </button>
                  </>
                )}
                {tableType === "completed" && (
                  <button
                    onClick={() => onDetail?.(test, "completed")}
                    className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    View Details
                  </button>
                )}
                {tableType === "recall" && (
                  <button
                    onClick={() => onDetail?.(test, "recall")}
                    className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500">
            <p className="text-sm">No soil tests found</p>
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
  );

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96 text-slate-500">
          Loading soil tests...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-0">
      {/* Pending Soil Tests */}
      <SoilTestTable
        title="PENDING SOIL TESTS"
        count={filteredPending.length}
        tests={paginatedPending}
        searchQuery={pendingSearch}
        setSearchQuery={setPendingSearch}
        currentPage={pendingPage}
        setCurrentPage={setPendingPage}
        totalPages={pendingPages}
        onComplete={handleCompleteClick}
        onRecall={handleRecallClick}
        onNote={handleNoteClick}
        tableType="pending"
      />

      {/* Completed Soil Tests */}
      <SoilTestTable
        title="COMPLETED SOIL TESTS"
        count={filteredCompleted.length}
        tests={paginatedCompleted}
        searchQuery={completedSearch}
        setSearchQuery={setCompletedSearch}
        currentPage={completedPage}
        setCurrentPage={setCompletedPage}
        totalPages={completedPages}
        onDetail={handleDetailClick}
        onEditCompleted={handleEditCompletedClick}
        onRePending={handleRePendingClick}
        tableType="completed"
      />

      {/* Re Called Soil Tests */}
      <SoilTestTable
        title="RE CALLED SOIL TESTS"
        count={filteredRecalled.length}
        tests={paginatedRecalled}
        searchQuery={recalledSearch}
        setSearchQuery={setRecalledSearch}
        currentPage={recalledPage}
        setCurrentPage={setRecalledPage}
        totalPages={recalledPages}
        onDetail={handleDetailClick}
        onEditRecalled={handleEditRecalledClick}
        onRePending={handleRePendingClick}
        tableType="recall"
      />

      {/* Complete Soil Test Modal */}
      {completeModalOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">Complete Soil Test</h2>
              <button
                onClick={() => setCompleteModalOpen(false)}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCompleteSoilTest} className="space-y-4 p-6">
              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={selectedSoilTest.farmerName}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none cursor-not-allowed"
                />
              </div>

              {/* Soil pH Level */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Soil pH Level *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={completeFormData.phLevel}
                  onChange={(e) =>
                    setCompleteFormData({ ...completeFormData, phLevel: e.target.value })
                  }
                  placeholder="e.g., 6.5"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Nitrogen */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nitrogen (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={completeFormData.nitrogen}
                  onChange={(e) =>
                    setCompleteFormData({ ...completeFormData, nitrogen: e.target.value })
                  }
                  placeholder="e.g., 150"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Phosphorus */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phosphorus (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={completeFormData.phosphorus}
                  onChange={(e) =>
                    setCompleteFormData({ ...completeFormData, phosphorus: e.target.value })
                  }
                  placeholder="e.g., 50"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Potassium */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Potassium (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={completeFormData.potassium}
                  onChange={(e) =>
                    setCompleteFormData({ ...completeFormData, potassium: e.target.value })
                  }
                  placeholder="e.g., 200"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Overall Status */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Overall Status *
                </label>
                <select
                  value={completeFormData.overallStatus}
                  onChange={(e) =>
                    setCompleteFormData({
                      ...completeFormData,
                      overallStatus: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Good">Good</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Recommendation */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Recommendation
                </label>
                <textarea
                  value={completeFormData.recommendation}
                  onChange={(e) =>
                    setCompleteFormData({
                      ...completeFormData,
                      recommendation: e.target.value,
                    })
                  }
                  placeholder="Enter recommendations for the farmer..."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Reason/Notes
                </label>
                <textarea
                  value={completeFormData.reason}
                  onChange={(e) =>
                    setCompleteFormData({ ...completeFormData, reason: e.target.value })
                  }
                  placeholder="Enter any additional notes..."
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Soil Report"}
                </button>
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recall Soil Test Modal */}
      {recallModalOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">Re Call Soil Test</h2>
              <button
                onClick={() => setRecallModalOpen(false)}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleRecallSoilTest} className="space-y-4 p-6">
              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={selectedSoilTest.farmerName}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none cursor-not-allowed"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={recallFormData.reason}
                  onChange={(e) =>
                    setRecallFormData({ reason: e.target.value })
                  }
                  placeholder="Enter reason for recalling this soil test..."
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Re Call Notification"}
                </button>
                <button
                  type="button"
                  onClick={() => setRecallModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Farmer Note Modal */}
      {noteModalOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">Farmer Note</h2>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Farmer Note
                </label>
                <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedSoilTest.farmerNote || "No note provided"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setNoteModalOpen(false)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">
                {detailType === "completed" ? "Completed Soil Test Details" : "Re Call Soil Test Details"}
              </h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Farmer Name
                  </label>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {selectedSoilTest.farmerName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {detailType === "completed" ? "Approved Officer" : "Re Call Officer"}
                  </label>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {detailType === "completed"
                      ? selectedSoilTest.approvedOfficerName || "-"
                      : selectedSoilTest.recallOfficerName || "-"}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Date
                  </label>
                  <p className="mt-2 text-sm text-slate-700">
                    {detailType === "completed"
                      ? selectedSoilTest.completedDate
                        ? formatDate(selectedSoilTest.completedDate)
                        : "-"
                      : selectedSoilTest.recallDate
                      ? formatDate(selectedSoilTest.recallDate)
                      : "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Time
                  </label>
                  <p className="mt-2 text-sm text-slate-700">
                    {detailType === "completed"
                      ? selectedSoilTest.completedTime || "-"
                      : selectedSoilTest.recallTime || "-"}
                  </p>
                </div>
              </div>

              {/* Soil Test Results (only for completed) */}
              {detailType === "completed" && (
                <>
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">
                      Soil Test Results
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Soil pH Level
                        </label>
                        <p className="mt-2 text-sm font-bold text-slate-900">
                          {selectedSoilTest.phLevel || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Nitrogen
                        </label>
                        <p className="mt-2 text-sm font-bold text-slate-900">
                          {selectedSoilTest.nitrogen ? `${selectedSoilTest.nitrogen} mg/kg` : "-"}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Phosphorus
                        </label>
                        <p className="mt-2 text-sm font-bold text-slate-900">
                          {selectedSoilTest.phosphorus ? `${selectedSoilTest.phosphorus} mg/kg` : "-"}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Potassium
                        </label>
                        <p className="mt-2 text-sm font-bold text-slate-900">
                          {selectedSoilTest.potassium ? `${selectedSoilTest.potassium} mg/kg` : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Overall Status
                      </label>
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
                          {selectedSoilTest.overallStatus || "-"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Recommendation
                    </label>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedSoilTest.recommendation || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Notes
                    </label>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedSoilTest.reason || "-"}
                    </p>
                  </div>
                </>
              )}

              {/* Reason (only for recall) */}
              {detailType === "recall" && (
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Reason
                  </label>
                  <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedSoilTest.reason || "-"}
                  </p>
                </div>
              )}

              <button
                onClick={() => setDetailModalOpen(false)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Completed Soil Test Modal */}
      {editCompletedModalOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">Edit Completed Soil Test</h2>
              <button
                onClick={() => setEditCompletedModalOpen(false)}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateCompletedSoilTest} className="space-y-4 p-6">
              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={selectedSoilTest.farmerName}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none cursor-not-allowed"
                />
              </div>

              {/* Soil pH Level */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Soil pH Level *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editCompletedFormData.phLevel}
                  onChange={(e) =>
                    setEditCompletedFormData({
                      ...editCompletedFormData,
                      phLevel: e.target.value,
                    })
                  }
                  placeholder="e.g., 6.5"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Nitrogen */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nitrogen (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editCompletedFormData.nitrogen}
                  onChange={(e) =>
                    setEditCompletedFormData({
                      ...editCompletedFormData,
                      nitrogen: e.target.value,
                    })
                  }
                  placeholder="e.g., 150"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Phosphorus */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phosphorus (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editCompletedFormData.phosphorus}
                  onChange={(e) =>
                    setEditCompletedFormData({
                      ...editCompletedFormData,
                      phosphorus: e.target.value,
                    })
                  }
                  placeholder="e.g., 50"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Potassium */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Potassium (mg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editCompletedFormData.potassium}
                  onChange={(e) =>
                    setEditCompletedFormData({
                      ...editCompletedFormData,
                      potassium: e.target.value,
                    })
                  }
                  placeholder="e.g., 200"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Overall Status */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Overall Status *
                </label>
                <select
                  value={editCompletedFormData.overallStatus}
                  onChange={(e) =>
                    setEditCompletedFormData({
                      ...editCompletedFormData,
                      overallStatus: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Good">Good</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Recommendation */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Recommendation
                </label>
                <textarea
                  value={editCompletedFormData.recommendation}
                  onChange={(e) =>
                    setEditCompletedFormData({
                      ...editCompletedFormData,
                      recommendation: e.target.value,
                    })
                  }
                  placeholder="Enter recommendations..."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editCompletedFormData.reason}
                  onChange={(e) =>
                    setEditCompletedFormData({
                      ...editCompletedFormData,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Enter any additional notes..."
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditCompletedModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Recalled Soil Test Modal */}
      {editRecalledModalOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">Edit Re Called Soil Test</h2>
              <button
                onClick={() => setEditRecalledModalOpen(false)}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecalledSoilTest} className="space-y-4 p-6">
              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={selectedSoilTest.farmerName}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none cursor-not-allowed"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={editRecalledFormData.reason}
                  onChange={(e) =>
                    setEditRecalledFormData({ reason: e.target.value })
                  }
                  placeholder="Enter reason for recalling..."
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditRecalledModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Re Pending Confirmation Modal */}
      {rePendingConfirmOpen && selectedSoilTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">Confirm Re Pending</h2>
              <button
                onClick={() => setRePendingConfirmOpen(false)}
                className="rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Farmer Name
                </label>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {selectedSoilTest.farmerName}
                </p>
              </div>

              <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
                <p className="text-sm text-orange-700">
                  Are you sure you want to move this soil test back to pending status? This action will reset its {rePendingType === "completed" ? "completion" : "recall"} status.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleConfirmRePending}
                  disabled={sending}
                  className="flex-1 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-black text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Processing..." : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => setRePendingConfirmOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
