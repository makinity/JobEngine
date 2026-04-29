"use client";

import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/applications", label: "Applications", icon: BriefcaseBusiness },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm lg:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
          <Link
            className="inline-flex items-center gap-2 font-semibold text-zinc-950"
            href="/admin"
            onClick={onClose}
          >
            <span className="inline-flex size-9 items-center justify-center rounded-md bg-zinc-950 text-white">
              <LayoutDashboard size={18} />
            </span>
            Admin
          </Link>
          <button className="lg:hidden" onClick={onClose}>
            <X size={20} className="text-zinc-500" />
          </button>
        </div>
        <nav
          aria-label="Admin navigation"
          className="flex flex-col gap-1 p-4 text-sm font-medium text-zinc-700"
        >
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 transition ${
                  isActive 
                    ? "bg-zinc-100 text-zinc-950" 
                    : "hover:bg-zinc-50 hover:text-zinc-950"
                }`}
                key={link.href}
                href={link.href}
                onClick={onClose}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
