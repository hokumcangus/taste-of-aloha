import apiClient from './api.js';

/**
 * MenuItem API service
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
   * Get menuItem by ID
   * @param {number} id - MenuItem ID
   * @returns {Promise<Object>} MenuItem object
   */
  getSnackById: async (id) => {
    return apiClient.get(`/api/snacks/${id}`);
  },

  /**
   * Create a new menuItem
   * @param {Object} snackData - MenuItem data (name, price, etc.)
   * @returns {Promise<Object>} Created menuItem object
   */
  createSnack: async (snackData) => {
    return apiClient.post('/api/snacks', snackData);
  },

  /**
   * Update a menuItem
   * @param {number} id - MenuItem ID
   * @param {Object} snackData - Updated menuItem data
   * @returns {Promise<Object>} Updated menuItem object
   */
  updateSnack: async (id, snackData) => {
    return apiClient.put(`/api/snacks/${id}`, snackData);
  },

  /**
   * Delete a menuItem
   * @param {number} id - MenuItem ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteSnack: async (id) => {
    return apiClient.delete(`/api/snacks/${id}`);
  },
};

