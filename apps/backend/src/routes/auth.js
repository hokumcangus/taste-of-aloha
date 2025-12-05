const express = require('express');
const router = express.Router();
const authController = require('../controllers/snackController');

router.get('/', authController.getAllSnacks);
router.get('/:id', authController.getSnackById);
router.post('/', authController.createSnack);
router.put('/:id', authController.updateSnack);
router.delete('/:id', authController.deleteSnack);

module.exports = router;