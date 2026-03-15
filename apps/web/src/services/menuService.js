import apiClient from './api.js';

/**
 * MenuItem API service
 * Handles all API calls related to menuitems
 */

export const menuService = {
    /**
     * Get all menuitems
     * @returns {Promise<Array>} Array of menuitems
     */
    getAllMenuItems: async () => {
        return apiClient.get('/api/menu');
    },
    /**
     * Get menuitem by ID
     * @param {number} id - MenuItem ID
     * @returns {Promise<Object>} MenuItem object
     * */
    getMenuItemById: async (id) => {
        return apiClient.get(`/api/menu/${id}`);
    }, 
    /**
     * Create a new menuitem
     * @param {Object} menuItemData - MenuItem data (name, price, etc.)
     * @returns {Promise<Object>} Created menuitem object
     */
    createMenuItem: async (menuItemData) => {
        return apiClient.post('/api/menu', menuItemData);
    },  
    /**
     * Update a menuitem
     * @param {number} id - MenuItem ID
     * @param {Object} menuItemData - Updated menuitem data
     * @returns {Promise<Object>} Updated menuitem object
     */
    updateMenuItem: async (id, menuItemData) => {
        return apiClient.put(`/api/menu/${id}`, menuItemData);
    },
    /**
     * Delete a menuitem
     * @param {number} id - MenuItem ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    deleteMenuItem: async (id) => {
        return apiClient.delete(`/api/menu/${id}`);
    },
}