const MenuModel = require('../models/menuModel');

const SNACK_CATEGORY = 'Snacks';
const LEGACY_SNACK_CATEGORY = 'Snack';

const isSnackCategory = (category) =>
  typeof category === 'string' &&
  [SNACK_CATEGORY.toLowerCase(), LEGACY_SNACK_CATEGORY.toLowerCase()].includes(category.toLowerCase());

const normalizeSnackCategory = (category) =>
  isSnackCategory(category) ? SNACK_CATEGORY : category;

// GET all menu items (optional category filter)
const getAllMenuItems = async (req, res) => {
  try {
    const { category } = req.query;
    // normalizeSnackCategory canonicalizes legacy 'Snack' → 'Snacks' before querying,
    // ensuring both spellings always resolve to the same DB category.
    const menuItems = category
      ? await MenuModel.getMenuItemsByCategory(normalizeSnackCategory(String(category)))
      : await MenuModel.getAllMenuItems();

    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

// GET one menu item by id
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuModel.getMenuItemById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch menu item' });
  }
};

// CREATE menu item
const createMenuItem = async (req, res) => {
  try {
    const payload = { ...req.body };
    payload.category = normalizeSnackCategory(payload.category);

    const created = await MenuModel.createMenuItem(payload);
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create menu item', error: error.message });
  }
};

// UPDATE menu item
const updateMenuItem = async (req, res) => {
  try {
    const existing = await MenuModel.getMenuItemById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const payload = { ...req.body };
    payload.category = normalizeSnackCategory(payload.category);

    const updated = await MenuModel.updateMenuItem(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
};

// DELETE menu item
const deleteMenuItem = async (req, res) => {
  try {
    const existing = await MenuModel.getMenuItemById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuModel.deleteMenuItem(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
};

const getAllMenus = getAllMenuItems;
const getMenuById = getMenuItemById;
const createMenu = createMenuItem;
const updateMenu = updateMenuItem;
const deleteMenu = deleteMenuItem;

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};