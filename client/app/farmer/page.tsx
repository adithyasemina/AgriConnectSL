"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { clearAuthData } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function FarmerPage() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthData();
    router.replace("/account");
  };

  return (
    <ProtectedRoute allowedRoles={["farmer"]}>
      <main className="min-h-screen bg-[#f6fbf4] p-6 text-slate-900">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-green-600 p-8 text-white shadow-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
                Farmer Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-extrabold">
                Welcome Farmer 👨‍🌾
              </h1>
              <p className="mt-3 text-green-50">
                Manage your products, orders, and sales in one place.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-white px-5 py-3 font-bold text-green-700 transition hover:bg-green-50"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card title="My Products" value="24" text="Active listed products" />
            <Card title="New Orders" value="08" text="Orders waiting today" />
            <Card
              title="Total Sales"
              value="Rs. 45,200"
              text="This month income"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Panel title="Quick Actions">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button>Add Product</Button>
                <Button>View Orders</Button>
                <Button>Update Stock</Button>
                <Button>Sales Report</Button>
              </div>
            </Panel>

            <Panel title="Recent Orders">
              <Order name="Tomatoes" qty="20 kg" status="Pending" />
              <Order name="Carrots" qty="15 kg" status="Confirmed" />
              <Order name="Cabbage" qty="10 kg" status="Delivered" />
            </Panel>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

function Card({
  title,
  value,
  text,
}: {
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-green-100">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-extrabold">{value}</h2>
      <p className="mt-2 text-slate-500">{text}</p>
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
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-green-100">
      <h3 className="mb-5 text-xl font-extrabold">{title}</h3>
      {children}
    </div>
  );
}

function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-2xl bg-green-600 px-5 py-4 font-bold text-white transition hover:bg-green-700">
      {children}
    </button>
  );
}

function Order({
  name,
  qty,
  status,
}: {
  name: string;
  qty: string;
  status: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl bg-green-50 p-4">
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-slate-500">{qty}</p>
      </div>
      <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-green-700">
        {status}
      </span>
    </div>
  );
}