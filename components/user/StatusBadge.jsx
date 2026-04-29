export default function StatusBadge({ status }) {
  const styles = {
    Applied: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Interview: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Offer: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Rejected: "bg-red-50 text-red-700 ring-red-600/20",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] ?? "bg-zinc-50 text-zinc-700 ring-zinc-600/20"
      }`}
    >
      {status}
    </span>
  );
}
