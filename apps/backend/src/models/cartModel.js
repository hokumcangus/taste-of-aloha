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

// CREATE a new cart
const createCart = async (data) => {
  const createData = {
    userId: data.userId,
    total: data.total !== undefined ? parseFloat(data.total) : 0,
    itemCount: data.itemCount !== undefined ? parseInt(data.itemCount) : 0,
  };

  if (Array.isArray(data.items) && data.items.length > 0) {
    createData.items = {
      create: data.items,
    };
  }

  return await prisma.cart.create({
    data: createData,
  });
};

// UPDATE a cart
const updateCart = async (id, data) => {
  const updateData = {
    userId: data.userId !== undefined ? data.userId : undefined,
    total: data.total !== undefined ? parseFloat(data.total) : undefined,
    itemCount: data.itemCount !== undefined ? parseInt(data.itemCount) : undefined,
  };

  if (Array.isArray(data.items)) {
    // Use a transaction to atomically replace all cart items
    return await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cartId: parseInt(id) } });
      return tx.cart.update({
        where: { id: parseInt(id) },
        data: {
          ...updateData,
          items: { create: data.items },
        },
      });
    });
  }

  return await prisma.cart.update({
    where: { id: parseInt(id) },
    data: updateData,
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