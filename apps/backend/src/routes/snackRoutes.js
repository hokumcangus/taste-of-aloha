const express = require('express');
const router = express.Router();
const snackController = require('../controllers/snackController');

router.get('/', snackController.getAllSnacks);
router.get('/:id', snackController.getSnackById);
router.post('/', snackController.createSnack);
router.put('/:id', snackController.updateSnack);
router.delete('/:id', snackController.deleteSnack);

module.exports = router;
