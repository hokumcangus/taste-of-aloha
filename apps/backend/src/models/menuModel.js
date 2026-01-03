const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

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

const getAllMenus = async () => {
  return await prisma.menu.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

// GET one menu item by ID
const getMenuById = async (id) => {
  return await prisma.menu.findUnique({
    where: { id: parseInt(id) }
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


// UPDATE a menu item
const updateMenu = async (id, data) => {
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
};

// DELETE a menu item
const deleteMenu = async (id) => {
  return await prisma.menu.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  mapToMenuData,
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};