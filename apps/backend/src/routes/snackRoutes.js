const express = require('express');
const router = express.Router();
const snack = require('../controllers/snackController');

router.get('/', snack.getAllSnacks);
router.get('/:id', snack.getSnackById);
router.post('/', snack.createSnack);
router.put('/:id', snack.updateSnack);
router.delete('/:id', snack.deleteSnack);

module.exports = router;
