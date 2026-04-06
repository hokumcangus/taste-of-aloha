import apiClient from './api.js';

/**
 * Menu API service
 * Handles all API calls related to menus
 */

export const menuService = {
    /**
     * Get all menu items
     * @returns {Promise<Array>} Array of menu items
     */
    getAllMenus: async () => {
        return apiClient.get('/api/menu');
    },
    /**
    * Get menu by ID
    * @param {number} id - Menu ID
    * @returns {Promise<Object>} Menu object
     * */
    getMenuById: async (id) => {
        return apiClient.get(`/api/menu/${id}`);
    }, 
    /**
     * Create a new menu item
    * @param {Object} menuData - Menu data (name, price, etc.)
     * @returns {Promise<Object>} Created menu item object
     */
    createMenu: async (menuData) => {
        return apiClient.post('/api/menu', menuData);
    },  
    /**
     * Update a menu item
    * @param {number} id - Menu ID
    * @param {Object} menuData - Updated menu data
     * @returns {Promise<Object>} Updated menu item object
     */
    updateMenu: async (id, menuData) => {
        return apiClient.put(`/api/menu/${id}`, menuData);
    },
    /**
     * Delete a menu item
    * @param {number} id - Menu ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    deleteMenu: async (id) => {
        return apiClient.delete(`/api/menu/${id}`);
    },
}