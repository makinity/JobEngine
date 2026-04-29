"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, LogIn, UserPlus } from "lucide-react";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { supabase } from "@/lib/supabaseClient";

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function getRedirectPath(userId) {
    console.log("Fetching role for user:", userId);
    const { data, error } = await supabase
      .from("users")
      .select("role, email")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user role:", error);
      return "/dashboard";
    }

    console.log("User data from table:", data);

    if (data?.role === "admin") {
      return "/admin";
    }
    
    return "/dashboard";
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("job-tracker-user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      } catch (e) {
        localStorage.removeItem("job-tracker-user");
      }
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      if (isRegister) {
        // We'll stick to your table for registration too
        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (existing) {
          throw new Error("User already exists.");
        }

        const newUser = {
          id: crypto.randomUUID(),
          email,
          name,
          password,
          role: "user",
        };

        const { error: signUpError } = await supabase.from("users").insert(newUser);

        if (signUpError) throw signUpError;

        localStorage.setItem("job-tracker-user", JSON.stringify(newUser));
        router.replace("/dashboard");
        return;
      }

      // Manual Login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let result;
      const text = await response.text();
      
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", text);
        throw new Error("The server returned an unexpected response. This usually happens when the API crashes or is misconfigured.");
      }

      if (!response.ok) {
        throw new Error(result.error || result.message || "Login failed");
      }

      // Store session in localStorage
      localStorage.setItem("job-tracker-user", JSON.stringify(result.user));
      
      // Also set cookie for middleware
      document.cookie = `job-tracker-user=${JSON.stringify(result.user)}; path=/; max-age=86400; SameSite=Lax`;

      if (result.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center bg-zinc-50 px-4 py-10 sm:px-6">
      <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="hidden lg:block">
          <div className="inline-flex size-12 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <BriefcaseBusiness size={24} />
          </div>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight text-zinc-950">
            Keep every job application organized.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600">
            Sign in to manage applications, update statuses, and review your
            pipeline from one clean dashboard.
          </p>
        </div>

        <form
          className="grid gap-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
          onSubmit={handleSubmit}
        >
          <div>
            <div className="inline-flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white lg:hidden">
              <BriefcaseBusiness size={20} />
            </div>
            <p className="mt-4 text-sm font-medium uppercase tracking-wide text-emerald-700">
              Job Tracker
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950">
              {isRegister ? "Create account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              {isRegister
                ? "Register to start tracking your job applications."
                : "Log in to continue to your dashboard."}
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {isRegister && (
            <Input
              autoComplete="name"
              label="Name"
              name="name"
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          )}

          <Input
            autoComplete="email"
            label="Email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />

          <Input
            autoComplete={isRegister ? "new-password" : "current-password"}
            label="Password"
            minLength={6}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />

          <Button disabled={isLoading} type="submit">
            {isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
            {isLoading
              ? isRegister
                ? "Creating..."
                : "Signing in..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </Button>

          <p className="text-center text-sm text-zinc-600">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              className="font-medium text-zinc-950 hover:underline"
              href={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Sign in" : "Register"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
