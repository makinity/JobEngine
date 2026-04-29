export default function Input({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-800">
      <span>{label}</span>
      <input
        className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
        {...props}
      />
    </label>
  );
}
