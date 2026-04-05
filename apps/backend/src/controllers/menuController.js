const MenuModel = require('../models/menuModel');

const SNACK_CATEGORY = 'Snacks';
const LEGACY_SNACK_CATEGORY = 'Snack';

const isSnackCategory = (category) =>
  typeof category === 'string' &&
  [SNACK_CATEGORY.toLowerCase(), LEGACY_SNACK_CATEGORY.toLowerCase()].includes(category.toLowerCase());

const normalizeSnackCategory = (category) =>
  isSnackCategory(category) ? SNACK_CATEGORY : category;

// GET all menus (optional category filter)
const getAllMenus = async (req, res) => {
  try {
    const { category } = req.query;
    // normalizeSnackCategory canonicalizes legacy 'Snack' → 'Snacks' before querying,
    // ensuring both spellings always resolve to the same DB category.
    const menus = category
      ? await MenuModel.getMenusByCategory(normalizeSnackCategory(String(category)))
      : await MenuModel.getAllMenus();

    res.json(menus);
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
    payload.category = normalizeSnackCategory(payload.category);

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
    payload.category = normalizeSnackCategory(payload.category);

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