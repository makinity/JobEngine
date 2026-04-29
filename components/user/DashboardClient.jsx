"use client";

import Link from "next/link";
import { Filter, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useApplications } from "@/hooks/useApplications";
import JobCard from "./JobCard";
import Snackbar from "@/components/shared/Snackbar";

const statusFilters = ["All", "Applied", "Interview", "Offer", "Rejected"];

export default function DashboardClient() {
  const { applications, error, isLoading, removeApplication } =
    useApplications();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statusCounts = useMemo(() => {
    return applications.reduce(
      (counts, application) => {
        const status = application.status || "Applied";
        counts.All += 1;
        counts[status] = (counts[status] || 0) + 1;
        return counts;
      },
      { All: 0 },
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;
      const searchableText = [
        application.company,
        application.position,
        application.location,
        application.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(normalizedQuery);
    });
  }, [applications, query, statusFilter]);

  const hasFilters = query.trim() || statusFilter !== "All";

  async function handleDelete(application) {
    const label = application.company || "this application";

    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(application.id);
    setDeleteError("");

    try {
      await removeApplication(application.id);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Applications
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
            Job dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {applications.length} total jobs tracked
          </p>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
          href="/add-job"
        >
          <Plus size={16} />
          Add job
        </Link>
      </div>

      <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            <span>Search</span>
            <span className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                size={18}
              />
              <input
                className="h-11 w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 text-base text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search company, title, location, or notes"
                type="search"
                value={query}
              />
            </span>
          </label>

          <div className="grid gap-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-800">
              <Filter size={15} />
              Status
            </span>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => {
                const isActive = statusFilter === status;

                return (
                  <button
                    className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                      isActive
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    type="button"
                  >
                    <span>{status}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {statusCounts[status] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredApplications.length} of {applications.length}
          </span>
          {hasFilters && (
            <button
              className="inline-flex w-fit items-center gap-1 font-medium text-zinc-950 hover:underline"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
              }}
              type="button"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </section>

      <Snackbar 
        message={error || deleteError} 
        onClose={() => {
          setError("");
          setDeleteError("");
        }} 
      />

      {isLoading ? (
        <section className="grid gap-4" aria-label="Loading applications">
          {[0, 1, 2].map((item) => (
            <div
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              key={item}
            >
              <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
              <div className="mt-3 h-4 w-64 animate-pulse rounded bg-zinc-100" />
              <div className="mt-5 flex gap-2">
                <div className="h-9 w-20 animate-pulse rounded bg-zinc-100" />
                <div className="h-9 w-20 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </section>
      ) : applications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
          <h2 className="text-lg font-medium text-zinc-950">
            No applications yet
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Add your first job application to start tracking progress.
          </p>
          <Link
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            href="/add-job"
          >
            <Plus size={16} />
            Add job
          </Link>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
          <h2 className="text-lg font-medium text-zinc-950">
            No matching applications
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Adjust your search or status filter to see more jobs.
          </p>
          <button
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            onClick={() => {
              setQuery("");
              setStatusFilter("All");
            }}
            type="button"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <section className="grid gap-4">
          {filteredApplications.map((application) => (
            <JobCard
              deleting={deletingId === application.id}
              job={application}
              key={application.id}
              onDelete={() => handleDelete(application)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
