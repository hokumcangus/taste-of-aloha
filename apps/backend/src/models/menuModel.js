const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Map legacy "menuItem" shape onto Prisma Menu table
export const mapToMenuData = (menuItem) => ({
  name: menuItem.name,
  description: menuItem.description || '',
  price: menuItem.price !== undefined ? Number(menuItem.price) : 0,
  image: menuItem.image || null,
  category: menuItem.category || 'General',
  isAvailable: menuItem.isAvailable !== undefined ? Boolean(menuItem.isAvailable) : true,
});

exports.getAll = async () => {
  return prisma.menu.findMany({ orderBy: { createdAt: 'desc' } });
};

exports.getById = async (id) => {
  return prisma.menu.findUnique({ where: { id } });
};

exports.create = async (menuItem) => {
  return prisma.menu.create({ data: mapToMenuData(menuItem) });
};

exports.updateById = async (id, updatedmenuItem) => {
  try {
    return await prisma.menu.update({ where: { id }, data: mapToMenuData(updatedmenuItem) });
  } catch (err) {
    if (err.code === 'P2025') return null; // record not found
    throw err;
  }
};

exports.deleteById = async (id) => {
  try {
    await prisma.menu.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err.code === 'P2025') return false;
    throw err;
  }
};
