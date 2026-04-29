import { jsonError } from "@/lib/apiErrors";
import { requireAdmin } from "@/lib/serverSupabase";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(_request);

  if (auth.error) {
    return auth.error;
  }

  const { id } = await params;
  const { error } = await auth.supabase.from("users").delete().eq("id", id);

  if (error) {
    return jsonError("Failed to delete user.", 500, error.message);
  }

  return Response.json({ success: true });
}
