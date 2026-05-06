import apiClient from "./api";

export const dashboardService = {
  getMyDashboard: async () => {
    return apiClient.get("/api/dashboard/me");
  },

  getAdminDashboard: async () => {
    return apiClient.get("/api/dashboard/admin");
  },
};
