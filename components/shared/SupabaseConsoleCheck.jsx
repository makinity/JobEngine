"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseConsoleCheck() {
  useEffect(() => {
    let isMounted = true;

    async function logApplications() {
      if (!supabase) {
        console.error(
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
        );
        return;
      }

      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .limit(5);

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Supabase applications error:", error);
        return;
      }

      console.log("Supabase applications:", data);
    }

    logApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
