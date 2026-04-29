import {
  isMissingApplicationsUserId,
  jsonError,
  missingApplicationsUserIdError,
  validationError,
} from "@/lib/apiErrors";
import { requireAuth } from "@/lib/serverSupabase";
import { applicationSchema, normalizeApplication } from "@/lib/validation";

export async function GET(request) {
  const auth = await requireAuth(request);

  if (auth.error) {
    return auth.error;
  }

  let query = auth.supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (auth.role !== "admin") {
    query = query.eq("user_id", auth.user.id);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingApplicationsUserId(error)) {
      return missingApplicationsUserIdError();
    }

    return jsonError("Failed to fetch applications.", 500, error.message);
  }

  return Response.json({ applications: data ?? [] });
}

export async function POST(request) {
  const auth = await requireAuth(request);

  if (auth.error) {
    return auth.error;
  }

  const body = await request.json().catch(() => null);
  const parsed = applicationSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const payload = {
    ...normalizeApplication(parsed.data),
    user_id: auth.user.id,
  };

  const { data, error } = await auth.supabase
    .from("applications")
    .insert([{ ...body, user_id: auth.user.id }])
    .select()
    .single();

  if (error) {
    if (isMissingApplicationsUserId(error)) {
      return missingApplicationsUserIdError();
    }

    return jsonError("Failed to create application.", 500, error.message);
  }

  return Response.json({ application: data }, { status: 201 });
}
