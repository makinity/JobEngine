import JobForm from "@/components/user/JobForm";

export default function AddJobPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Applications
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Add job</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Capture the essentials now. You can update status and notes later.
        </p>
      </div>
      <JobForm />
    </main>
  );
}
