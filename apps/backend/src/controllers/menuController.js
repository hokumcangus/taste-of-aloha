const MenuModel = require('../models/menuModel');

// GET all menus
const getAllMenuItems = async (req, res) => {
    try {
        const menus = await MenuModel.getAllMenus();
        res.json({
            success: true,
            count: menus.length,
            data: menus,
        });
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch menus' });
    }
};

module.exports = {
    getAllMenuItems,
};