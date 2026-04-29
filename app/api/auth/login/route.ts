import { supabase } from "@/lib/supabaseClient";
import { jsonError } from "@/lib/apiErrors";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { email, password } = body || {};

    if (!email || !password) {
      return jsonError("Email and password are required.", 400);
    }

    // 1. Check for Supabase configuration
    if (!supabase) {
      return jsonError("Supabase environment variables are missing. Please check your configuration.", 500);
    }

    // 2. Check the public.users table for the user and password
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, role, password, name")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Login Error:", error);
      return jsonError("Database error during login.", 500, error.message);
    }

    if (!user) {
      return jsonError("Invalid email or password", 401);
    }

    // 2. Verify the password (using plaintext as seen in your screenshot)
    // NOTE: In a real app, you should use hashing (e.g. bcrypt)
    if (user.password !== password) {
      return jsonError("Invalid login credentials", 401);
    }

    // 3. Success! Return the user data (excluding the password)
    const { password: _, ...userWithoutPassword } = user;
    
    console.log("Login successful for:", userWithoutPassword.email, "ID:", userWithoutPassword.id);

    return new Response(
      JSON.stringify({
        user: userWithoutPassword,
        message: "Login successful"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err: any) {
    console.error("CRITICAL: Server error in login API:", err);
    return jsonError("Internal server error during login.", 500, err.message);
  }
}
