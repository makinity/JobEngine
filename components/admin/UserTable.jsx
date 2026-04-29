import { Trash2 } from "lucide-react";

export default function UserTable({ deletingId, onDelete, users = [] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {users.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-zinc-500" colSpan="4">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-4 font-medium text-zinc-950">
                  {user.name || "Unnamed"}
                </td>
                <td className="px-4 py-4 text-zinc-600">{user.email}</td>
                <td className="px-4 py-4 text-zinc-600">
                  {user.role || "user"}
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={deletingId === user.id}
                    onClick={() => onDelete(user)}
                    type="button"
                  >
                    <Trash2 size={15} />
                    {deletingId === user.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
