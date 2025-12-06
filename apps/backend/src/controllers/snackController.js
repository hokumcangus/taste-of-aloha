const Snack = require('../models/snackModel');

exports.getAllSnacks = (req, res) => {
  res.json(Snack.getAll());
};

exports.getSnackById = (req, res) => {
  const id = parseInt(req.params.id);
  const snack = Snack.getById(id);
  if (!snack) return res.status(404).json({ message: 'Snack not found' });
  res.json(snack);
};

exports.createSnack = (req, res) => {
  const newSnack = Snack.create(req.body);
  res.status(201).json(newSnack);
};

exports.updateSnack = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedSnack = Snack.updateById(id, req.body);
  if (!updatedSnack) return res.status(404).json({ message: 'Snack not found' });
  res.json(updatedSnack);
};

exports.deleteSnack = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = Snack.deleteById(id);
  if (!deleted) return res.status(404).json({ message: 'Snack not found' });
  res.json({ message: 'Snack deleted' });
};
