let menuItems = [];

exports.getAll = () => menuItems;

exports.getById = (id) => menuItems.find(item => item.id === id);

exports.create = (item) => {
  const newItem = { id: menuItems.length + 1, ...item };
  menuItems.push(newItem);
  return newItem;
};

exports.updateById = (id, updatedItem) => {
  const index = menuItems.findIndex(item => item.id === id);
  if (index === -1) return null;
  menuItems[index] = { ...menuItems[index], ...updatedItem };
  return menuItems[index];
};

exports.deleteById = (id) => {
  const index = menuItems.findIndex(item => item.id === id);
  if (index === -1) return false;
  menuItems.splice(index, 1);
  return true;
};
