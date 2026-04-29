"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CircleCheck, MessageSquare, Users } from "lucide-react";
import { getApplications } from "@/services/applicationService";
import { getUsers } from "@/services/userService";
import StatsCard from "./StatsCard";
import Snackbar from "@/components/shared/Snackbar";

const statuses = ["Applied", "Interview", "Offer", "Rejected"];

export default function AdminDashboardClient() {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const statusCounts = useMemo(() => {
    return applications.reduce((counts, application) => {
      const status = application.status || "Applied";
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  }, [applications]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getApplications(), getUsers()])
      .then(([applicationsData, usersData]) => {
        if (!isMounted) {
          return;
        }

        setApplications(applicationsData.applications ?? []);
        setUsers(usersData.users ?? []);
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

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          System dashboard
        </h1>
      </div>

      <Snackbar 
        message={error} 
        onClose={() => setError("")} 
      />

      {isLoading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              key={item}
            >
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard icon={Users} label="Total users" value={users.length} />
            <StatsCard
              icon={BriefcaseBusiness}
              label="Total applications"
              value={applications.length}
            />
            <StatsCard
              icon={MessageSquare}
              label="Interviews"
              value={statusCounts.Interview || 0}
            />
            <StatsCard
              icon={CircleCheck}
              label="Offers"
              value={statusCounts.Offer || 0}
            />
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">
              Status counts
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {statuses.map((status) => (
                <div
                  className="rounded-md border border-zinc-200 p-4"
                  key={status}
                >
                  <p className="text-sm text-zinc-500">{status}</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-950">
                    {statusCounts[status] || 0}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
