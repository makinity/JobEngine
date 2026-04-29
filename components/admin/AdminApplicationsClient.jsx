"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import JobCard from "@/components/user/JobCard";
import {
  deleteApplication,
  getApplications,
} from "@/services/applicationService";

const statusFilters = ["All", "Applied", "Interview", "Offer", "Rejected"];

export default function AdminApplicationsClient() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;
      const text = [
        application.company,
        application.position,
        application.location,
        application.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && text.includes(normalizedQuery);
    });
  }, [applications, query, statusFilter]);

  useEffect(() => {
    let isMounted = true;

    getApplications()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setApplications(data.applications ?? []);
        setError("");
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleDelete(application) {
    const label = application.company || "this application";

    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(application.id);
    setError("");

    try {
      await deleteApplication(application.id);
      setApplications((current) =>
        current.filter((item) => item.id !== application.id),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Moderation
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          All applications
        </h1>
      </div>

      <section className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
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
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          <span className="inline-flex items-center gap-2">
            <Filter size={15} />
            Status
          </span>
          <select
            className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 shadow-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            {statusFilters.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </section>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-sm text-zinc-600">
        Showing {filteredApplications.length} of {applications.length}
      </p>

      {isLoading ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-56 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-zinc-100" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
          No applications match the current view.
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
