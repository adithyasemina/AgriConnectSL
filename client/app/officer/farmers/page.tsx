"use client";

import { useState } from "react";

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

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-4 w-4" }: { className?: string }) {
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

const sampleFarmers = [
  {
    id: 1,
    name: "Nimal Perera",
    email: "nimal@example.com",
    province: "Central",
    district: "Kandy",
    registeredDate: "2024-01-15",
    status: "Pending",
  },
  {
    id: 2,
    name: "Saman Kumara",
    email: "saman@example.com",
    province: "Western",
    district: "Colombo",
    registeredDate: "2024-01-18",
    status: "Pending",
  },
  {
    id: 3,
    name: "Kasun Silva",
    email: "kasun@example.com",
    province: "Southern",
    district: "Galle",
    registeredDate: "2024-01-20",
    status: "Approved",
  },
  {
    id: 4,
    name: "Amal Fernando",
    email: "amal@example.com",
    province: "North Central",
    district: "Anuradhapura",
    registeredDate: "2024-01-22",
    status: "Pending",
  },
  {
    id: 5,
    name: "Roshan Jayasekara",
    email: "roshan@example.com",
    province: "Eastern",
    district: "Batticaloa",
    registeredDate: "2024-01-25",
    status: "Pending",
  },
];

export default function FarmersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved">(
    "All"
  );
  const [farmers, setFarmers] = useState(sampleFarmers);

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(search.toLowerCase()) ||
      farmer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || farmer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number) => {
    setFarmers(
      farmers.map((f) => (f.id === id ? { ...f, status: "Approved" } : f))
    );
  };

  const handleReject = (id: number) => {
    setFarmers(farmers.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Farmer Registration
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Manage newly registered farmers
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | "Pending" | "Approved")
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
        </div>

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
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-4 text-sm font-bold text-slate-900">
                    {farmer.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.email}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.province}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {farmer.district}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {new Date(farmer.registeredDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        farmer.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {farmer.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {farmer.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(farmer.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(farmer.id)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                          >
                            <CloseIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {filteredFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">{farmer.name}</p>
                  <p className="text-xs text-slate-500">{farmer.email}</p>
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${
                    farmer.status === "Approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {farmer.status}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Province</p>
                  <p className="font-bold text-slate-900">{farmer.province}</p>
                </div>
                <div>
                  <p className="text-slate-500">District</p>
                  <p className="font-bold text-slate-900">{farmer.district}</p>
                </div>
              </div>

              <div className="mb-4 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">Registered</p>
                <p className="font-bold text-slate-900">
                  {new Date(farmer.registeredDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  View
                </button>
                {farmer.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(farmer.id)}
                      className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(farmer.id)}
                      className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">No farmers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
