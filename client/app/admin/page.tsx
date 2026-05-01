"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { clearAuthData } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthData();
    router.replace("/account");
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <main className="min-h-screen bg-[#0b0f12] p-6 text-white">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-green-400">
                Admin Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-extrabold">
                System Overview ⚙️
              </h1>
              <p className="mt-3 text-slate-400">
                Manage users, officers, farmers, products, and platform
                activity.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card title="Total Users" value="1,250" />
            <Card title="Farmers" value="620" />
            <Card title="Officers" value="18" />
            <Card title="Products" value="980" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Panel title="User Management">
              <Action>User Accounts</Action>
              <Action>Officer Accounts</Action>
              <Action>Farmer Accounts</Action>
              <Action>System Reports</Action>
            </Panel>

            <Panel title="Recent Activity">
              <Activity text="New farmer registered from Kurunegala" />
              <Activity text="Officer approved 12 products" />
              <Activity text="Admin updated system settings" />
              <Activity text="New order placed by customer" />
            </Panel>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <h2 className="mt-3 text-3xl font-extrabold text-green-400">{value}</h2>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-5 text-xl font-extrabold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Action({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-full rounded-2xl bg-[#111827] px-5 py-4 text-left font-bold text-slate-200 transition hover:bg-green-600 hover:text-white">
      {children}
    </button>
  );
}

function Activity({ text }: { text: string }) {
  return <div className="rounded-2xl bg-[#111827] p-4 text-slate-300">{text}</div>;
}