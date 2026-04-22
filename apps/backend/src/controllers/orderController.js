const orderModel = require("../models/orderModel");

// GET all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = orderModel.getOrders();
        res.json(orders);
    } catch {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// GET order by id
exports.getOrderById = async (req, res) => {
    try {
        const order = orderModel.getOrderById(parseInt(req.params.id, 10));
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch {
        res.status(500).json({ error: "Failed to fetch order" });
    }
};

// POST place new order
exports.placeOrder = async (req, res) => {
    try {
        const order = orderModel.createOrder(req.body);
        res.status(201).json(order);
    } catch {
        res.status(500).json({ error: "Failed to place order" });
    }
};

// DELETE order by id
exports.deleteOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id, 10);
        const deletedOrder = orderModel.deleteOrder(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.json({ message: "Order deleted", order: deletedOrder });
    } catch {
        return res.status(500).json({ error: "Failed to delete order" });
    }
};