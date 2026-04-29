export default function Button({ children, type = "button", ...props }) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
