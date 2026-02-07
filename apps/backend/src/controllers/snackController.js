const MenuModel = require('../models/menuModel');

exports.getAllSnacks = async (req, res) => {
  try {
    const snacks = await MenuModel.getAllSnacks();
    res.json(snacks);
  } catch (error) {
    console.error('Error fetching snacks:', error);
    res.status(500).json({ message: 'Error fetching snacks', error: error.message });
  }
};

exports.getSnackById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const snack = await MenuModel.getSnackById(id);
    if (!snack) return res.status(404).json({ message: 'Snack not found' });
    res.json(snack);
  } catch (error) {
    console.error('Error fetching snack:', error);
    res.status(500).json({ message: 'Error fetching snack', error: error.message });
  }
};

exports.createSnack = async (req, res) => {
  try {
    const newSnack = await MenuModel.createSnack(req.body);
    res.status(201).json(newSnack);
  } catch (error) {
    console.error('Error creating snack:', error);
    res.status(500).json({ message: 'Error creating snack', error: error.message });
  }
};

exports.updateSnack = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedSnack = await MenuModel.updateSnack(id, req.body);
    if (!updatedSnack) return res.status(404).json({ message: 'Snack not found' });
    res.json(updatedSnack);
  } catch (error) {
    console.error('Error updating snack:', error);
    res.status(500).json({ message: 'Error updating snack', error: error.message });
  }
};

exports.deleteSnack = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await MenuModel.deleteSnack(id);
    if (!deleted) return res.status(404).json({ message: 'Snack not found' });
    res.json({ message: 'Snack deleted' });
  } catch (error) {
    console.error('Error deleting snack:', error);
    res.status(500).json({ message: 'Error deleting snack', error: error.message });
  }
};
