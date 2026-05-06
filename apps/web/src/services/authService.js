import apiClient from "./api";

export const authService = {
  register: async (payload) => {
    return apiClient.post("/api/auth/register", payload);
  },

  login: async (payload) => {
    return apiClient.post("/api/auth/login", payload);
  },

  me: async () => {
    return apiClient.get("/api/auth/me");
  },
};
