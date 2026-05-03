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

function FarmersIcon() {
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

function AppointmentIcon() {
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
        d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
      />
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12h4l2-6 4 12 2-6h4"
      />
    </svg>
  );
}

function ChartLine() {
  return (
    <svg viewBox="0 0 700 260" className="h-full w-full">
      <defs>
        <linearGradient id="officerLineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M40 210 C115 190 150 198 210 165 C280 128 320 150 390 112 C460 72 515 95 570 62 C625 34 655 48 680 36 L680 250 L40 250 Z"
        fill="url(#officerLineFill)"
      />

      <path
        d="M40 210 C115 190 150 198 210 165 C280 128 320 150 390 112 C460 72 515 95 570 62 C625 34 655 48 680 36"
        fill="none"
        stroke="#059669"
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

const recentRequests = [
  {
    name: "Nimal Perera",
    text: "requested a soil test appointment",
    time: "5m",
    initials: "NP",
  },
  {
    name: "Saman Kumara",
    text: "submitted a paddy disease image",
    time: "18m",
    initials: "SK",
  },
  {
    name: "Kasun Silva",
    text: "uploaded field details",
    time: "34m",
    initials: "KS",
  },
  {
    name: "Amal Fernando",
    text: "asked chatbot support question",
    time: "1h",
    initials: "AF",
  },
];

export default function OfficerDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-600/20 sm:p-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Good morning, Officer
          </h1>
          <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
            Here&apos;s what is happening with farmer support today.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <HeroStat
            icon={<FarmersIcon />}
            label="Assigned Farmers"
            value="120"
            change="+8.4% this month"
          />
          <HeroStat
            icon={<AppointmentIcon />}
            label="Appointments"
            value="32"
            change="+12.1% this week"
          />
          <HeroStat
            icon={<ReportIcon />}
            label="Soil Reports"
            value="74"
            change="+18 reports completed"
          />
          <HeroStat
            icon={<ActivityIcon />}
            label="Pending Reviews"
            value="16"
            change="Needs attention"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Farmer Support Growth
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Monthly farmer requests and support activity
              </p>
            </div>

            <div className="flex w-fit rounded-2xl bg-slate-100 p-1">
              <button className="rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-sm">
                Requests
              </button>
              <button className="px-4 py-2 text-xs font-black text-slate-400">
                Reports
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
                  Weekly Progress
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  5 days remaining
                </p>
              </div>

              <button className="text-xs font-black text-emerald-600">
                View board ↗
              </button>
            </div>

            <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[68%] rounded-full bg-emerald-600" />
            </div>

            <div className="mt-5 grid gap-3 text-xs font-bold text-slate-500 sm:grid-cols-3">
              <ProgressLabel dot="bg-emerald-600" text="Done (18)" />
              <ProgressLabel dot="bg-slate-400" text="Review (8)" />
              <ProgressLabel dot="bg-slate-300" text="Pending (6)" />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Recent Farmer Requests
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Latest farmer support activities
                </p>
              </div>

              <button className="text-xs font-black text-emerald-600">
                View all ↗
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {recentRequests.map((item) => (
                <div
                  key={item.name + item.time}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
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