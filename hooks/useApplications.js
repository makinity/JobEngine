"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteApplication,
  getApplications,
} from "@/services/applicationService";

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refreshApplications = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getApplications();
      setApplications(data.applications ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function removeApplication(id) {
    await deleteApplication(id);
    setApplications((current) =>
      current.filter((application) => application.id !== id),
    );
  }

  useEffect(() => {
    let isMounted = true;

    getApplications()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setApplications(data.applications ?? []);
        setError("");
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    applications,
    error,
    isLoading,
    refreshApplications,
    removeApplication,
  };
}
