import apiClient from "./api";

export const orderService = {
  getOrders: async () => {
    return apiClient.get("/api/orders");
  },

  placeOrder: async (payload) => {
    return apiClient.post("/api/orders", payload);
  },
};
