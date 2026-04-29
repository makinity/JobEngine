import { supabase } from "@/lib/supabaseClient";
import { jsonError } from "@/lib/apiErrors";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const { email, password } = body || {};

  if (!email || !password) {
    return jsonError("Email and password are required.", 400);
  }

  // 1. Check the public.users table for the user and password
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, password, name")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return jsonError("Database error during login.", 500, error.message);
  }

  if (!user) {
    return jsonError("Invalid login credentials", 401);
  }

  // 2. Verify the password (using plaintext as seen in your screenshot)
  // NOTE: In a real app, you should use hashing (e.g. bcrypt)
  if (user.password !== password) {
    return jsonError("Invalid login credentials", 401);
  }

  // 3. Success! Return the user data (excluding the password)
  const { password: _, ...userWithoutPassword } = user;
  
  console.log("Login successful for:", userWithoutPassword.email, "ID:", userWithoutPassword.id);

  return Response.json({
    user: userWithoutPassword,
    message: "Login successful"
  });
}
