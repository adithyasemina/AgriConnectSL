"use client";

import { usePathname } from "next/navigation";

type PageInfo = {
  title: string;
  description: string;
};

const pageInfoMap: Record<string, PageInfo> = {
  "/farmer": {
    title: "Farmer Dashboard",
    description: "Welcome to the farmer panel",
  },
  "/farmer/find": {
    title: "Find Disease",
    description: "Upload images and get disease diagnosis",
  },
  "/farmer/chat": {
    title: "Chat with Officer",
    description: "Communicate with agricultural officers",
  },
  "/farmer/alerts": {
    title: "Alerts",
    description: "View notifications and alerts from officers",
  },
  "/farmer/notifications": {
    title: "Notifications",
    description: "Updates about your soil tests and other important alerts",
  },
};

export default function PageTitleBarFarmer() {
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
