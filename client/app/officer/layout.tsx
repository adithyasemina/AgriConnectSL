"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { clearAuthData, getAuthUser } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type IconProps = {
  className?: string;
};

function LogoIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19l8-8" />
    </svg>
  );
}

function MenuIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function SearchIcon({ className = "h-4 w-4" }: IconProps) {
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

function DashboardIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M4 13h7V4H4v9zM13 20h7V4h-7v16zM4 20h7v-5H4v5z"
      />
    </svg>
  );
}

function FarmersIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0-4a4 4 0 100-8 4 4 0 000 8zm8 0a4 4 0 100-8 4 4 0 000 8z"
      />
    </svg>
  );
}

function ReportsIcon({ className = "h-5 w-5" }: IconProps) {
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

function AlertsIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function MessagesIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function ArticlesIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  );
}

function SoilIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}

function LogoutIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M15 12H3m12 0l-4-4m4 4l-4 4M21 4v16"
      />
    </svg>
  );
}

const menuItems = [
  { name: "Dashboard", href: "/officer", icon: DashboardIcon },
  { name: "Farmers", href: "/officer/farmers", icon: FarmersIcon },
  { name: "Alerts", href: "/officer/alerts", icon: AlertsIcon },
  { name: "Messages", href: "/officer/messages", icon: MessagesIcon },
  { name: "Articles", href: "/officer/articles", icon: ArticlesIcon },
  { name: "Soil Test", href: "/officer/soil-test", icon: SoilIcon },
];

export default function OfficerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getAuthUser();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuthData();
    router.replace("/account");
  };

  return (
    <ProtectedRoute allowedRoles={["officer"]}>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            aria-label="Close sidebar"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <LogoIcon />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                AgriConnect
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Officer Panel
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">
              Officer Menu
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                        : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                  >
                    <Icon />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-black text-white">
                {user?.firstName?.[0] || "O"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                  {user?.firstName || "Officer"} {user?.lastName || ""}
                </p>
                <p className="text-xs font-semibold text-slate-400">Officer</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </aside>

        <div className="min-h-screen lg:pl-72">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 lg:hidden"
                aria-label="Open sidebar"
              >
                <MenuIcon />
              </button>

              <div className="hidden w-72 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400 sm:flex">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white sm:block">
                + New Report
              </button>

              <div className="relative hidden h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 sm:flex">
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-600" />
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-black text-white">
                {user?.firstName?.[0] || "O"}
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}