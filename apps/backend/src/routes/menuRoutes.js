const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menu - Get all menu items
router.get('/', menuController.getAllMenuItems);

module.exports = router;
