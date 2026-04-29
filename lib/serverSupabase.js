import { createClient } from "@supabase/supabase-js";
import { jsonError } from "./apiErrors";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getBearerToken(request) {
  const authorization = request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice("Bearer ".length).trim();
}

export function createServerSupabase(token) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const options = {
    auth: {
      persistSession: false,
    },
  };

  if (token) {
    options.global = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
}

export async function requireAuth(request) {
  const userId = request.headers.get("X-User-Id");

  console.log("Server Auth Check. Incoming X-User-Id:", userId);

  // Use the anon client (passing null to avoid empty Authorization headers)
  const supabase = createServerSupabase(null); 

  if (!supabase) {
    console.error("Supabase not configured in requireAuth");
    return { error: jsonError("Supabase is not configured.", 500) };
  }

  // Fetch user from the public.users table
  const { data: profile, error } = await supabase
    .from("users")
    .select("id, email, role, name")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("CRITICAL: Database error in requireAuth:", error.message, error.details);
    return { error: jsonError(`Database error: ${error.message}`, 500) };
  }

  if (!profile) {
    console.warn("CRITICAL: No user found for ID:", userId);
    // Let's also check if ANY user exists with this ID but different column names
    const { data: anyUser } = await supabase.from("users").select("count").eq("id", userId);
    console.log("Check if ID exists at all:", anyUser);
    
    return { error: jsonError(`Session invalid. ID ${userId} not found in database.`, 401) };
  }

  console.log("User authorized:", profile.email, "Role:", profile.role);

  return {
    supabase,
    user: profile,
    role: profile.role || "user",
  };
}

export async function requireAdmin(request) {
  const auth = await requireAuth(request);

  if (auth.error) {
    return auth;
  }

  if (auth.role !== "admin") {
    return {
      error: jsonError("You do not have permission to access this resource.", 403),
    };
  }

  return auth;
}
