// Temporary in-memory model
let snacks = [];

exports.getAll = () => snacks;

exports.create = (snack) => {
  const newSnack = { id: snacks.length + 1, ...snack };
  snacks.push(newSnack);
  return newSnack;
};
