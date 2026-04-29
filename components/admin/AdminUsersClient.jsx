"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import UserTable from "./UserTable";
import { deleteUser, getUsers } from "@/services/userService";
import Snackbar from "@/components/shared/Snackbar";

export default function AdminUsersClient() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      return [user.name, user.email, user.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, users]);

  useEffect(() => {
    let isMounted = true;

    getUsers()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setUsers(data.users ?? []);
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

  async function handleDelete(user) {
    const label = user.email || user.name || "this user";

    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(user.id);
    setError("");

    try {
      await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
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
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Users</h1>
      </div>

      <label className="grid gap-2 rounded-lg border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-800 shadow-sm">
        <span>Search users</span>
        <span className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <input
            className="h-11 w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 text-base text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, or role"
            type="search"
            value={query}
          />
        </span>
      </label>

      <Snackbar 
        message={error} 
        onClose={() => setError("")} 
      />

      {isLoading ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-zinc-100" />
        </div>
      ) : (
        <UserTable
          deletingId={deletingId}
          onDelete={handleDelete}
          users={filteredUsers}
        />
      )}
    </main>
  );
}
