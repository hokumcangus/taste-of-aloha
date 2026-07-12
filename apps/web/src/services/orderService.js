import apiClient from "./api.js";

export const orderService = {
  list: async (params = "") => apiClient.get(`/api/orders${params}`),
  getById: async (id) => apiClient.get(`/api/orders/${id}`),
  transition: async (id, status, note) =>
    apiClient.patch(`/api/orders/${id}/status`, { status, note }),
  kitchenQueue: async () => apiClient.get("/api/orders/kitchen/queue"),
  assignDriver: async (id, driverId) =>
    apiClient.post(`/api/orders/${id}/assign-driver`, { driverId }),
  pushLocation: async (id, location) =>
    apiClient.post(`/api/orders/${id}/driver/location`, location),
};
