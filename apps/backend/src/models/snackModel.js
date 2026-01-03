require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function getAll() {
  return prisma.menu.findMany({ orderBy: { createdAt: 'desc' } });
}

async function getById(id) {
  return prisma.menu.findUnique({ where: { id } });
}

async function create(snack) {
  return prisma.menu.create({
    data: {
      name: snack.name,
      description: snack.description || '',
      price: snack.price !== undefined ? Number(snack.price) : 0,
      image: snack.image || null,
      category: snack.category || 'General',
      isAvailable: snack.isAvailable !== undefined ? Boolean(snack.isAvailable) : true,
    },
  });
}

async function updateById(id, updatedSnack) {
  try {
    return await prisma.menu.update({
      where: { id },
      data: {
        name: updatedSnack.name,
        description: updatedSnack.description,
        price: updatedSnack.price ? Number(updatedSnack.price) : undefined,
        category: updatedSnack.category,
        image: updatedSnack.image,
        isAvailable: updatedSnack.isAvailable,
      },
    });
  } catch (err) {
    if (err.code === 'P2025') return null;
    throw err;
  }
}

async function deleteById(id) {
  try {
    await prisma.menu.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err.code === 'P2025') return false;
    throw err;
  }
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
