const menuModel = require('../models/menuModel');

exports.getAllMenuItems = (req, res) => {
  res.json(menuModel.getAll());
};

exports.getMenuItemById = (req, res) => {
  const id = parseInt(req.params.id);
  const item = menuModel.getById(id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json(item);
};

exports.createMenuItem = (req, res) => {
  const newItem = menuModel.create(req.body);
  res.status(201).json(newItem);
};

exports.updateMenuItem = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = menuModel.updateById(id, req.body);
  if (!updatedItem) return res.status(404).json({ message: 'Menu item not found' });
  res.json(updatedItem);
};

exports.deleteMenuItem = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = menuModel.deleteById(id);
  if (!deleted) return res.status(404).json({ message: 'Menu item not found' });
  res.json({ message: 'Menu item deleted' });
};
