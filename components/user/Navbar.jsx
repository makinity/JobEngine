"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, LayoutDashboard, LogOut, Menu, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleSignOut() {
    localStorage.removeItem("job-tracker-user");
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <nav
        aria-label="User navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link
          className="inline-flex items-center gap-2 font-semibold text-zinc-950"
          href="/dashboard"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-md bg-zinc-950 text-white">
            <BriefcaseBusiness size={18} />
          </span>
          <span className="max-sm:hidden">Job Tracker</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-2 text-sm font-medium text-zinc-700 sm:flex">
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md px-3 transition hover:bg-zinc-100 hover:text-zinc-950"
            href="/dashboard"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-3 text-white shadow-sm transition hover:bg-zinc-800"
            href="/add-job"
          >
            <Plus size={16} />
            Add Job
          </Link>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            onClick={handleSignOut}
            type="button"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 sm:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-zinc-100 bg-white p-4 sm:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 text-sm font-medium">
            <Link
              className="flex h-10 items-center gap-2 rounded-md px-3 hover:bg-zinc-50"
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link
              className="flex h-10 items-center gap-2 rounded-md px-3 hover:bg-zinc-50"
              href="/add-job"
              onClick={() => setIsMenuOpen(false)}
            >
              <Plus size={16} />
              Add Job
            </Link>
            <button
              className="flex h-10 items-center gap-2 rounded-md px-3 text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
