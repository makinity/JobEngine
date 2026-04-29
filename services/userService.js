import { apiClient } from "./apiClient";

export function getUsers() {
  return apiClient("/api/users");
}

export function deleteUser(id) {
  return apiClient(`/api/users/${id}`, {
    method: "DELETE",
  });
}
