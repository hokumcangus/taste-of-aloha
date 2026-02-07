require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

function mapToMenuData(menuItem) {
  return {
    name: menuItem.name,
    description: menuItem.description || '',
    price: menuItem.price !== undefined ? Number(menuItem.price) : 0,
    image: menuItem.image || null,
    category: menuItem.category || 'General',
    isAvailable: menuItem.isAvailable !== undefined ? Boolean(menuItem.isAvailable) : true,
  };
}

const SNACK_CATEGORY = 'Snack';

const getAllMenus = async () => {
  return await prisma.menu.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const getAllSnacks = async () => {
  return await prisma.menu.findMany({
    where: { category: SNACK_CATEGORY },
    orderBy: { createdAt: 'desc' },
  });
};

// GET one menu item by ID
const getMenuById = async (id) => {
  return await prisma.menu.findUnique({
    where: { id: parseInt(id) }
  });
};

// GET one snack item by ID
const getSnackById = async (id) => {
  return await prisma.menu.findFirst({
    where: { id: parseInt(id), category: SNACK_CATEGORY }
  });
};

// CREATE a new menu item
const createMenu = async (data) => {
  return await prisma.menu.create({
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      image: data.image || null,
      isAvailable: data.isAvailable !== false  // Default to true
    }
  });
};

// CREATE a new snack item
const createSnack = async (data) => {
  return await prisma.menu.create({
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: SNACK_CATEGORY,
      image: data.image || null,
      isAvailable: data.isAvailable !== false  // Default to true
    }
  });
};

// UPDATE a menu item
const updateMenu = async (id, data) => {
  try {
    return await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name || undefined,
        description: data.description || undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        category: data.category || undefined,
        image: data.image || undefined,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : undefined
      }
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

// UPDATE a snack item
const updateSnack = async (id, data) => {
  try {
    return await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name || undefined,
        description: data.description || undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        category: SNACK_CATEGORY,  // Ensure category stays as 'Snack'
        image: data.image || undefined,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : undefined
      }
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

// DELETE a menu item
const deleteMenu = async (id) => {
  try {
    await prisma.menu.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
};

// DELETE a snack item
const deleteSnack = async (id) => {
  try {
    await prisma.menu.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
};

module.exports = {
  mapToMenuData,
  getAllMenus,
  getAllSnacks,
  getMenuById,
  getSnackById,
  createMenu,
  createSnack,
  updateMenu,
  updateSnack,
  deleteMenu,
  deleteSnack,
};