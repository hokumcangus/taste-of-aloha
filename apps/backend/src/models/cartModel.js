require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

class CartValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "CartValidationError";
    this.statusCode = 400;
  }
}

function parseId(value, fieldName) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new CartValidationError(`Invalid ${fieldName}`);
  }
  return parsed;
}

function normalizeItems(items) {
  if (!Array.isArray(items)) {
    throw new CartValidationError("Cart items must be an array");
  }

  const merged = new Map();

  for (const item of items) {
    const menuId = parseId(item.menuId, "menuId");
    const quantity = parseInt(item.quantity, 10);

    if (Number.isNaN(quantity) || quantity <= 0) {
      throw new CartValidationError("Each item quantity must be a positive integer");
    }

    merged.set(menuId, (merged.get(menuId) || 0) + quantity);
  }

  return Array.from(merged.entries()).map(([menuId, quantity]) => ({
    menuId,
    quantity,
  }));
}

async function buildCartTotals(items) {
  const normalizedItems = normalizeItems(items);

  if (normalizedItems.length === 0) {
    return {
      cartItems: [],
      total: 0,
      itemCount: 0,
    };
  }

  const menuIds = normalizedItems.map((item) => item.menuId);
  const menuRows = await prisma.menu.findMany({
    where: { id: { in: menuIds } },
    select: { id: true, price: true },
  });

  const priceById = new Map(menuRows.map((row) => [row.id, Number(row.price)]));
  const missingIds = menuIds.filter((menuId) => !priceById.has(menuId));

  if (missingIds.length > 0) {
    throw new CartValidationError(
      `Menu item(s) not found for id(s): ${missingIds.join(", ")}`,
    );
  }

  const cartItems = normalizedItems.map((item) => {
    const price = priceById.get(item.menuId);
    const subtotal = Number((price * item.quantity).toFixed(2));

    return {
      menuId: item.menuId,
      quantity: item.quantity,
      price,
      subtotal,
    };
  });

  const total = Number(
    cartItems
      .reduce((sum, item) => sum + item.subtotal, 0)
      .toFixed(2),
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    total,
    itemCount,
  };
}

function mapToCartData(cartItem) {
  return {
    id: cartItem.id,
    userId: cartItem.userId,
    items: (cartItem.items || []).map((item) => ({
      ...item,
      price: item.price !== undefined ? Number(item.price) : 0,
      subtotal: item.subtotal !== undefined ? Number(item.subtotal) : 0,
    })),
    total: cartItem.total !== undefined ? Number(cartItem.total) : 0,
    itemCount:
      cartItem.itemCount !== undefined ? Number(cartItem.itemCount) : 0,
    createdAt: cartItem.createdAt || new Date(),
    updatedAt: cartItem.updatedAt || new Date(),
  };
}

const getAllCartItems = async () => {
  const carts = await prisma.cart.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return carts.map(mapToCartData);
};

// GET one cart item by ID
const getCartItemById = async (id) => {
  const cart = await prisma.cart.findUnique({
    where: { id: parseId(id, "cart id") },
    include: { items: true },
  });

  return cart ? mapToCartData(cart) : null;
};

// CREATE a new cart
const createCartItem = async (data) => {
  const createData = {
    userId: data.userId,
  };

  if (Array.isArray(data.items)) {
    const totals = await buildCartTotals(data.items);
    createData.total = totals.total;
    createData.itemCount = totals.itemCount;
    createData.items = {
      create: totals.cartItems,
    };
  } else {
    createData.total = 0;
    createData.itemCount = 0;
  }

  const created = await prisma.cart.create({
    data: createData,
    include: { items: true },
  });

  return mapToCartData(created);
};

// UPDATE a cart
const updateCartItem = async (id, data) => {
  const cartId = parseId(id, "cart id");
  const updateData = {
    userId: data.userId !== undefined ? data.userId : undefined,
  };

  if (Array.isArray(data.items)) {
    const totals = await buildCartTotals(data.items);

    // Use a transaction to atomically replace all cart items
    const updated = await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cartId } });
      return await tx.cart.update({
        where: { id: cartId },
        data: {
          ...updateData,
          total: totals.total,
          itemCount: totals.itemCount,
          items: { create: totals.cartItems },
        },
        include: { items: true },
      });
    });

    return mapToCartData(updated);
  }

  const updated = await prisma.cart.update({
    where: { id: cartId },
    data: updateData,
    include: { items: true },
  });

  return mapToCartData(updated);
};

// DELETE a cart item
const deleteCartItem = async (id) => {
  return await prisma.cart.delete({
    where: { id: parseId(id, "cart id") },
  });
};

const getAllCarts = getAllCartItems;
const getCartById = getCartItemById;
const createCart = createCartItem;
const updateCart = updateCartItem;
const deleteCart = deleteCartItem;

module.exports = {
  mapToCartData,
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  CartValidationError,
};
