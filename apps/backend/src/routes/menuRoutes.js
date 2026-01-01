import express from 'express';
import menuController from '../controllers/menuController.js';

const router = express.Router();

// GET all menu items
router.get('/', menuController.getAllMenuItems);

// GET one menu item by ID
router.get('/:id', menuController.getMenuItemById);

// CREATE a new menu item
router.post('/', menuController.createMenuItem);

// UPDATE a menu item
router.put('/:id', menuController.updateMenuItem);

// DELETE a menu item
router.delete('/:id', menuController.deleteMenuItem);

export default router;