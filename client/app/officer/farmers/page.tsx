"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuSearch,
  LuEye,
  LuBan,
  LuZap,
  LuInfo,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuLoader,
} from "react-icons/lu";

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

const allDistricts = Object.values(locations).flat().sort();

export default function FarmersPage() {
  const [unblockedFarmers, setUnblockedFarmers] = useState<Farmer[]>([]);
  const [blockedFarmers, setBlockedFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSearch, setActiveSearch] = useState("");
  const [blockedSearch, setBlockedSearch] = useState("");

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockingFarmer, setBlockingFarmer] = useState<Farmer | null>(null);
  const [blockReason, setBlockReason] = useState("");

  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonModalFarmer, setReasonModalFarmer] = useState<Farmer | null>(
    null
  );

  const [unblockConfirmOpen, setUnblockConfirmOpen] = useState(false);
  const [unblockingFarmer, setUnblockingFarmer] = useState<Farmer | null>(null);

  const [unblockedPage, setUnblockedPage] = useState(0);
  const [blockedPage, setBlockedPage] = useState(0);
  const [activeProvinceFilter, setActiveProvinceFilter] = useState("");
  const [activeDistrictFilter, setActiveDistrictFilter] = useState("");
  const [blockedProvinceFilter, setBlockedProvinceFilter] = useState("");
  const [blockedDistrictFilter, setBlockedDistrictFilter] = useState("");
  const ITEMS_PER_PAGE = 5;

  const provinces = Object.keys(locations) as Array<keyof typeof locations>;

  const getAvailableDistricts = (province: string): string[] => {
    if (province === "") return allDistricts;
    const provinceKey = province as keyof typeof locations;
    return [...(locations[provinceKey] || [])];
  };

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

  const handleUnblockClick = (farmer: Farmer) => {
    setUnblockingFarmer(farmer);
    setUnblockConfirmOpen(true);
  };

  const handleUnblockConfirm = async () => {
    if (!unblockingFarmer) return;

    try {
      await api.patch(`/api/officer/farmers/${unblockingFarmer._id}/unblock`);
      toast.success("Farmer unblocked successfully");
      setUnblockConfirmOpen(false);
      fetchFarmers();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to unblock farmer"
      );
    }
  };

  const filteredUnblocked = unblockedFarmers.filter((farmer) => {
    const matchesSearch =
      farmer.firstName.toLowerCase().includes(activeSearch.toLowerCase()) ||
      farmer.lastName.toLowerCase().includes(activeSearch.toLowerCase()) ||
      farmer.email.toLowerCase().includes(activeSearch.toLowerCase());

    const matchesProvince = activeProvinceFilter === "" || farmer.province === activeProvinceFilter;
    const matchesDistrict = activeDistrictFilter === "" || farmer.district === activeDistrictFilter;

    return matchesSearch && matchesProvince && matchesDistrict;
  });

  const filteredBlocked = blockedFarmers.filter((farmer) => {
    const matchesSearch =
      farmer.firstName.toLowerCase().includes(blockedSearch.toLowerCase()) ||
      farmer.lastName.toLowerCase().includes(blockedSearch.toLowerCase()) ||
      farmer.email.toLowerCase().includes(blockedSearch.toLowerCase());

    const matchesProvince = blockedProvinceFilter === "" || farmer.province === blockedProvinceFilter;
    const matchesDistrict = blockedDistrictFilter === "" || farmer.district === blockedDistrictFilter;

    return matchesSearch && matchesProvince && matchesDistrict;
  });

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
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
        <LuLoader className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Loading farmers data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-0">
      {/* Unblocked Farmers Section */}
      <div className="flex h-[560px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center ml-4 gap-3 min-w-fit">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-slate-900">
                ACTIVE FARMERS
              </h2>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                {filteredUnblocked.length} FARMERS
                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 sm:justify-end">
            <div className="relative inline-block">
              <select
                value={activeProvinceFilter}
                onChange={(e) => {
                  const newProvince = e.target.value;
                  setActiveProvinceFilter(newProvince);
                  const availableDistricts = getAvailableDistricts(newProvince);
                  if (activeDistrictFilter && !availableDistricts.includes(activeDistrictFilter)) {
                    setActiveDistrictFilter("");
                  }
                  setUnblockedPage(0);
                }}
                className="appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Provinces</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative inline-block">
              <select
                value={activeDistrictFilter}
                onChange={(e) => {
                  setActiveDistrictFilter(e.target.value);
                  setUnblockedPage(0);
                }}
                className="appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Districts</option>
                {getAvailableDistricts(activeProvinceFilter).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="w-full sm:w-64 relative">
              <LuSearch className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search active farmers..."
                value={activeSearch}
                onChange={(e) => {
                  setActiveSearch(e.target.value);
                  setUnblockedPage(0);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Farmer Name
                  </th>
                  <th className="w-[24%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Email
                  </th>
                  <th className="w-[14%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Province
                  </th>
                  <th className="w-[14%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    District
                  </th>
                  <th className="w-[16%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Registered Date
                  </th>
                  <th className="w-[12%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUnblocked.map((farmer) => (
                  <tr
                    key={farmer._id}
                    className="border-b border-slate-100 hover:bg-slate-50 h-16"
                  >
                    <td className="w-[18%] py-4 px-4 text-sm font-bold text-slate-900 truncate">
                      {farmer.firstName} {farmer.lastName}
                    </td>
                    <td className="w-[28%] py-4 px-4 text-sm text-slate-600 truncate">
                      {farmer.email}
                    </td>
                    <td className="w-[14%] py-4 px-4 text-sm text-slate-600 truncate">
                      {farmer.province || "-"}
                    </td>
                    <td className="w-[14%] py-4 px-4 text-sm text-slate-600 truncate">
                      {farmer.district || "-"}
                    </td>
                    <td className="w-[16%] py-4 px-4 text-sm text-slate-600 truncate">
                      {farmer.createdAt
                        ? new Date(farmer.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="w-[10%] py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedFarmer(farmer);
                            setProfileModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                          title="View Profile"
                        >
                          <LuEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleBlockClick(farmer)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                          title="Block Farmer"
                        >
                          <LuBan className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 md:hidden">
          {paginatedUnblocked.map((farmer) => (
            <div key={farmer._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {farmer.firstName} {farmer.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{farmer.email}</p>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Province</p>
                  <p className="font-bold text-slate-900">{farmer.province || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">District</p>
                  <p className="font-bold text-slate-900">{farmer.district || "-"}</p>
                </div>
              </div>
              <div className="mb-4 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">Registered</p>
                <p className="font-bold text-slate-900">
                  {farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : "-"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedFarmer(farmer); setProfileModalOpen(true); }}
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
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <p className="text-sm">No active farmers found</p>
          </div>
        )}

        {unblockedPages > 0 && (
          <div className="shrink-0 flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setUnblockedPage((p) => Math.max(0, p - 1))}
              disabled={unblockedPage === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <LuChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-600">
              Pages {unblockedPage + 1} of {unblockedPages || 1}
            </span>
            <button
              onClick={() => setUnblockedPage((p) => Math.min(Math.max(0, unblockedPages - 1), p + 1))}
              disabled={unblockedPage >= unblockedPages - 1 || unblockedPages === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <LuChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Blocked Farmers Section */}
      <div className="flex h-[560px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 ml-4 min-w-fit">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-slate-900">BLOCKED FARMERS</h2>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                {filteredBlocked.length} FARMERS
                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 sm:justify-end">
            <div className="relative inline-block">
              <select
                value={blockedProvinceFilter}
                onChange={(e) => {
                  const newProvince = e.target.value;
                  setBlockedProvinceFilter(newProvince);
                  const availableDistricts = getAvailableDistricts(newProvince);
                  if (blockedDistrictFilter && !availableDistricts.includes(blockedDistrictFilter)) {
                    setBlockedDistrictFilter("");
                  }
                  setBlockedPage(0);
                }}
                className="appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Provinces</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative inline-block">
              <select
                value={blockedDistrictFilter}
                onChange={(e) => { setBlockedDistrictFilter(e.target.value); setBlockedPage(0); }}
                className="appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Districts</option>
                {getAvailableDistricts(blockedProvinceFilter).map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="w-full sm:w-64 relative">
              <LuSearch className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search blocked farmers..."
                value={blockedSearch}
                onChange={(e) => { setBlockedSearch(e.target.value); setBlockedPage(0); }}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-[18%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Farmer Name</th>
                  <th className="w-[22%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Email</th>
                  <th className="w-[14%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Province</th>
                  <th className="w-[14%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">District</th>
                  <th className="w-[16%] py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Blocked Date</th>
                  <th className="w-[16%] py-4 px-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBlocked.map((farmer) => (
                  <tr key={farmer._id} className="border-b border-slate-100 hover:bg-slate-50 h-16">
                    <td className="w-[18%] py-4 px-4 text-sm font-bold text-slate-900 truncate">{farmer.firstName} {farmer.lastName}</td>
                    <td className="w-[28%] py-4 px-4 text-sm text-slate-600 truncate">{farmer.email}</td>
                    <td className="w-[14%] py-4 px-4 text-sm text-slate-600 truncate">{farmer.province || "-"}</td>
                    <td className="w-[14%] py-4 px-4 text-sm text-slate-600 truncate">{farmer.district || "-"}</td>
                    <td className="w-[16%] py-4 px-4 text-sm text-slate-600 truncate">
                      {farmer.blockedAt ? new Date(farmer.blockedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="w-[10%] py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setSelectedFarmer(farmer); setProfileModalOpen(true); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50" title="View Profile"><LuEye className="h-4 w-4" /></button>
                        <button onClick={() => { setReasonModalFarmer(farmer); setReasonModalOpen(true); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50" title="View Block Reason"><LuInfo className="h-4 w-4" /></button>
                        <button onClick={() => handleUnblockClick(farmer)} className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100" title="Unblock Farmer"><LuZap className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 md:hidden">
          {paginatedBlocked.map((farmer) => (
            <div key={farmer._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{farmer.firstName} {farmer.lastName}</p>
                  <p className="text-xs text-slate-500 truncate">{farmer.email}</p>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div className="min-w-0"><p className="text-slate-500">Province</p><p className="font-bold text-slate-900 truncate">{farmer.province || "-"}</p></div>
                <div className="min-w-0"><p className="text-slate-500">District</p><p className="font-bold text-slate-900 truncate">{farmer.district || "-"}</p></div>
              </div>
              <div className="mb-4 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">Blocked Date</p>
                <p className="font-bold text-slate-900">{farmer.blockedAt ? new Date(farmer.blockedAt).toLocaleDateString() : "-"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSelectedFarmer(farmer); setProfileModalOpen(true); }} className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Profile</button>
                <button onClick={() => { setReasonModalFarmer(farmer); setReasonModalOpen(true); }} className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Reason</button>
                <button onClick={() => handleUnblockClick(farmer)} className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700">Unblock</button>
              </div>
            </div>
          ))}
        </div>

        {paginatedBlocked.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <p className="text-sm">No blocked farmers found</p>
          </div>
        )}

        {blockedPages > 0 && (
          <div className="shrink-0 flex items-center justify-center gap-2 pt-6">
            <button onClick={() => setBlockedPage((p) => Math.max(0, p - 1))} disabled={blockedPage === 0} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><LuChevronLeft className="h-4 w-4" /></button>
            <span className="text-xs font-bold text-slate-600">Page {blockedPage + 1} of {blockedPages || 1}</span>
            <button onClick={() => setBlockedPage((p) => Math.min(Math.max(0, blockedPages - 1), p + 1))} disabled={blockedPage >= blockedPages - 1 || blockedPages === 0} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><LuChevronRight className="h-4 w-4" /></button>
          </div>
        )}
      </div>

      {/* Modals */}
      {profileModalOpen && selectedFarmer && <ProfileModal farmer={selectedFarmer} onClose={() => setProfileModalOpen(false)} />}
      {blockModalOpen && blockingFarmer && <BlockFarmerModal farmer={blockingFarmer} reason={blockReason} onReasonChange={setBlockReason} onSubmit={handleBlockSubmit} onClose={() => setBlockModalOpen(false)} />}
      {reasonModalOpen && reasonModalFarmer && <BlockedReasonModal farmer={reasonModalFarmer} onClose={() => setReasonModalOpen(false)} />}
      {unblockConfirmOpen && unblockingFarmer && <UnblockConfirmModal farmer={unblockingFarmer} onConfirm={handleUnblockConfirm} onCancel={() => setUnblockConfirmOpen(false)} />}
    </div>
  );
}

// Sub components (Modals) ekama file eke thiyanna
function ProfileModal({ farmer, onClose }: { farmer: Farmer; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Farmer Profile</h2>
          <button onClick={onClose} className="rounded-lg hover:bg-slate-100 p-1"><LuX className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <div><p className="text-xs text-slate-500">First Name</p><p className="font-bold text-slate-900">{farmer.firstName}</p></div>
          <div><p className="text-xs text-slate-500">Last Name</p><p className="font-bold text-slate-900">{farmer.lastName}</p></div>
          <div><p className="text-xs text-slate-500">Email</p><p className="font-bold text-slate-900">{farmer.email}</p></div>
          <div><p className="text-xs text-slate-500">Province</p><p className="font-bold text-slate-900">{farmer.province || "-"}</p></div>
          <div><p className="text-xs text-slate-500">District</p><p className="font-bold text-slate-900">{farmer.district || "-"}</p></div>
          <div><p className="text-xs text-slate-500">Status</p><p className="font-bold text-slate-900">{farmer.isActive ? "Active" : "Inactive"}</p></div>
          <div><p className="text-xs text-slate-500">Registered Date</p><p className="font-bold text-slate-900">{farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : "-"}</p></div>
        </div>
        <button onClick={onClose} className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">Close</button>
      </div>
    </div>
  );
}

function BlockFarmerModal({ farmer, reason, onReasonChange, onSubmit, onClose }: { farmer: Farmer; reason: string; onReasonChange: (reason: string) => void; onSubmit: () => void; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Block Farmer</h2>
          <button onClick={onClose} className="rounded-lg hover:bg-slate-100 p-1"><LuX className="h-5 w-5" /></button>
        </div>
        <p className="mb-4 text-sm text-slate-600">You are about to block <span className="font-bold">{farmer.firstName} {farmer.lastName}</span>. Please provide a reason:</p>
        <textarea value={reason} onChange={(e) => onReasonChange(e.target.value)} placeholder="Enter block reason..." rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none" />
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={onSubmit} disabled={!reason.trim()} className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50">Block Farmer</button>
        </div>
      </div>
    </div>
  );
}

function BlockedReasonModal({ farmer, onClose }: { farmer: Farmer; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Block Reason</h2>
          <button onClick={onClose} className="rounded-lg hover:bg-slate-100 p-1"><LuX className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <div><p className="text-xs text-slate-500">Farmer Name</p><p className="font-bold text-slate-900">{farmer.firstName} {farmer.lastName}</p></div>
          <div><p className="text-xs text-slate-500">Blocked Date</p><p className="font-bold text-slate-900">{farmer.blockedAt ? new Date(farmer.blockedAt).toLocaleDateString() : "-"}</p></div>
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-xs text-red-600 font-bold uppercase mb-2">Block Reason</p>
            <p className="text-sm text-red-900">{farmer.blockedReason}</p>
          </div>
        </div>
        <button onClick={onClose} className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">Close</button>
      </div>
    </div>
  );
}

function UnblockConfirmModal({ farmer, onConfirm, onCancel }: { farmer: Farmer; onConfirm: () => void; onCancel: () => void; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Confirm Unblock</h2>
          <button onClick={onCancel} className="rounded-lg hover:bg-slate-100 p-1"><LuX className="h-5 w-5" /></button>
        </div>
        <p className="mb-4 text-sm text-slate-600">Are you sure you want to unblock <span className="font-bold">{farmer.firstName} {farmer.lastName}</span>?</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">Unblock Farmer</button>
        </div>
      </div>
    </div>
  );
}