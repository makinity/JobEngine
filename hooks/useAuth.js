"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function checkAuth() {
      const storedUser = localStorage.getItem("job-tracker-user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setRole(parsed.role);
        } catch (e) {
          localStorage.removeItem("job-tracker-user");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    }

    checkAuth();

    // Listen for storage changes (optional, but good for multi-tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return { user, role, isLoading };
}
