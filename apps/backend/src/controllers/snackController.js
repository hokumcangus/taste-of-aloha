const Snack = require('../models/snackModel');

// GET all snacks
exports.getAllSnacks = (req, res) => {
  const snacks = Snack.getAll();
  res.json(snacks);
};

// POST new snack
exports.createSnack = (req, res) => {
  const newSnack = Snack.create(req.body);
  res.status(201).json(newSnack);
};
