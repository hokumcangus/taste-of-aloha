const Snack = require('../models/snackModel');

exports.getAllSnacks = async (req, res) => {
  try {
    const snacks = await Snack.getAll();
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch snacks', error: err.message });
  }
};

exports.getSnackById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const snack = await Snack.getById(id);
    if (!snack) return res.status(404).json({ message: 'Snack not found' });
    res.json(snack);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch snack', error: err.message });
  }
};

exports.createSnack = async (req, res) => {
  try {
    const newSnack = await Snack.create(req.body);
    res.status(201).json(newSnack);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create snack', error: err.message });
  }
};

exports.updateSnack = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedSnack = await Snack.updateById(id, req.body);
    if (!updatedSnack) return res.status(404).json({ message: 'Snack not found' });
    res.json(updatedSnack);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update snack', error: err.message });
  }
};

exports.deleteSnack = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await Snack.deleteById(id);
    if (!deleted) return res.status(404).json({ message: 'Snack not found' });
    res.json({ message: 'Snack deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete snack', error: err.message });
  }
};
