"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

function FarmersIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-4a4 4 0 10-8 0m8 0a4 4 0 11-8 0"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      className="h-5 w-5"
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

function ReportIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h9l5 5v9a2 2 0 01-2 2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 13h8M8 17h5" />
    </svg>
  );
}

type Farmer = {
  _id: string;
  name?: string;
  fullName?: string;
  email?: string;
  status?: string;
  createdAt?: string;
};

type DashboardStats = {
  totalFarmers: number;
  totalMessages: number;
  completedSoilTests: number;
  totalArticles: number;
  completedMessages: number;
  pendingSoilTests: number;
  pendingMessages: number;
  latestFarmers: Farmer[];
};

const defaultStats: DashboardStats = {
  totalFarmers: 0,
  totalMessages: 0,
  completedSoilTests: 0,
  totalArticles: 0,
  completedMessages: 0,
  pendingSoilTests: 0,
  pendingMessages: 0,
  latestFarmers: [],
};

function HeroStat({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white/15 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
          {icon}
        </div>

        <p className="text-sm font-black text-white/90">{label}</p>
      </div>

      <h3 className="mt-6 text-4xl font-black text-white">{value}</h3>

      <p className="mt-2 text-sm font-bold text-white/80">↗ {change}</p>
    </div>
  );
}

export default function OfficerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${API_BASE_URL}/api/officer/dashboard-stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard stats");
      }

      setStats({
        ...defaultStats,
        ...(data.stats || {}),
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const progressData = useMemo(() => {
    const doneCount =
      Number(stats.completedSoilTests || 0) +
      Number(stats.completedMessages || 0);

    const soilTestPendingCount = Number(stats.pendingSoilTests || 0);
    const messagePendingCount = Number(stats.pendingMessages || 0);

    const total = doneCount + soilTestPendingCount + messagePendingCount;
    const safeTotal = total || 1;

    return {
      doneCount,
      soilTestPendingCount,
      messagePendingCount,
      donePercent: (doneCount / safeTotal) * 100,
      soilTestPercent: (soilTestPendingCount / safeTotal) * 100,
      messagePercent: (messagePendingCount / safeTotal) * 100,
    };
  }, [stats]);

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-[1280px] space-y-7">
        <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-400 p-7 shadow-xl shadow-blue-100 sm:p-9">
          <h1 className="text-4xl font-black text-white">
            Good morning, Officer
          </h1>

          <p className="mt-3 text-lg font-medium text-white/85">
            Here's what is happening with farmer support today.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <HeroStat
              icon={<FarmersIcon />}
              label="Total Farmers"
              value={loading ? "..." : String(stats.totalFarmers)}
              change="Active + blocked farmers"
            />

            <HeroStat
              icon={<ActivityIcon />}
              label="Total Messages"
              value={loading ? "..." : String(stats.totalMessages)}
              change="Users messaged with officer"
            />

            <HeroStat
              icon={<ReportIcon />}
              label="Soil Tests"
              value={loading ? "..." : String(stats.completedSoilTests)}
              change="Completed soil tests"
            />

            <HeroStat
              icon={<ArticleIcon />}
              label="Articles"
              value={loading ? "..." : String(stats.totalArticles)}
              change="Articles published"
            />
          </div>
        </section>

        <section className="grid gap-7 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                New Farmer Registrations
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Latest joined farmers
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="w-[30%] py-4 pr-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Farmer
                    </th>

                    <th className="w-[35%] py-4 pr-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="w-[17%] py-4 pr-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="w-[18%] py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-sm font-semibold text-slate-500"
                      >
                        Loading farmers...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    stats.latestFarmers.slice(0, 4).map((farmer) => (
                      <tr
                        key={farmer._id}
                        className="border-b border-slate-100"
                      >
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">
                              {(farmer.name || farmer.fullName || "F")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <p className="truncate text-sm font-black text-slate-900">
                              {farmer.name ||
                                farmer.fullName ||
                                "Unknown Farmer"}
                            </p>
                          </div>
                        </td>

                        <td className="truncate py-4 pr-4 text-sm font-medium text-slate-600">
                          {farmer.email || "-"}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              farmer.status === "blocked"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {farmer.status || "active"}
                          </span>
                        </td>

                        <td className="py-4 text-sm font-medium text-slate-600">
                          {farmer.createdAt
                            ? new Date(farmer.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}

                  {!loading && stats.latestFarmers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-sm font-semibold text-slate-500"
                      >
                        No farmer registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Weekly Progress
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Officer task summary
                </p>
              </div>

              <span className="text-xs font-black text-blue-600">
                Live data ↗
              </span>
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="flex h-full w-full">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${progressData.donePercent}%` }}
                />

                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${progressData.soilTestPercent}%` }}
                />

                <div
                  className="h-full bg-slate-300"
                  style={{ width: `${progressData.messagePercent}%` }}
                />
              </div>
            </div>

            <div className="mt-7 space-y-4 text-sm font-bold">
              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  Done
                </div>

                <span>{loading ? "..." : progressData.doneCount}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  Soil Test
                </div>

                <span>
                  {loading ? "..." : progressData.soilTestPendingCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  Messages
                </div>

                <span>
                  {loading ? "..." : progressData.messagePendingCount}
                </span>
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Summary
              </p>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Done includes completed soil tests and completed messages.
                Soil Test and Messages show pending work.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}