"use client";

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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 14l6-6 4 4 6-8"
      />
    </svg>
  );
}

function CheckIcon() {
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function ChatIcon() {
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function ReportIcon() {
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
        d="M7 4h7l5 5v11H7V4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 4v5h5M9 13h6M9 17h6"
      />
    </svg>
  );
}

function AlertIcon() {
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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

const recentChecks = [
  {
    name: "Paddy Leaf Blast",
    date: "2024-01-25",
    confidence: "92%",
    status: "Concerning",
    initials: "PLB",
  },
  {
    name: "Brown Spot Disease",
    date: "2024-01-23",
    confidence: "78%",
    status: "Moderate",
    initials: "BSD",
  },
  {
    name: "Healthy Plant",
    date: "2024-01-20",
    confidence: "95%",
    status: "Healthy",
    initials: "HP",
  },
];

const recentAlerts = [
  {
    title: "Heavy Rain Warning",
    district: "Kandy",
    priority: "High",
    date: "2024-01-25",
  },
  {
    title: "Pest Alert - Fall Armyworm",
    district: "Kandy",
    priority: "Medium",
    date: "2024-01-24",
  },
  {
    title: "Fertilizer Price Update",
    district: "Central",
    priority: "Low",
    date: "2024-01-23",
  },
];

export default function FarmerDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-600/20 sm:p-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back, Farmer
          </h1>
          <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
            Here&apos;s your farming support dashboard today.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <HeroStat
            icon={<CheckIcon />}
            label="Disease Checks"
            value="12"
            change="+3 this week"
          />
          <HeroStat
            icon={<ChatIcon />}
            label="Chat Messages"
            value="08"
            change="+2 unread"
          />
          <HeroStat
            icon={<ReportIcon />}
            label="Soil Reports"
            value="03"
            change="Latest: Good"
          />
          <HeroStat
            icon={<AlertIcon />}
            label="Active Alerts"
            value="05"
            change="1 High Priority"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Recent Disease Checks
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Your latest crop analyses
              </p>
            </div>

            <button className="text-xs font-black text-emerald-600 hover:text-emerald-700">
              View all ↗
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {recentChecks.map((check) => (
              <div
                key={check.name}
                className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                    {check.initials[0]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {check.name}
                    </p>
                    <p className="text-xs text-slate-500">{check.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {check.confidence}
                    </p>
                    <p className="text-xs text-slate-500">{check.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Chat Support
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Connect with officer
                </p>
              </div>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 transition">
              Open Chat
            </button>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Latest Alerts
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Regional notifications
                </p>
              </div>

              <button className="text-xs font-black text-emerald-600 hover:text-emerald-700">
                View all ↗
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {recentAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.title}
                  className="rounded-xl border border-slate-100 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900">
                        {alert.title}
                      </p>
                      <p className="text-xs text-slate-500">{alert.district}</p>
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold ${
                        alert.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : alert.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
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
