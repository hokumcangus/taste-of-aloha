require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

function mapToCartData(cartItem) {
  return {
    id : cartItem.id,
    userId : cartItem.userId,
    items: cartItem.items || [],
    total: cartItem.total !== undefined ? Number(cartItem.total) : 0,
    itemCount: cartItem.itemCount !== undefined ? Number(cartItem.itemCount) : 0,
    createdAt: cartItem.createdAt || new Date(),
    updatedAt: cartItem.updatedAt || new Date(),
  };
}

const getAllCarts = async () => {
  return await prisma.cart.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

// GET one cart item by ID
const getCartById = async (id) => {
  return await prisma.cart.findUnique({
    where: { id: parseInt(id) }
  });
};

// CREATE a new cart item
const createCart = async (data) => {
  return await prisma.cart.create({
    data: {
        id: data.id,
        userId: data.userId,
        items: data.items || [],
        total: parseFloat(data.total) || 0,
        itemCount: parseInt(data.itemCount) || 0,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
    }
  });
};

// UPDATE a cart item
const updateCart = async (id, data) => {
  return await prisma.cart.update({
    where: { id: parseInt(id) },
    data: {
        id: data.id || undefined,
        userId: data.userId || undefined,
        items: data.items || undefined,
        total: data.total !== undefined ? parseFloat(data.total) : undefined,
        itemCount: data.itemCount !== undefined ? parseInt(data.itemCount) : undefined,
        createdAt: data.createdAt || undefined,
        updatedAt: data.updatedAt || undefined,
    }
  });
};

// DELETE a cart item
const deleteCart = async (id) => {
  return await prisma.cart.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  mapToCartData,
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};