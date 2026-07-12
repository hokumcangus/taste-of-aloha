import apiClient from "./api";

export const orderService = {
  getOrders: async () => {
    return apiClient.get("/api/orders");
  },

  placeOrder: async (payload) => {
    return apiClient.post("/api/orders", payload);
  },

  updateOrderStatus: async (orderId, status) => {
    return apiClient.patch(`/api/orders/${orderId}/status`, { status });
  },

  assignOrderDriver: async (orderId, assignedDriverId) => {
    return apiClient.patch(`/api/orders/${orderId}/status`, { assignedDriverId });
  },
};
