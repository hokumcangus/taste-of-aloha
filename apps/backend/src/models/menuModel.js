
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' });

const prisma = new PrismaClient();

// GET all menu items
const getAllMenuItems = async () => {
  return await prisma.menu.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

// GET menu item by ID
const getMenuItemById = async (id) => {
  return await prisma.menu.findUnique({
    where: { id: parseInt(id) },
  });
};

// CREATE a new menu item
const createMenuItem = async (menuItemData) => {
  return await prisma.menu.create({
    data: {
      name: menuItemData.name,
      description: menuItemData.description,
      price: parseFloat(menuItemData.price),
      category: menuItemData.category,
      image: menuItemData.image || null,
      isAvailable: menuItemData.isAvailable !== false
    }
  });
};

// UPDATE a menu item
const updateMenuItem = async (id, menuItemData) => {
  return await prisma.menu.update({
    where: { id: parseInt(id) },
    data: {
      name: menuItemData.name || undefined,
      description: menuItemData.description || undefined,
      price: menuItemData.price ? parseFloat(menuItemData.price) : undefined,
      category: menuItemData.category || undefined,
      image: menuItemData.image || undefined,
      isAvailable: menuItemData.isAvailable !== undefined ? menuItemData.isAvailable : undefined
    }
  });
};

// DELETE a menu item
const deleteMenuItem = async (id) => {
  return await prisma.menu.delete({
    where: { id: parseInt(id) }
  });
};

export default {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};