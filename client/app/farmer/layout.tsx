"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import PageTitleBarFarmer from "@/app/components/PageTitleBarFarmer";
import NotificationDropdown from "@/app/components/NotificationDropdown";
import { clearAuthData, getAuthUser } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  LuLeaf,
  LuMenu,
  LuLayoutDashboard,
  LuSearch,
  LuMessageCircle,
  LuBell,
  LuLogOut,
  LuBeaker,
  LuCheck,
} from "react-icons/lu";

const menuItems = [
  { name: "Dashboard", href: "/farmer", icon: LuLayoutDashboard },
  { name: "Find Disease", href: "/farmer/find", icon: LuSearch },
  { name: "Soil Test", href: "/farmer/soil-test", icon: LuBeaker },
  { name: "Chat", href: "/farmer/chat", icon: LuMessageCircle },
  { name: "Alerts", href: "/farmer/alerts", icon: LuBell },
  { name: "Notifications", href: "/farmer/notifications", icon: LuCheck },
];

export default function FarmerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getAuthUser();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuthData();
    router.replace("/account");
  };

  return (
    <ProtectedRoute allowedRoles={["farmer"]}>
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
              <LuLeaf className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                AgriConnect
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Farmer Panel
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">
              Farmer Menu
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
                    <Icon className="h-5 w-5" />
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
              <LuLogOut className="h-5 w-5" />
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
                <LuMenu className="h-5 w-5" />
              </button>

              <PageTitleBarFarmer />
            </div>

            {/* Right Section: User Info + Profile + Notifications */}
            <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8">
              {/* User Name and Role */}
              <div className="hidden sm:flex flex-col items-end gap-0.5 pr-2">
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {user?.firstName || "Farmer"} Profile
                </p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Farmer
                </p>
              </div>

              {/* Profile Badge */}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
                {user?.firstName?.[0] || "F"}
              </div>

              {/* Notification Dropdown */}
              <div className="hidden sm:block">
                <NotificationDropdown />
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
