"use client";

import { api } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  LuCalendarDays,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuCopy,
  LuEye,
  LuInfo,
  LuLoaderCircle,
  LuPencil,
  LuSearch,
  LuTicket,
  LuX,
} from "react-icons/lu";

type SoilTest = {
  _id: string;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  farmerNote?: string;
  farmerNumber?: string;
  officerNumber?: string;
  soilTestNumber?: string;
  requestNumber?: string;
  submitDate: string;
  submitTime?: string;
  status: "pending" | "completed" | "recall";
  approvedOfficerId?: string;
  approvedOfficerName?: string;
  completedDate?: string;
  completedTime?: string;
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

type SoilFormData = {
  phLevel: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  overallStatus: "Good" | "Moderate" | "Poor";
  recommendation: string;
  reason: string;
};

const emptySoilForm: SoilFormData = {
  phLevel: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  overallStatus: "Good",
  recommendation: "",
  reason: "",
};

export default function SoilTestPage() {
  const [pendingSoilTests, setPendingSoilTests] = useState<SoilTest[]>([]);
  const [completedSoilTests, setCompletedSoilTests] = useState<SoilTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendingNumber, setSendingNumber] = useState(false); // New state for API handling

  const [pendingSearch, setPendingSearch] = useState("");
  const [completedSearch, setCompletedSearch] = useState("");
  const [pendingPage, setPendingPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);

  const [selectedSoilTest, setSelectedSoilTest] = useState<SoilTest | null>(null);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issuedNumber, setIssuedNumber] = useState("");

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [completeFormData, setCompleteFormData] = useState<SoilFormData>(emptySoilForm);
  const [editFormData, setEditFormData] = useState<SoilFormData>(emptySoilForm);

  useEffect(() => {
    fetchSoilTests();
  }, []);

  const fetchSoilTests = async () => {
    setLoading(true);
    try {
      const [pendingRes, completedRes] = await Promise.all([
        api.get("/api/soil-tests/pending"),
        api.get("/api/soil-tests/completed"),
      ]);

      setPendingSoilTests(pendingRes.data.soilTests || []);
      setCompletedSoilTests(completedRes.data.soilTests || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch soil tests");
    } finally {
      setLoading(false);
    }
  };

  const getFarmerNumber = (test: SoilTest) => {
    return (
      test.farmerNumber ||
      test.officerNumber ||
      test.soilTestNumber ||
      test.requestNumber ||
      "-"
    );
  };

  const filterTests = (tests: SoilTest[], searchQuery: string) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tests;

    return tests.filter(
      (test) =>
        test.farmerName.toLowerCase().includes(query) ||
        test.farmerEmail.toLowerCase().includes(query) ||
        test.approvedOfficerName?.toLowerCase().includes(query) ||
        getFarmerNumber(test).toLowerCase().includes(query)
    );
  };

  const getPaginatedTests = (tests: SoilTest[], page: number) => {
    return tests.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
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

  const filteredPending = useMemo(
    () => filterTests(pendingSoilTests, pendingSearch),
    [pendingSoilTests, pendingSearch]
  );

  const filteredCompleted = useMemo(
    () => filterTests(completedSoilTests, completedSearch),
    [completedSoilTests, completedSearch]
  );

  const paginatedPending = getPaginatedTests(filteredPending, pendingPage);
  const paginatedCompleted = getPaginatedTests(filteredCompleted, completedPage);

  const pendingPages = Math.max(1, Math.ceil(filteredPending.length / ITEMS_PER_PAGE));
  const completedPages = Math.max(1, Math.ceil(filteredCompleted.length / ITEMS_PER_PAGE));

  const generateOfficerNumber = () => {
    const number = `SOIL-${Math.floor(100000 + Math.random() * 900000)}`;
    setIssuedNumber(number);
  };

  const copyIssuedNumber = async () => {
    if (!issuedNumber.trim()) {
      toast.error("Enter or generate officer number first");
      return;
    }
    try {
      await navigator.clipboard.writeText(issuedNumber);
      toast.success("Officer number copied");
    } catch {
      toast.error("Failed to copy number");
    }
  };

  const openIssueModal = () => {
    setIssuedNumber("");
    setIssueModalOpen(true);
  };

  const handleIssueNumber = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issuedNumber.trim()) {
      toast.error("Officer number is required");
      return;
    }

    setSendingNumber(true);

    try {
      const response = await api.post("/api/soil-tests/issue-number", {
        number: issuedNumber.trim(),
      });

      toast.success(response.data.message || `Officer number issued: ${issuedNumber}`);
      setIssueModalOpen(false);
      setIssuedNumber("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to issue officer number");
    } finally {
      setSendingNumber(false);
    }
  };

  const handleNoteClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setNoteModalOpen(true);
  };

  const handleCompleteClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setCompleteFormData(emptySoilForm);
    setCompleteModalOpen(true);
  };

  const handleDetailClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setDetailModalOpen(true);
  };

  const handleEditClick = (soilTest: SoilTest) => {
    setSelectedSoilTest(soilTest);
    setEditFormData({
      phLevel: soilTest.phLevel?.toString() || "",
      nitrogen: soilTest.nitrogen?.toString() || "",
      phosphorus: soilTest.phosphorus?.toString() || "",
      potassium: soilTest.potassium?.toString() || "",
      overallStatus: soilTest.overallStatus || "Good",
      recommendation: soilTest.recommendation || "",
      reason: soilTest.reason || "",
    });
    setEditModalOpen(true);
  };

  const validateSoilForm = (formData: SoilFormData) => {
    if (
      !formData.phLevel ||
      !formData.nitrogen ||
      !formData.phosphorus ||
      !formData.potassium ||
      !formData.overallStatus
    ) {
      toast.error("All soil test fields are required");
      return false;
    }
    return true;
  };

  const handleCompleteSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSoilTest || !validateSoilForm(completeFormData)) return;

    setSending(true);
    try {
      const response = await api.put(`/api/soil-tests/${selectedSoilTest._id}/complete`, {
        phLevel: parseFloat(completeFormData.phLevel),
        nitrogen: parseFloat(completeFormData.nitrogen),
        phosphorus: parseFloat(completeFormData.phosphorus),
        potassium: parseFloat(completeFormData.potassium),
        overallStatus: completeFormData.overallStatus,
        recommendation: completeFormData.recommendation,
        reason: completeFormData.reason,
      });

      toast.success("Soil test report sent successfully");
      setPendingSoilTests((prev) => prev.filter((test) => test._id !== selectedSoilTest._id));
      setCompletedSoilTests((prev) => [response.data.soilTest, ...prev]);
      setCompleteModalOpen(false);
      setSelectedSoilTest(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete soil test");
    } finally {
      setSending(false);
    }
  };

  const handleUpdateCompletedSoilTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSoilTest || !validateSoilForm(editFormData)) return;

    setSending(true);
    try {
      const response = await api.patch(
        `/api/soil-tests/${selectedSoilTest._id}/update-completed`,
        {
          phLevel: parseFloat(editFormData.phLevel),
          nitrogen: parseFloat(editFormData.nitrogen),
          phosphorus: parseFloat(editFormData.phosphorus),
          potassium: parseFloat(editFormData.potassium),
          overallStatus: editFormData.overallStatus,
          recommendation: editFormData.recommendation,
          reason: editFormData.reason,
        }
      );

      toast.success("Soil test updated successfully");
      setCompletedSoilTests((prev) =>
        prev.map((test) => (test._id === selectedSoilTest._id ? response.data.soilTest : test))
      );
      setEditModalOpen(false);
      setSelectedSoilTest(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update soil test");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <LuLoaderCircle className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-lg font-medium text-slate-500">
            Loading soil tests data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-0">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 sm:text-2xl">Soil Tests</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage farmer soil sample requests and completed soil reports.
          </p>
        </div>

        <button
          onClick={openIssueModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
        >
          <LuTicket className="h-4 w-4" />
          Issue Officer Number
        </button>
      </div>

      <SoilTestTable
        title="PENDING SOIL TESTS"
        count={filteredPending.length}
        tests={paginatedPending}
        tableType="pending"
        searchQuery={pendingSearch}
        setSearchQuery={setPendingSearch}
        currentPage={pendingPage}
        setCurrentPage={setPendingPage}
        totalPages={pendingPages}
        formatDate={formatDate}
        getFarmerNumber={getFarmerNumber}
        onNote={handleNoteClick}
        onComplete={handleCompleteClick}
      />

      <SoilTestTable
        title="COMPLETED SOIL TESTS"
        count={filteredCompleted.length}
        tests={paginatedCompleted}
        tableType="completed"
        searchQuery={completedSearch}
        setSearchQuery={setCompletedSearch}
        currentPage={completedPage}
        setCurrentPage={setCompletedPage}
        totalPages={completedPages}
        formatDate={formatDate}
        getFarmerNumber={getFarmerNumber}
        onDetail={handleDetailClick}
        onEdit={handleEditClick}
      />

      {issueModalOpen && (
        <Modal title="Issue Officer Number" onClose={() => setIssueModalOpen(false)} maxWidth="max-w-lg">
          <form onSubmit={handleIssueNumber} className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Officer Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={issuedNumber}
                  onChange={(e) => setIssuedNumber(e.target.value)}
                  placeholder="Enter or generate number"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={copyIssuedNumber}
                  className="rounded-2xl border border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50"
                  title="Copy"
                >
                  <LuCopy className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-700">
              Give this number to the farmer. The farmer can enter this number when submitting the soil test request.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={sendingNumber}
                onClick={generateOfficerNumber}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Generate
              </button>
              <button
                type="submit"
                disabled={sendingNumber}
                className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingNumber ? "Issuing..." : "Issue Number"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {noteModalOpen && selectedSoilTest && (
        <Modal title="Farmer Note" onClose={() => setNoteModalOpen(false)}>
          <div className="space-y-5 p-6">
            <InfoBlock label="Farmer Name" value={selectedSoilTest.farmerName} />
            <InfoBlock label="Farmer Number" value={getFarmerNumber(selectedSoilTest)} />
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                Note
              </label>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="whitespace-pre-wrap text-sm font-medium text-slate-700">
                  {selectedSoilTest.farmerNote || "No note provided"}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {completeModalOpen && selectedSoilTest && (
        <Modal title="Send Soil Test Report" onClose={() => setCompleteModalOpen(false)}>
          <SoilReportForm
            farmerName={selectedSoilTest.farmerName}
            formData={completeFormData}
            setFormData={setCompleteFormData}
            onSubmit={handleCompleteSoilTest}
            sending={sending}
            submitText="Send Soil Report"
          />
        </Modal>
      )}

      {detailModalOpen && selectedSoilTest && (
        <Modal title="Completed Soil Test Details" onClose={() => setDetailModalOpen(false)}>
          <SoilDetailContent
            soilTest={selectedSoilTest}
            formatDate={formatDate}
            farmerNumber={getFarmerNumber(selectedSoilTest)}
          />
        </Modal>
      )}

      {editModalOpen && selectedSoilTest && (
        <Modal title="Edit Soil Test Report" onClose={() => setEditModalOpen(false)}>
          <SoilReportForm
            farmerName={selectedSoilTest.farmerName}
            formData={editFormData}
            setFormData={setEditFormData}
            onSubmit={handleUpdateCompletedSoilTest}
            sending={sending}
            submitText="Update Report"
          />
        </Modal>
      )}
    </div>
  );
}

function SoilTestTable({
  title,
  count,
  tests,
  tableType,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  totalPages,
  formatDate,
  getFarmerNumber,
  onNote,
  onComplete,
  onDetail,
  onEdit,
}: {
  title: string;
  count: number;
  tests: SoilTest[];
  tableType: "pending" | "completed";
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalPages: number;
  formatDate: (value?: string) => string;
  getFarmerNumber: (test: SoilTest) => string;
  onNote?: (test: SoilTest) => void;
  onComplete?: (test: SoilTest) => void;
  onDetail?: (test: SoilTest) => void;
  onEdit?: (test: SoilTest) => void;
}) {
  return (
    <div className="flex min-h-[560px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-fit items-center gap-3 sm:ml-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            {tableType === "pending" ? <LuClock className="h-5 w-5" /> : <LuCheck className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 sm:text-lg">{title}</h2>
            <p className="text-sm font-medium text-slate-500">{count} TESTS</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <LuSearch className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${tableType} tests...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="hidden flex-1 overflow-hidden md:flex md:flex-col">
        <div className="overflow-x-auto overflow-y-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-slate-200">
                {tableType === "pending" ? (
                  <>
                    <TableHead className="w-[30%]">Farmer Name</TableHead>
                    <TableHead className="w-[22%]">Submit Date</TableHead>
                    <TableHead className="w-[18%]">Farmer Number</TableHead>
                    <TableHead className="w-[30%] text-center">Action</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="w-[28%]">Farmer Name</TableHead>
                    <TableHead className="w-[28%]">Farmer Number</TableHead>
                    <TableHead className="w-[20%]">Date</TableHead>
                    <TableHead className="w-[24%] text-center">Action</TableHead>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {tests.length > 0 ? (
                tests.map((test) => (
                  <tr key={test._id} className="h-16 border-b border-slate-100 hover:bg-slate-50">
                    {tableType === "pending" ? (
                      <>
                        <TableCell bold>{test.farmerName}</TableCell>
                        <TableCell>{formatDate(test.submitDate)}</TableCell>
                        <TableCell>{getFarmerNumber(test)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <IconButton onClick={() => onNote?.(test)} title="Farmer Note" variant="slate">
                              <LuInfo className="h-4 w-4" />
                            </IconButton>
                            <IconButton onClick={() => onComplete?.(test)} title="Complete" variant="green">
                              <LuCheck className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell bold>{test.farmerName}</TableCell>
                        <TableCell>{getFarmerNumber(test)}</TableCell>
                        <TableCell>{formatDate(test.completedDate)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <IconButton onClick={() => onDetail?.(test)} title="View Details" variant="slate">
                              <LuEye className="h-4 w-4" />
                            </IconButton>
                            <IconButton onClick={() => onEdit?.(test)} title="Edit" variant="blue">
                              <LuPencil className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="h-40 text-center text-sm font-medium text-slate-500">
                    No soil tests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div key={test._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-900">{test.farmerName}</p>
                  <p className="mt-1 truncate text-xs font-medium text-slate-500">{test.farmerEmail}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  {tableType === "pending" ? "Pending" : "Completed"}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500 xs:grid-cols-2">
                {tableType === "pending" ? (
                  <>
                    <span className="flex items-center gap-2">
                      <LuCalendarDays className="h-4 w-4" /> {formatDate(test.submitDate)}
                    </span>
                    <span className="truncate">Number: {getFarmerNumber(test)}</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      <LuCalendarDays className="h-4 w-4" /> {formatDate(test.completedDate)}
                    </span>
                    <span className="truncate">Number: {getFarmerNumber(test)}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {tableType === "pending" ? (
                  <>
                    <button
                      onClick={() => onNote?.(test)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
                    >
                      Farmer Note
                    </button>
                    <button
                      onClick={() => onComplete?.(test)}
                      className="flex-1 rounded-xl border border-green-200 bg-green-50 py-2.5 text-xs font-black text-green-700 hover:bg-green-100"
                    >
                      Complete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onDetail?.(test)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onEdit?.(test)}
                      className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-100"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-sm font-medium text-slate-500">No soil tests found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LuChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-black text-slate-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LuChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function SoilReportForm({
  farmerName,
  formData,
  setFormData,
  onSubmit,
  sending,
  submitText,
}: {
  farmerName: string;
  formData: SoilFormData;
  setFormData: (value: SoilFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  sending: boolean;
  submitText: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-6">
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">Farmer Name</label>
        <input
          type="text"
          value={farmerName}
          disabled
          className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          label="Soil pH Level *"
          value={formData.phLevel}
          onChange={(value) => setFormData({ ...formData, phLevel: value })}
          placeholder="e.g., 6.5"
        />
        <FormInput
          label="Nitrogen (mg/kg) *"
          value={formData.nitrogen}
          onChange={(value) => setFormData({ ...formData, nitrogen: value })}
          placeholder="e.g., 150"
        />
        <FormInput
          label="Phosphorus (mg/kg) *"
          value={formData.phosphorus}
          onChange={(value) => setFormData({ ...formData, phosphorus: value })}
          placeholder="e.g., 50"
        />
        <FormInput
          label="Potassium (mg/kg) *"
          value={formData.potassium}
          onChange={(value) => setFormData({ ...formData, potassium: value })}
          placeholder="e.g., 200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">Overall Status *</label>
        <select
          value={formData.overallStatus}
          onChange={(e) =>
            setFormData({
              ...formData,
              overallStatus: e.target.value as "Good" | "Moderate" | "Poor",
            })
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="Good">Good</option>
          <option value="Moderate">Moderate</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <FormTextarea
        label="Recommendation"
        value={formData.recommendation}
        onChange={(value) => setFormData({ ...formData, recommendation: value })}
        placeholder="Enter recommendations for the farmer..."
        rows={4}
      />

      <FormTextarea
        label="Reason/Notes"
        value={formData.reason}
        onChange={(value) => setFormData({ ...formData, reason: value })}
        placeholder="Enter any additional notes..."
        rows={3}
      />

      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={sending}
          className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}

function SoilDetailContent({
  soilTest,
  formatDate,
  farmerNumber,
}: {
  soilTest: SoilTest;
  formatDate: (value?: string) => string;
  farmerNumber: string;
}) {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoBlock label="Farmer Name" value={soilTest.farmerName} />
        <InfoBlock label="Farmer Number" value={farmerNumber} />
        <InfoBlock label="Date" value={formatDate(soilTest.completedDate)} />
        <InfoBlock label="Time" value={soilTest.completedTime || "-"} />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="mb-4 text-sm font-black text-slate-900">Soil Test Results</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoBlock label="Soil pH Level" value={soilTest.phLevel?.toString() || "-"} />
          <InfoBlock
            label="Nitrogen"
            value={soilTest.nitrogen ? `${soilTest.nitrogen} mg/kg` : "-"}
          />
          <InfoBlock
            label="Phosphorus"
            value={soilTest.phosphorus ? `${soilTest.phosphorus} mg/kg` : "-"}
          />
          <InfoBlock
            label="Potassium"
            value={soilTest.potassium ? `${soilTest.potassium} mg/kg` : "-"}
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500">
            Overall Status
          </label>
          <p className="mt-2">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
                soilTest.overallStatus === "Good"
                  ? "bg-green-100 text-green-700"
                  : soilTest.overallStatus === "Moderate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {soilTest.overallStatus || "-"}
            </span>
          </p>
        </div>
      </div>

      <TextInfo label="Recommendation" value={soilTest.recommendation || "-"} />
      <TextInfo label="Reason/Notes" value={soilTest.reason || "-"} />
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-lg ${maxWidth}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-6">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
            <LuX className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TableHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500 ${className}`}>
      {children}
    </th>
  );
}

// Fixed minor syntax error in className templates for TableCell
function TableCell({
  children,
  bold = false,
}: {
  children: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <td className={`truncate px-4 py-4 text-sm ${bold ? "font-black text-slate-900" : "font-medium text-slate-600"}`}>
      {children}
    </td>
  );
}

function IconButton({
  children,
  onClick,
  title,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  variant: "slate" | "green" | "blue";
}) {
  const styles = {
    slate: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    green: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
    blue: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-xs font-black ${styles[variant]}`}
      title={title}
    >
      {children}
    </button>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</label>
      <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

// Fixed standard typography syntax
function TextInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</label>
      <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}