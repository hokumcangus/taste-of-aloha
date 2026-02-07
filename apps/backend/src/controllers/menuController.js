const MenuModel = require('../models/menuModel');

const getAllMenus = async (req, res) => {
  try {
    const menus = await MenuModel.getAllMenus();
    res.json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch menus' });
  }
};

exports.getAllMenus = getAllMenus;

exports.getMenuById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const menuitem = await MenuModel.getMenuById(id);
    if (!menuitem) return res.status(404).json({ message: 'MenuItem not found' });
    res.json(menuitem);
  } catch (error) {
    console.error('Error fetching menuitem:', error);
    res.status(500).json({ message: 'Error fetching menuitem', error: error.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const newMenuItem = await MenuModel.createMenu(req.body);
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Error creating menuitem:', error);
    res.status(500).json({ message: 'Error creating menuitem', error: error.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedMenuItem = await MenuModel.updateMenu(id, req.body);
    if (!updatedMenuItem) return res.status(404).json({ message: 'MenuItem not found' });
    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menuitem:', error);
    res.status(500).json({ message: 'Error updating menuitem', error: error.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await MenuModel.deleteMenu(id);
    if (!deleted) return res.status(404).json({ message: 'MenuItem not found' });
    res.json({ message: 'MenuItem deleted' });
  } catch (error) {
    console.error('Error deleting menuitem:', error);
    res.status(500).json({ message: 'Error deleting menuitem', error: error.message });
  }
};
