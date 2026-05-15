"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { LuLoader, LuBell, LuCircleAlert } from "react-icons/lu";

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: "soil_completed" | "soil_recall";
  soilTestId: string;
  officerName?: string;
  isRead: boolean;
  createdAt: string;
};

export default function FarmerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/soil-tests/notifications/me");
      const data = Array.isArray(response.data) ? response.data : response.data.notifications || [];
      setNotifications(data);
    } catch (err: any) {
      console.error("Fetch notifications error:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getNotificationIcon = (type: string) => {
    return <LuBell className="h-5 w-5" />;
  };

  const getNotificationColor = (type: string) => {
    if (type === "soil_completed") return "border-green-100 bg-green-50";
    return "border-blue-100 bg-blue-50";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
        <LuLoader className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-xl font-black text-slate-900 sm:text-2xl">Notifications</h1>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">
          <div className="flex gap-4">
            <LuCircleAlert className="h-6 w-6 flex-shrink-0 text-red-600 mt-1" />
            <div>
              <p className="font-black text-red-900">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-2 text-sm font-black text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-2xl border p-4 sm:p-6 shadow-sm transition ${getNotificationColor(
                notification.type
              )}`}
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-slate-600">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-slate-900">{notification.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{notification.message}</p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    {notification.officerName && <span>👤 {notification.officerName}</span>}
                    <span>📅 {formatDate(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <LuBell className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-500">No notifications yet</p>
            <p className="text-sm text-slate-400 mt-2">
              You'll receive notifications when your soil test results are ready.
            </p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-black text-blue-900">📢 About Notifications</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li>✓ You'll receive a notification when your soil test is completed</li>
          <li>✓ Officers will provide recommendations based on your soil analysis</li>
          <li>✓ Check back here regularly for important updates</li>
        </ul>
      </div>
    </div>
  );
}
