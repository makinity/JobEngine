import {
  isMissingApplicationsUserId,
  jsonError,
  missingApplicationsUserIdError,
  validationError,
} from "@/lib/apiErrors";
import { requireAuth } from "@/lib/serverSupabase";
import { applicationSchema, normalizeApplication } from "@/lib/validation";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(_request);

  if (auth.error) {
    return auth.error;
  }

  const { id } = await params;
  let query = auth.supabase
    .from("applications")
    .select("*")
    .eq("id", id);

  if (auth.role !== "admin") {
    query = query.eq("user_id", auth.user.id);
  }

  const { data, error } = await query.single();

  if (error) {
    if (isMissingApplicationsUserId(error)) {
      return missingApplicationsUserIdError();
    }

    return jsonError("Application not found.", 404);
  }

  return Response.json({ application: data });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);

  if (auth.error) {
    return auth.error;
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = applicationSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  let query = auth.supabase
    .from("applications")
    .update(normalizeApplication(parsed.data))
    .eq("id", id);

  if (auth.role !== "admin") {
    query = query.eq("user_id", auth.user.id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    if (isMissingApplicationsUserId(error)) {
      return missingApplicationsUserIdError();
    }

    return jsonError("Failed to update application.", 404, error.message);
  }

  return Response.json({ application: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(_request);

  if (auth.error) {
    return auth.error;
  }

  const { id } = await params;
  let query = auth.supabase.from("applications").delete().eq("id", id);

  if (auth.role !== "admin") {
    query = query.eq("user_id", auth.user.id);
  }

  const { error } = await query;

  if (error) {
    if (isMissingApplicationsUserId(error)) {
      return missingApplicationsUserIdError();
    }

    return jsonError("Failed to delete application.", 500, error.message);
  }

  return Response.json({ success: true });
}
