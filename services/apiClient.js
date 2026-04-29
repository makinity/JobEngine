import { supabase } from "@/lib/supabaseClient";

export async function apiClient(path, options) {
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("job-tracker-user") : null;
  let userId = null;
  
  if (storedUser) {
    try {
      userId = JSON.parse(storedUser).id;
    } catch (e) {}
  }

  console.log("API Request:", path, "User ID Header:", userId);

  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(userId ? { "X-User-Id": userId } : {}),
      ...options?.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Non-JSON response from:", path, "Status:", response.status, "Body preview:", text.slice(0, 100));
    throw new Error(`Server returned ${response.status} (${response.statusText}). Expected JSON but got ${contentType || "nothing"}.`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.details || data.error || `Request failed with status ${response.status}`,
    );
  }

  return data;
}
