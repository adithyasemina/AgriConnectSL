"use client";

import { useState } from "react";

function SendIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function AlertIcon({ className = "h-5 w-5" }: { className?: string }) {
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

type AlertType = {
  id: number;
  title: string;
  district: string;
  priority: "Low" | "Medium" | "High";
  message: string;
  sentDate: string;
};

const sampleAlerts: AlertType[] = [
  {
    id: 1,
    title: "Heavy Rain Warning",
    district: "Kandy",
    priority: "High",
    message: "Heavy rain expected in next 24 hours. Protect crops accordingly.",
    sentDate: "2024-01-25",
  },
  {
    id: 2,
    title: "Pest Alert - Fall Armyworm",
    district: "Colombo",
    priority: "Medium",
    message: "Fall armyworm detected in the region. Use recommended pesticides.",
    sentDate: "2024-01-24",
  },
  {
    id: 3,
    title: "Fertilizer Price Update",
    district: "Galle",
    priority: "Low",
    message: "Fertilizer prices have increased by 5%. Plan your purchases.",
    sentDate: "2024-01-23",
  },
];

export default function AlertsPage() {
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [message, setMessage] = useState("");
  const [alerts, setAlerts] = useState<AlertType[]>(sampleAlerts);
  const [sentMessage, setSentMessage] = useState(false);

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !district || !message) {
      return;
    }

    const newAlert: AlertType = {
      id: alerts.length + 1,
      title,
      district,
      priority,
      message,
      sentDate: new Date().toISOString().split("T")[0],
    };

    setAlerts([newAlert, ...alerts]);
    setTitle("");
    setDistrict("");
    setPriority("Medium");
    setMessage("");
    setSentMessage(true);

    setTimeout(() => setSentMessage(false), 3000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-2">

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-6 text-lg font-black text-slate-900">New Alert</h2>

          <form onSubmit={handleSendAlert} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Alert Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Heavy Rain Warning"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Target District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select district...</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                  <option>Anuradhapura</option>
                  <option>Batticaloa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as "Low" | "Medium" | "High")
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your alert message..."
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <SendIcon />
              Send Alert
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-black text-slate-900">Info</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-slate-900">Recipients</p>
              <p className="text-slate-600">
                All farmers in the selected district will receive this alert.
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Delivery</p>
              <p className="text-slate-600">
                Alerts are sent immediately upon submission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {sentMessage && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 flex gap-3">
          <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-blue-900">Alert sent successfully!</p>
            <p className="text-sm text-blue-700">
              The alert has been delivered to all farmers in the selected district.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-black text-slate-900">Recent Alerts</h2>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertIcon
                      className={`h-4 w-4 ${
                        alert.priority === "High"
                          ? "text-red-600"
                          : alert.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    />
                    <h3 className="font-bold text-slate-900">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{alert.message}</p>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="font-bold">{alert.district}</span>
                    <span>•</span>
                    <span>{new Date(alert.sentDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
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
  );
}
