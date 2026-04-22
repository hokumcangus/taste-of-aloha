import apiClient from "./api.js";

export const cartService = {
  getCartById: async (id) => {
    return apiClient.get(`/api/cart/${id}`);
  },

  createCart: async (cartData) => {
    return apiClient.post("/api/cart", cartData);
  },

  updateCart: async (id, cartData) => {
    return apiClient.put(`/api/cart/${id}`, cartData);
  },

  deleteCart: async (id) => {
    return apiClient.delete(`/api/cart/${id}`);
  },
};
