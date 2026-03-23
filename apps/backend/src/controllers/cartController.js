const CartModel = require('../models/cartModel');

const getAllCartItems = async (_req, res) => {
  try {
    const cartItems = await CartModel.getAllCartItems();
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cart items', error: error.message });
  }
};

// GET one cart item by id
const getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartModel.getCartItemById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cart item', error: error.message });
  }
};

const createCartItem = async (req, res) => {
  try {
    const created = await CartModel.createCartItem(req.body || {});
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create cart item', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const existing = await CartModel.getCartItemById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const updated = await CartModel.updateCartItem(req.params.id, req.body || {});
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart item', error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const existing = await CartModel.getCartItemById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await CartModel.deleteCartItem(req.params.id);
    res.json({ message: 'Cart item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete cart item', error: error.message });
  }
};

module.exports = {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};