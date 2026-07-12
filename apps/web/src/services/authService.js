import apiClient from "./api.js";

export const authService = {
  login: async (credentials) => apiClient.post("/api/auth/login", credentials),
  me: async () => apiClient.get("/api/auth/me"),
};
