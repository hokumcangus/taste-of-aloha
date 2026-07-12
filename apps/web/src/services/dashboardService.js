import apiClient from "./api";

export const dashboardService = {
  getMyDashboard: async () => {
    return apiClient.get("/api/dashboard/me");
  },

  getDriverDashboard: async () => {
    return apiClient.get("/api/dashboard/driver");
  },

  getAdminDashboard: async () => {
    return apiClient.get("/api/dashboard/admin");
  },
};
