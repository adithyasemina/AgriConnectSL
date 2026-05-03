"use client";

import { usePathname } from "next/navigation";

type PageInfo = {
  title: string;
  description: string;
};

const pageInfoMap: Record<string, PageInfo> = {
  "/officer": {
    title: "Dashboard",
    description: "Welcome to the officer panel",
  },
  "/officer/farmers": {
    title: "Farmer Management",
    description: "Manage active and blocked farmer accounts",
  },
  "/officer/alerts": {
    title: "Send Alerts",
    description: "Send notifications to farmers in specific districts",
  },
  "/officer/messages": {
    title: "Messages",
    description: "Communicate with farmers",
  },
  "/officer/articles": {
    title: "Knowledge Articles",
    description: "Create and manage farmer education articles",
  },
  "/officer/soil-test": {
    title: "Soil Test Reports",
    description: "Send soil test results and recommendations to farmers",
  },
};

export default function PageTitleBar() {
  const pathname = usePathname();
  const pageInfo = pageInfoMap[pathname] || { title: "", description: "" };

  if (!pageInfo.title) {
    return null;
  }

  return (
    <div className="flex flex-1 items-center gap-6 px-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm lg:text-lg font-black tracking-tight text-slate-900">
          {pageInfo.title}
        </h2>
        <p className="text-xs font-medium text-slate-500">
          {pageInfo.description}
        </p>
      </div>
    </div>
  );
}
