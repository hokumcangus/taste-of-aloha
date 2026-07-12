import apiClient from "./api";

export const notificationService = {
  getMyNotifications: async (limit = 30) => {
    return apiClient.get(`/api/notifications?limit=${limit}`);
  },

  markRead: async (notificationId) => {
    return apiClient.patch(`/api/notifications/${notificationId}/read`, {});
  },

  markAllRead: async () => {
    return apiClient.patch("/api/notifications/read-all", {});
  },
};
