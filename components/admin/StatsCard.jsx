export default function StatsCard({ icon: Icon, label, value }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <strong className="mt-3 block text-3xl font-semibold text-zinc-950">
            {value}
          </strong>
        </div>
        {Icon && (
          <span className="inline-flex size-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
            <Icon size={18} />
          </span>
        )}
      </div>
    </section>
  );
}
