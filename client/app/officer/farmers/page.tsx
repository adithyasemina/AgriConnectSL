"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Farmer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "farmer";
  province?: string;
  district?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  blockedReason?: string;
  blockedAt?: string | null;
  createdAt?: string;
};

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  );
}

function EyeIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function BlockIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M12 9v2m0 4v2m0 0H6a2 2 0 01-2-2V9a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-6z"
      />
    </svg>
  );
}

function UnblockIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function InfoIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export default function FarmersPage() {
  const [unblockedFarmers, setUnblockedFarmers] = useState<Farmer[]>([]);
  const [blockedFarmers, setBlockedFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockingFarmer, setBlockingFarmer] = useState<Farmer | null>(null);
  const [blockReason, setBlockReason] = useState("");

  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonModalFarmer, setReasonModalFarmer] = useState<Farmer | null>(
    null
  );

  const [unblockedPage, setUnblockedPage] = useState(0);
  const [blockedPage, setBlockedPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const [unblockedRes, blockedRes] = await Promise.all([
        api.get("/api/officer/farmers/unblocked"),
        api.get("/api/officer/farmers/blocked"),
      ]);

      setUnblockedFarmers(unblockedRes.data.farmers || []);
      setBlockedFarmers(blockedRes.data.farmers || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch farmers"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = (farmer: Farmer) => {
    setBlockingFarmer(farmer);
    setBlockReason("");
    setBlockModalOpen(true);
  };

  const handleBlockSubmit = async () => {
    if (!blockingFarmer || !blockReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      await api.patch(`/api/officer/farmers/${blockingFarmer._id}/block`, {
        reason: blockReason,
      });

      toast.success("Farmer blocked successfully");
      setBlockModalOpen(false);
      fetchFarmers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to block farmer");
    }
  };

  const handleUnblock = async (farmer: Farmer) => {
    try {
      await api.patch(`/api/officer/farmers/${farmer._id}/unblock`);
      toast.success("Farmer unblocked successfully");
      fetchFarmers();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to unblock farmer"
      );
    }
  };

  const filteredUnblocked = unblockedFarmers.filter((farmer) =>
    farmer.firstName.toLowerCase().includes(search.toLowerCase()) ||
    farmer.lastName.toLowerCase().includes(search.toLowerCase()) ||
    farmer.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBlocked = blockedFarmers.filter((farmer) =>
    farmer.firstName.toLowerCase().includes(search.toLowerCase()) ||
    farmer.lastName.toLowerCase().includes(search.toLowerCase()) ||
    farmer.email.toLowerCase().includes(search.toLowerCase())
  );

  const unblockedStart = unblockedPage * ITEMS_PER_PAGE;
  const unblockedEnd = unblockedStart + ITEMS_PER_PAGE;
  const paginatedUnblocked = filteredUnblocked.slice(
    unblockedStart,
    unblockedEnd
  );

  const blockedStart = blockedPage * ITEMS_PER_PAGE;
  const blockedEnd = blockedStart + ITEMS_PER_PAGE;
  const paginatedBlocked = filteredBlocked.slice(blockedStart, blockedEnd);

  const unblockedPages = Math.ceil(filteredUnblocked.length / ITEMS_PER_PAGE);
  const blockedPages = Math.ceil(filteredBlocked.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading farmers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Farmer Management
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Manage active and blocked farmer accounts
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setUnblockedPage(0);
            setBlockedPage(0);
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Unblocked Farmers Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-black text-slate-900">
          Active Farmers ({filteredUnblocked.length})
        </h2>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Farmer Name
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Province
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  District
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Registered Date
                </th>
                <th className="py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUnblocked.map((farmer) => (
                <tr
                  key={farmer._id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">
                    {farmer.firstName} {farmer.lastName}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.email}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.province || "-"}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.district || "-"}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.createdAt
                      ? new Date(farmer.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedFarmer(farmer);
                          setProfileModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                        title="View Profile"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => handleBlockClick(farmer)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                        title="Block Farmer"
                      >
                        <BlockIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {paginatedUnblocked.map((farmer) => (
            <div
              key={farmer._id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">
                    {farmer.firstName} {farmer.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{farmer.email}</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Province</p>
                  <p className="font-bold text-slate-900">
                    {farmer.province || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">District</p>
                  <p className="font-bold text-slate-900">
                    {farmer.district || "-"}
                  </p>
                </div>
              </div>

              <div className="mb-4 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">Registered</p>
                <p className="font-bold text-slate-900">
                  {farmer.createdAt
                    ? new Date(farmer.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedFarmer(farmer);
                    setProfileModalOpen(true);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleBlockClick(farmer)}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>

        {paginatedUnblocked.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            <p className="text-sm">No active farmers found</p>
          </div>
        )}

        {/* Pagination */}
        {unblockedPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">
            <button
              onClick={() =>
                setUnblockedPage((p) => Math.max(0, p - 1))
              }
              disabled={unblockedPage === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeftIcon />
            </button>
            <span className="text-xs font-bold text-slate-600">
              Page {unblockedPage + 1} of {unblockedPages}
            </span>
            <button
              onClick={() =>
                setUnblockedPage((p) =>
                  Math.min(unblockedPages - 1, p + 1)
                )
              }
              disabled={unblockedPage === unblockedPages - 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>

      {/* Blocked Farmers Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-black text-slate-900">
          Blocked Farmers ({filteredBlocked.length})
        </h2>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Farmer Name
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Province
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  District
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Blocked Date
                </th>
                <th className="py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBlocked.map((farmer) => (
                <tr
                  key={farmer._id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">
                    {farmer.firstName} {farmer.lastName}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.email}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.province || "-"}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.district || "-"}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.blockedAt
                      ? new Date(farmer.blockedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedFarmer(farmer);
                          setProfileModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                        title="View Profile"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => {
                          setReasonModalFarmer(farmer);
                          setReasonModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                        title="View Block Reason"
                      >
                        <InfoIcon />
                      </button>
                      <button
                        onClick={() => handleUnblock(farmer)}
                        className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-600 hover:bg-emerald-100"
                        title="Unblock Farmer"
                      >
                        <UnblockIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {paginatedBlocked.map((farmer) => (
            <div
              key={farmer._id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">
                    {farmer.firstName} {farmer.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{farmer.email}</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Province</p>
                  <p className="font-bold text-slate-900">
                    {farmer.province || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">District</p>
                  <p className="font-bold text-slate-900">
                    {farmer.district || "-"}
                  </p>
                </div>
              </div>

              <div className="mb-4 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">Blocked Date</p>
                <p className="font-bold text-slate-900">
                  {farmer.blockedAt
                    ? new Date(farmer.blockedAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedFarmer(farmer);
                    setProfileModalOpen(true);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setReasonModalFarmer(farmer);
                    setReasonModalOpen(true);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Reason
                </button>
                <button
                  onClick={() => handleUnblock(farmer)}
                  className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Unblock
                </button>
              </div>
            </div>
          ))}
        </div>

        {paginatedBlocked.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            <p className="text-sm">No blocked farmers found</p>
          </div>
        )}

        {/* Pagination */}
        {blockedPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">
            <button
              onClick={() => setBlockedPage((p) => Math.max(0, p - 1))}
              disabled={blockedPage === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeftIcon />
            </button>
            <span className="text-xs font-bold text-slate-600">
              Page {blockedPage + 1} of {blockedPages}
            </span>
            <button
              onClick={() =>
                setBlockedPage((p) => Math.min(blockedPages - 1, p + 1))
              }
              disabled={blockedPage === blockedPages - 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {profileModalOpen && selectedFarmer && (
        <ProfileModal
          farmer={selectedFarmer}
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {blockModalOpen && blockingFarmer && (
        <BlockFarmerModal
          farmer={blockingFarmer}
          reason={blockReason}
          onReasonChange={setBlockReason}
          onSubmit={handleBlockSubmit}
          onClose={() => setBlockModalOpen(false)}
        />
      )}

      {reasonModalOpen && reasonModalFarmer && (
        <BlockedReasonModal
          farmer={reasonModalFarmer}
          onClose={() => setReasonModalOpen(false)}
        />
      )}
    </div>
  );
}

function ProfileModal({
  farmer,
  onClose,
}: {
  farmer: Farmer;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Farmer Profile</h2>
          <button
            onClick={onClose}
            className="rounded-lg hover:bg-slate-100"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500">First Name</p>
            <p className="font-bold text-slate-900">{farmer.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last Name</p>
            <p className="font-bold text-slate-900">{farmer.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="font-bold text-slate-900">{farmer.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Province</p>
            <p className="font-bold text-slate-900">{farmer.province || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">District</p>
            <p className="font-bold text-slate-900">{farmer.district || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="font-bold text-slate-900">{farmer.role}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <p className="font-bold text-slate-900">
              {farmer.isActive ? "Active" : "Inactive"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Registered Date</p>
            <p className="font-bold text-slate-900">
              {farmer.createdAt
                ? new Date(farmer.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function BlockFarmerModal({
  farmer,
  reason,
  onReasonChange,
  onSubmit,
  onClose,
}: {
  farmer: Farmer;
  reason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Block Farmer</h2>
          <button
            onClick={onClose}
            className="rounded-lg hover:bg-slate-100"
          >
            <CloseIcon />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          You are about to block{" "}
          <span className="font-bold">
            {farmer.firstName} {farmer.lastName}
          </span>
          . Please provide a reason:
        </p>

        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Enter block reason..."
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!reason.trim()}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50"
          >
            Block Farmer
          </button>
        </div>
      </div>
    </div>
  );
}

function BlockedReasonModal({
  farmer,
  onClose,
}: {
  farmer: Farmer;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Block Reason</h2>
          <button
            onClick={onClose}
            className="rounded-lg hover:bg-slate-100"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500">Farmer Name</p>
            <p className="font-bold text-slate-900">
              {farmer.firstName} {farmer.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Blocked Date</p>
            <p className="font-bold text-slate-900">
              {farmer.blockedAt
                ? new Date(farmer.blockedAt).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-xs text-red-600 font-bold uppercase mb-2">
              Block Reason
            </p>
            <p className="text-sm text-red-900">{farmer.blockedReason}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
