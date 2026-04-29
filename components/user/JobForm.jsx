"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import {
  createApplication,
  getApplication,
  updateApplication,
} from "@/services/applicationService";

const defaultValues = {
  company: "",
  position: "",
  status: "Applied",
  location: "",
  applied_date: "",
  notes: "",
};

export default function JobForm({ applicationId, onSuccess, onCancel }) {
  const router = useRouter();
  const [form, setForm] = useState(defaultValues);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(applicationId));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!applicationId) {
      return;
    }

    let isMounted = true;

    async function loadApplication() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getApplication(applicationId);
        const application = data.application;

        if (!isMounted) {
          return;
        }

        setForm({
          company: application.company ?? "",
          position: application.position ?? "",
          status: application.status ?? "Applied",
          location: application.location ?? "",
          applied_date: application.applied_date ?? "",
          notes: application.notes ?? "",
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadApplication();

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      if (applicationId) {
        await updateApplication(applicationId, form);
      } else {
        await createApplication(form);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="h-11 animate-pulse rounded bg-zinc-100" />
          <div className="h-11 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  return (
    <form
      className={`grid gap-6 ${!onSuccess ? 'rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6' : ''}`}
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Company"
          name="company"
          onChange={updateField}
          required
          value={form.company}
        />
        <Input
          label="Position"
          name="position"
          onChange={updateField}
          required
          value={form.position}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          <span>Status</span>
          <select
            className="h-11 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 shadow-sm outline-none transition focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            name="status"
            onChange={updateField}
            value={form.status}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </label>
        <Input
          label="Location"
          name="location"
          onChange={updateField}
          value={form.location}
        />
        <Input
          label="Applied date"
          name="applied_date"
          onChange={updateField}
          type="date"
          value={form.applied_date}
        />
      </div>

      <label className="grid gap-2 text-sm font-medium text-zinc-800">
        <span>Notes</span>
        <textarea
          className="min-h-32 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
          name="notes"
          onChange={updateField}
          value={form.notes}
        />
      </label>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            onClick={onCancel}
            type="button"
          >
            <ArrowLeft size={16} />
            Cancel
          </button>
        ) : (
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            href="/dashboard"
          >
            <ArrowLeft size={16} />
            Cancel
          </Link>
        )}
        <Button disabled={isSaving} type="submit">
          <Save size={16} />
          {isSaving ? "Saving..." : "Save job"}
        </Button>
      </div>
    </form>
  );
}
