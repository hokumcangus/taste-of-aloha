let snacks = [];

exports.getAll = () => snacks;

exports.getById = (id) => snacks.find(snack => snack.id === id);

exports.create = (snack) => {
  const newSnack = { id: snacks.length + 1, ...snack };
  snacks.push(newSnack);
  return newSnack;
};

exports.updateById = (id, updatedSnack) => {
  const index = snacks.findIndex(snack => snack.id === id);
  if (index === -1) return null;
  snacks[index] = { ...snacks[index], ...updatedSnack };
  return snacks[index];
};

exports.deleteById = (id) => {
  const index = snacks.findIndex(snack => snack.id === id);
  if (index === -1) return false;
  snacks.splice(index, 1);
  return true;
};
