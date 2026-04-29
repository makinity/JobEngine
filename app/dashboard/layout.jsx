"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/user/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (role === "admin") {
        router.replace("/admin");
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user || role === "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
