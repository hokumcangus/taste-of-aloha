import menuModel from '../models/menuModel.js';
import logger from '../utils/logger.js';

// GET all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const items = await menuModel.getAllMenuItems();
    
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
};

// GET one menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await menuModel.getMenuItemById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    logger.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
};

// CREATE a new menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, price, category'
      });
    }
    
    const newItem = await menuModel.createMenuItem({
      name,
      description,
      price,
      category,
      image,
      isAvailable
    });
    
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem
    });
  } catch (error) {
    logger.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message
    });
  }
};

// UPDATE a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if menu item exists
    const item = await menuModel.getMenuItemById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    const updatedItem = await menuModel.updateMenuItem(id, updateData);
    
    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    logger.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
};

// DELETE a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if menu item exists
    const item = await menuModel.getMenuItemById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    await menuModel.deleteMenuItem(id);
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message
    });
  }
};

export default {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};