"use client";

import { useState, useRef, useEffect } from "react";
import { LuBell, LuX } from "react-icons/lu";

type Notification = {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  type: "alert" | "approval" | "message";
};

const sampleNotifications: Notification[] = [
  {
    id: 1,
    title: "New Farmer Registration",
    message: "Amal Fernando has registered as a new farmer in Kandy district",
    timestamp: "2 minutes ago",
    type: "approval",
  },
  {
    id: 2,
    title: "System Alert",
    message: "Heavy rain warning issued for Colombo district. Alert sent to 24 farmers.",
    timestamp: "15 minutes ago",
    type: "alert",
  },
  {
    id: 3,
    title: "Message from Admin",
    message: "Monthly soil testing report is due by end of this week.",
    timestamp: "1 hour ago",
    type: "message",
  },
  {
    id: 4,
    title: "Farmer Issue Resolved",
    message: "Nimal Perera's paddy field nitrogen deficiency case marked as resolved.",
    timestamp: "3 hours ago",
    type: "approval",
  },
  {
    id: 5,
    title: "System Update",
    message: "Database backup completed successfully.",
    timestamp: "5 hours ago",
    type: "alert",
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "approval":
        return "bg-green-50 text-green-700 border-green-200";
      case "message":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
        aria-label="Notifications"
      >
        <LuBell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 rounded-2xl border border-slate-200 bg-white shadow-lg z-40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h3 className="text-sm font-black text-slate-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {sampleNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`border-b border-slate-100 p-4 transition hover:bg-slate-50 cursor-pointer ${
                  index === sampleNotifications.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex-1">
                    {notification.title}
                  </h4>
                  <span
                    className={`ml-2 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold border ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                </div>
                <p className="mb-2 text-xs text-slate-600 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-400">{notification.timestamp}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-4 text-center">
            <button className="text-xs font-black text-blue-600 hover:text-blue-700">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
