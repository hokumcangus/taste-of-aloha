import apiClient from './api.js';

/**
 * MenuItem API service
 * Handles all API calls related to menuitems
 */
export const snackService = {
  /**
   * Get all menuitems
   * @returns {Promise<Array>} Array of menuitems
   */
  getAllSnacks: async () => {
    return apiClient.get('/api/menuitems');
  },

  /**
   * Get menuItem by ID
   * @param {number} id - MenuItem ID
   * @returns {Promise<Object>} MenuItem object
   */
  getSnackById: async (id) => {
    return apiClient.get(`/api/menuitems/${id}`);
  },

  /**
   * Create a new menuItem
   * @param {Object} snackData - MenuItem data (name, price, etc.)
   * @returns {Promise<Object>} Created menuItem object
   */
  createSnack: async (snackData) => {
    return apiClient.post('/api/menuitems', snackData);
  },

  /**
   * Update a menuItem
   * @param {number} id - MenuItem ID
   * @param {Object} snackData - Updated menuItem data
   * @returns {Promise<Object>} Updated menuItem object
   */
  updateSnack: async (id, snackData) => {
    return apiClient.put(`/api/menuitems/${id}`, snackData);
  },

  /**
   * Delete a menuItem
   * @param {number} id - MenuItem ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteSnack: async (id) => {
    return apiClient.delete(`/api/menuitems/${id}`);
  },
};

