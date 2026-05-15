"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type DashboardStats = {
  totalFarmers: number;
  activeOfficers: number;
  completedSoilTests: number;
  doneMessages: number;
};

const defaultStats: DashboardStats = {
  totalFarmers: 0,
  activeOfficers: 0,
  completedSoilTests: 0,
  doneMessages: 0,
};

function StatIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-white">
      {children}
    </div>
  );
}

function MiniTrend() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 14l6-6 4 4 6-8" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0-4a4 4 0 100-8 4 4 0 000 8zm8 0a4 4 0 100-8 4 4 0 000 8z"
      />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 4l5 5-5 5-5-5 5-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20l6-6" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h4l2-6 4 12 2-6h4" />
    </svg>
  );
}

function ChartLine() {
  return (
    <svg viewBox="0 0 700 260" className="h-full w-full">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M40 210 C120 198 135 205 205 184 C270 164 300 172 365 145 C440 114 480 118 545 86 C610 54 650 62 680 40 L680 250 L40 250 Z"
        fill="url(#lineFill)"
      />

      <path
        d="M40 210 C120 198 135 205 205 184 C270 164 300 172 365 145 C440 114 480 118 545 86 C610 54 650 62 680 40"
        fill="none"
        stroke="#2563eb"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="40"
          x2="680"
          y1={60 + i * 50}
          y2={60 + i * 50}
          stroke="#e2e8f0"
          strokeDasharray="5 6"
        />
      ))}
    </svg>
  );
}

const teamActivity = [
  {
    name: "Nimal P.",
    text: "created a farmer account",
    time: "3m",
    initials: "NP",
  },
  {
    name: "Kamal F.",
    text: "uploaded a soil report",
    time: "12m",
    initials: "KF",
  },
  {
    name: "Saman K.",
    text: "booked an appointment",
    time: "28m",
    initials: "SK",
  },
  {
    name: "Admin",
    text: "published a broadcast alert",
    time: "45m",
    initials: "AD",
  },
  {
    name: "Officer",
    text: "reviewed farmer request",
    time: "1h",
    initials: "OF",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/dashboard-stats");

      if (response.data.success) {
        setStats({
          totalFarmers: response.data.stats.totalFarmers || 0,
          activeOfficers: response.data.stats.activeOfficers || 0,
          completedSoilTests: response.data.stats.completedSoilTests || 0,
          doneMessages: response.data.stats.doneMessages || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-400 p-6 text-white shadow-xl shadow-blue-600/20 sm:p-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Good morning, Admin
          </h1>
          <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
            Here&apos;s what is happening with AgriConnect today.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <HeroStat
            icon={<ActivityIcon />}
            label="Total Farmers"
            value={loading ? "..." : String(stats.totalFarmers)}
            change="Registered farmers"
          />
          <HeroStat
            icon={<UsersIcon />}
            label="Active Officers"
            value={loading ? "..." : String(stats.activeOfficers)}
            change="Active officers"
          />
          <HeroStat
            icon={<RocketIcon />}
            label="Completed Soil Tests"
            value={loading ? "..." : String(stats.completedSoilTests)}
            change="Completed tests"
          />
          <HeroStat
            icon={<ActivityIcon />}
            label="Done Messages"
            value={loading ? "..." : String(stats.doneMessages)}
            change="Completed chats"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Farmer Growth
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Monthly registered farmers trend
              </p>
            </div>

            <div className="flex w-fit rounded-2xl bg-slate-100 p-1">
              <button className="rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-sm">
                Farmers
              </button>
              <button className="px-4 py-2 text-xs font-black text-slate-400">
                Officers
              </button>
            </div>
          </div>

          <div className="mt-6 h-72">
            <ChartLine />
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400">
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Monthly Target
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  5 days remaining
                </p>
              </div>

              <button className="text-xs font-black text-blue-600">
                View board ↗
              </button>
            </div>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[72%] rounded-full bg-blue-600" />
            </div>

            <div className="mt-5 grid gap-3 text-xs font-bold text-slate-500 sm:grid-cols-3">
              <ProgressLabel dot="bg-blue-600" text="Completed (14)" />
              <ProgressLabel dot="bg-slate-400" text="In Progress (5)" />
              <ProgressLabel dot="bg-slate-300" text="To Do (2)" />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Team Activity
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Latest from your team
                </p>
              </div>

              <button className="text-xs font-black text-blue-600">
                View all ↗
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {teamActivity.map((item) => (
                <div
                  key={item.name + item.time}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                    {item.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {item.name}{" "}
                      <span className="font-medium text-slate-500">
                        {item.text}
                      </span>
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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
    <div className="rounded-[1.5rem] bg-white/15 p-5 backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm font-bold text-white/70">
        <StatIcon>{icon}</StatIcon>
        <span>{label}</span>
      </div>

      <h2 className="mt-4 text-3xl font-black">{value}</h2>

      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-white/75">
        <MiniTrend />
        {change}
      </p>
    </div>
  );
}

function ProgressLabel({ dot, text }: { dot: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      <span>{text}</span>
    </div>
  );
}
