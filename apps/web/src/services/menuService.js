import apiClient from './api.js';

/**
 * Snack API service
 * Handles all API calls related to snacks
 */
export const snackService = {
  /**
   * Get all snacks
   * @returns {Promise<Array>} Array of snacks
   */
  getAllSnacks: async () => {
    return apiClient.get('/api/snacks');
  },

  /**
   * Get snack by ID
   * @param {number} id - Snack ID
   * @returns {Promise<Object>} Snack object
   */
  getSnackById: async (id) => {
    return apiClient.get(`/api/snacks/${id}`);
  },

  /**
   * Create a new snack
   * @param {Object} snackData - Snack data (name, price, etc.)
   * @returns {Promise<Object>} Created snack object
   */
  createSnack: async (snackData) => {
    return apiClient.post('/api/snacks', snackData);
  },

  /**
   * Update a snack
   * @param {number} id - Snack ID
   * @param {Object} snackData - Updated snack data
   * @returns {Promise<Object>} Updated snack object
   */
  updateSnack: async (id, snackData) => {
    return apiClient.put(`/api/snacks/${id}`, snackData);
  },

  /**
   * Delete a snack
   * @param {number} id - Snack ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteSnack: async (id) => {
    return apiClient.delete(`/api/snacks/${id}`);
  },
};

