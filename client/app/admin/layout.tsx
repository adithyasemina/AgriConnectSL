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
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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

function UsersIcon({ className = "h-5 w-5" }: IconProps) {
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

function ContentIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8M8 12h8M8 16h5" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h7l5 5v11H7V4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

function SettingsIcon({ className = "h-5 w-5" }: IconProps) {
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
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1 .6 1.65 1.65 0 00-.4 1.08V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-.6-1 1.65 1.65 0 00-1.08-.4H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-.6 1.65 1.65 0 00.4-1.08V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.35.35.65.6 1 .3.25.68.4 1.08.4H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51.6z"
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m12 0l-4-4m4 4l-4 4M21 4v16" />
    </svg>
  );
}

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: DashboardIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Content", href: "/admin/content", icon: ContentIcon },
  { name: "Reports", href: "/admin/reports", icon: ReportsIcon },
  { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getAuthUser();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuthData();
    router.replace("/account");
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                <path d="M12 6v6l5 3" stroke="white" strokeWidth={2} fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                AgriConnect
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">
              Overview
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
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
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
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            {/* Left Section: Menu + Page Title */}
            <div className="flex flex-1 items-center gap-2 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 lg:hidden"
                aria-label="Open sidebar"
              >
                <MenuIcon />
              </button>
            </div>

            {/* Right Section: User Info + Profile */}
            <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8">
              {/* User Name and Role */}
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {user?.firstName || "Admin"} Profile
                </p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Admin
                </p>
              </div>

              {/* Profile Badge */}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
                {user?.firstName?.[0] || "A"}
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}