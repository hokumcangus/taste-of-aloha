const orderModel = require("../models/orderModel");
const notificationModel = require("../models/notificationModel");

function canAccessOrder(user, order) {
    if (!user || !order) {
        return false;
    }

    if (user.role === "ADMIN") {
        return true;
    }

    if (order.userId === user.id) {
        return true;
    }

    if (user.role === "DRIVER" && order.assignedDriverId === user.id) {
        return true;
    }

    return false;
}

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
        let scope = { userId: req.user.id };

        if (req.user.role === "ADMIN") {
            scope = {};
        } else if (req.user.role === "DRIVER") {
            scope = { assignedDriverId: req.user.id };
        }

        const orders = await orderModel.getOrders(scope);
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

        if (!canAccessOrder(req.user, order)) {
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

        await notificationModel.createOrderNotifications({
            order,
            type: "ORDER_CREATED",
            title: `Order #${order.id} placed`,
            message: `Order #${order.id} was placed and is awaiting preparation.`,
            includeCustomer: true,
            includeAdmins: true,
            includeDrivers: true,
            includeAssignedDriver: false,
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

exports.updateOrderStatus = async (req, res) => {
    try {
        const existing = await orderModel.getOrderById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (req.user.role === "DRIVER") {
            if (existing.assignedDriverId !== req.user.id) {
                return res.status(403).json({ error: "Driver is not assigned to this order" });
            }

            if (req.body?.assignedDriverId !== undefined) {
                return res.status(403).json({ error: "Driver cannot reassign order" });
            }
        }

        const updated = await orderModel.updateOrder(req.params.id, {
            status: req.body?.status,
            assignedDriverId: req.body?.assignedDriverId,
        });

        const changes = [];
        if (req.body?.status !== undefined && updated.status !== existing.status) {
            changes.push(`status changed from ${existing.status} to ${updated.status}`);
        }
        if (req.body?.assignedDriverId !== undefined && updated.assignedDriverId !== existing.assignedDriverId) {
            if (updated.assignedDriverId) {
                changes.push(`driver assignment changed to user #${updated.assignedDriverId}`);
            } else {
                changes.push("driver assignment cleared");
            }
        }

        if (changes.length > 0) {
            await notificationModel.createOrderNotifications({
                order: updated,
                type: req.body?.status !== undefined ? "ORDER_STATUS_CHANGED" : "ORDER_UPDATED",
                title: `Order #${updated.id} updated`,
                message: `Order #${updated.id} update: ${changes.join("; ")}.`,
                includeCustomer: true,
                includeAdmins: true,
                includeDrivers: true,
                includeAssignedDriver: true,
            });
        }

        return res.json(updated);
    } catch (error) {
        return handleOrderError(res, error, "Failed to update order status");
    }
};