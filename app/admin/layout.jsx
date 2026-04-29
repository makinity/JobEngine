"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";

export default function AdminRouteLayout({ children }) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && role && role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user || (role && role !== "admin")) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
