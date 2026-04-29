import StatusBadge from "./StatusBadge";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react";

export default function JobCard({ deleting = false, job, onDelete, onEdit }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="truncate text-xl font-semibold text-zinc-950">
              {job?.company ?? "Company"}
            </h2>
            <StatusBadge status={job?.status ?? "Applied"} />
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
            <span className="font-medium text-zinc-800">
              {job?.position ?? "Position"}
            </span>
            {job?.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {job.location}
              </span>
            )}
            {job?.applied_date && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={14} />
                Applied {new Date(job.applied_date).toLocaleDateString()}
              </span>
            )}
          </div>

          {job?.notes && (
            <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-600">
              {job.notes}
            </p>
          )}
        </div>

        <div className="flex gap-2 lg:justify-end">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            onClick={onEdit}
            type="button"
          >
            <Pencil size={15} />
            Edit
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={deleting}
            onClick={onDelete}
            type="button"
          >
            <Trash2 size={15} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
