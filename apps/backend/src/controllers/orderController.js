const orderModel = require("../models/orderModel");

function handleOrderError(res, error, fallbackMessage) {
    if (error?.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: fallbackMessage });
}

// GET all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await orderModel.getOrders(
            req.user.role === "ADMIN" ? {} : { userId: req.user.id },
        );
        res.json(orders);
    } catch (error) {
        return handleOrderError(res, error, "Failed to fetch orders");
    }
};

// GET order by id
exports.getOrderById = async (req, res) => {
    try {
        const order = await orderModel.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
            return res.status(403).json({ error: "Not allowed to view this order" });
        }

        return res.json(order);
    } catch (error) {
        return handleOrderError(res, error, "Failed to fetch order");
    }
};

// POST place new order
exports.placeOrder = async (req, res) => {
    try {
        const order = await orderModel.createOrder({
            ...(req.body || {}),
            userId: req.user.id,
        });
        res.status(201).json(order);
    } catch (error) {
        return handleOrderError(res, error, "Failed to place order");
    }
};

// DELETE order by id
exports.deleteOrder = async (req, res) => {
    try {
        const order = await orderModel.getOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
            return res.status(403).json({ error: "Not allowed to delete this order" });
        }

        const deletedOrder = await orderModel.deleteOrder(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.json({ message: "Order deleted", order: deletedOrder });
    } catch (error) {
        return handleOrderError(res, error, "Failed to delete order");
    }
};

// PATCH order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const updated = await orderModel.updateOrderStatus(
            req.params.id,
            req.body?.status,
        );

        return res.json(updated);
    } catch (error) {
        return handleOrderError(res, error, "Failed to update order status");
    }
};