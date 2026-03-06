const MenuModel = require('../models/menuModel');

const SNACK_CATEGORY = 'Snack';

const isSnackCategory = (category) =>
  typeof category === 'string' && category.toLowerCase() === SNACK_CATEGORY.toLowerCase();

// GET all menus (optional category filter)
const getAllMenus = async (req, res) => {
  try {
    const { category } = req.query;
    const menus = await MenuModel.getAllMenus();
    const filteredMenus = category
      ? menus.filter((item) => item.category?.toLowerCase() === String(category).toLowerCase())
      : menus;

    res.json(filteredMenus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menus' });
  }
};

// GET one menu item by id
const getMenuById = async (req, res) => {
  try {
    const menu = await MenuModel.getMenuById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu item' });
  }
};

// CREATE menu item
const createMenu = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (isSnackCategory(payload.category)) {
      payload.category = SNACK_CATEGORY;
    }

    const created = await MenuModel.createMenu(payload);
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create menu item', error: error.message });
  }
};

// UPDATE menu item
const updateMenu = async (req, res) => {
  try {
    const existing = await MenuModel.getMenuById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const payload = { ...req.body };
    if (isSnackCategory(payload.category)) {
      payload.category = SNACK_CATEGORY;
    }

    const updated = await MenuModel.updateMenu(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
};

// DELETE menu item
const deleteMenu = async (req, res) => {
  try {
    const existing = await MenuModel.getMenuById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuModel.deleteMenu(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};