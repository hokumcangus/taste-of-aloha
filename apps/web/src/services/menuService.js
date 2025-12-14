import apiClient from './api.js';

/**
 * Menu API service
 * Handles all API calls related to menu items
 */
export const menuService = {
  /**
   * Get all menu items
   * @returns {Promise<Array>} Array of menu items
   */
  getAllMenuItems: async () => {
    return apiClient.get('/api/menu');
  },

  /**
   * Get menu item by ID
   * @param {number} id - Menu item ID
   * @returns {Promise<Object>} Menu item object
   */
  getMenuItemById: async (id) => {
    return apiClient.get(`/api/menu/${id}`);
  },

  /**
   * Create a new menu item
   * @param {Object} menuItemData - Menu item data (name, price, etc.)
   * @returns {Promise<Object>} Created menu item object
   */
  createMenuItem: async (menuItemData) => {
    return apiClient.post('/api/menu', menuItemData);
  },

  /**
   * Update a menu item
   * @param {number} id - Menu item ID
   * @param {Object} menuItemData - Updated menu item data
   * @returns {Promise<Object>} Updated menu item object
   */
  updateMenuItem: async (id, menuItemData) => {
    return apiClient.put(`/api/menu/${id}`, menuItemData);
  },

  /**
   * Delete a menu item
   * @param {number} id - Menu item ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteMenuItem: async (id) => {
    return apiClient.delete(`/api/menu/${id}`);
  },
};

