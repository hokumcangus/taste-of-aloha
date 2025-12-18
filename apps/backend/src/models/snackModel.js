const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Map legacy "snack" shape onto Prisma Menu table
const mapToMenuData = (snack) => ({
  name: snack.name,
  description: snack.description || '',
  price: snack.price !== undefined ? Number(snack.price) : 0,
  image: snack.image || null,
  category: snack.category || 'General',
  isAvailable: snack.isAvailable !== undefined ? Boolean(snack.isAvailable) : true,
});

exports.getAll = async () => {
  return prisma.menu.findMany({ orderBy: { createdAt: 'desc' } });
};

exports.getById = async (id) => {
  return prisma.menu.findUnique({ where: { id } });
};

exports.create = async (snack) => {
  return prisma.menu.create({ data: mapToMenuData(snack) });
};

exports.updateById = async (id, updatedSnack) => {
  try {
    return await prisma.menu.update({ where: { id }, data: mapToMenuData(updatedSnack) });
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
