import CartModel from "../models/cartModel.js";

function handleCartError(res, error, fallbackMessage) {
  console.error(error);

  if (error?.statusCode === 400 || error?.name === "CartValidationError") {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: fallbackMessage, error: error.message });
}

const getAllCartItems = async (_req, res) => {
  try {
    const cartItems = await CartModel.getAllCartItems();
    res.json(cartItems);
  } catch (error) {
    handleCartError(res, error, "Failed to fetch cart items");
  }
};

// GET one cart item by id
const getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartModel.getCartItemById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(cartItem);
  } catch (error) {
    handleCartError(res, error, "Failed to fetch cart item");
  }
};

const createCartItem = async (req, res) => {
  try {
    const created = await CartModel.createCartItem(req.body || {});
    res.status(201).json(created);
  } catch (error) {
    handleCartError(res, error, "Failed to create cart item");
  }
};

const updateCartItem = async (req, res) => {
  try {
    const existing = await CartModel.getCartItemById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const updated = await CartModel.updateCartItem(
      req.params.id,
      req.body || {},
    );
    res.json(updated);
  } catch (error) {
    handleCartError(res, error, "Failed to update cart item");
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const existing = await CartModel.getCartItemById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await CartModel.deleteCartItem(req.params.id);
    res.json({ message: "Cart item deleted" });
  } catch (error) {
    handleCartError(res, error, "Failed to delete cart item");
  }
};

export = {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
