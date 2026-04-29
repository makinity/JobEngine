import { apiClient } from "./apiClient";

export function getApplications() {
  return apiClient("/api/applications");
}

export function getApplication(id) {
  return apiClient(`/api/applications/${id}`);
}

export function createApplication(application) {
  return apiClient("/api/applications", {
    method: "POST",
    body: JSON.stringify(application),
  });
}

export function updateApplication(id, application) {
  return apiClient(`/api/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(application),
  });
}

export function deleteApplication(id) {
  return apiClient(`/api/applications/${id}`, {
    method: "DELETE",
  });
}
