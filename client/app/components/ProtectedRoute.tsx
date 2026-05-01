"use client";

import { api } from "@/lib/api";
import {
  clearAuthData,
  getDashboardPathByRole,
  getToken,
  UserRole,
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

type MeResponse = {
  message: string;
  role: UserRole;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  const allowedRolesKey = useMemo(() => {
    return allowedRoles.join("|");
  }, [allowedRoles]);

  useEffect(() => {
    let isMounted = true;

    const checkRealUserRole = async () => {
      const token = getToken();

      if (!token) {
        clearAuthData();
        router.replace("/account");
        return;
      }

      try {
        const res = await api.get<MeResponse>("/api/auth/me");

        const realRole = res.data.role;

        if (!allowedRoles.includes(realRole)) {
          router.replace(getDashboardPathByRole(realRole));
          return;
        }

        if (isMounted) {
          setIsAllowed(true);
        }
      } catch {
        clearAuthData();
        router.replace("/account");
      }
    };

    checkRealUserRole();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles, allowedRolesKey, router]);

  if (!isAllowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-slate-900">
        <div className="rounded-2xl border border-green-100 bg-white px-6 py-4 shadow-sm">
          Checking access...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}