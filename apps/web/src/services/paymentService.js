import apiClient from "./api";

export const paymentService = {
  createIntent: async (payload) => {
    return apiClient.post("/api/payments/intent", payload);
  },
};
