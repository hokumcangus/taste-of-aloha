const CartModel = require('../models/cartModel');

const getAllCarts = async (_req, res) => {
  try {
    const carts = await CartModel.getAllCarts();
    res.json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch carts', error: error.message });
  }
};

// GET one cart item by id
const getCartById = async (req, res) => {
  try {
    const cart = await CartModel.getCartById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const created = await CartModel.createCart(req.body || {});
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create cart', error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const existing = await CartModel.getCartById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const updated = await CartModel.updateCart(req.params.id, req.body || {});
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const existing = await CartModel.getCartById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await CartModel.deleteCart(req.params.id);
    res.json({ message: 'Cart deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete cart', error: error.message });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};