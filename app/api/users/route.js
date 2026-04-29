import { jsonError } from "@/lib/apiErrors";
import { requireAdmin } from "@/lib/serverSupabase";

export async function GET(request) {
  const auth = await requireAdmin(request);

  if (auth.error) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message?.includes("Could not find the table")) {
      return Response.json({
        users: [],
        setupRequired: "Create public.users using the SQL in README.md.",
      });
    }

    return jsonError("Failed to fetch users.", 500, error.message);
  }

  return Response.json({ users: data ?? [] });
}
