const express = require('express');
const router = express.Router();
const snackController = require('../controllers/snackController');

// GET all snacks
router.get('/', snackController.getAllSnacks);

// POST new snack
router.post('/', snackController.createSnack);

module.exports = router;
