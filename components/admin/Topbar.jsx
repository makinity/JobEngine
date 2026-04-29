"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Topbar({ onMenuClick }) {
  const router = useRouter();

  async function handleSignOut() {
    localStorage.removeItem("job-tracker-user");
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-4">
        <button
          className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={20} />
        </button>
        <p className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 max-sm:hidden">
          <ShieldCheck size={16} />
          System monitoring
        </p>
      </div>
      <button
        className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
        onClick={handleSignOut}
        type="button"
      >
        <LogOut size={16} />
        <span className="max-sm:hidden">Sign out</span>
      </button>
    </header>
  );
}
