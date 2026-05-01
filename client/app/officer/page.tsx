"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { clearAuthData } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function OfficerPage() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthData();
    router.replace("/account");
  };

  return (
    <ProtectedRoute allowedRoles={["officer"]}>
      <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-slate-900 p-8 text-white shadow-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Officer Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-extrabold">
                Welcome Officer 🧑‍💼
              </h1>
              <p className="mt-3 text-slate-300">
                Review farmer registrations, verify products, and monitor
                activity.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card title="Farmers" value="120" />
            <Card title="Pending Reviews" value="16" />
            <Card title="Approved Products" value="340" />
            <Card title="Reports" value="09" />
          </div>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-5 text-xl font-extrabold">
              Pending Farmer Requests
            </h2>

            <div className="space-y-4">
              <Request
                name="Nimal Perera"
                district="Kurunegala"
                status="Pending"
              />
              <Request
                name="Saman Kumara"
                district="Kandy"
                status="Pending"
              />
              <Request name="Kasun Silva" district="Galle" status="Review" />
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-extrabold">{value}</h2>
    </div>
  );
}

function Request({
  name,
  district,
  status,
}: {
  name: string;
  district: string;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-slate-500">{district}</p>
      </div>

      <div className="flex gap-3">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
          {status}
        </span>
        <button className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white">
          Approve
        </button>
        <button className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
          Reject
        </button>
      </div>
    </div>
  );
}