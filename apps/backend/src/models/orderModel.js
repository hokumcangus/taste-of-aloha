const { prisma } = require("../config/database");

class OrderValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "OrderValidationError";
        this.statusCode = 400;
    }
}

function parsePositiveInt(value, fieldName) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        throw new OrderValidationError(`Invalid ${fieldName}`);
    }
    return parsed;
}

function mapOrderData(order) {
    return {
        id: order.id,
        userId: order.userId,
        assignedDriverId: order.assignedDriverId ?? null,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paymentReference: order.paymentReference,
        total: Number(order.total),
        itemCount: Number(order.itemCount),
        items: (order.items || []).map((item) => ({
            id: item.id,
            menuId: item.menuId,
            menuName: item.menuName,
            unitPrice: Number(item.unitPrice),
            quantity: item.quantity,
            subtotal: Number(item.subtotal),
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        user: order.user
            ? {
                  id: order.user.id,
                  email: order.user.email,
                  name: order.user.name,
                  role: order.user.role,
              }
            : undefined,
        assignedDriver: order.assignedDriver
            ? {
                  id: order.assignedDriver.id,
                  email: order.assignedDriver.email,
                  name: order.assignedDriver.name,
                  role: order.assignedDriver.role,
              }
            : undefined,
    };
}

function normalizeItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new OrderValidationError("At least one item is required");
    }

    const merged = new Map();

    for (const item of items) {
        const menuId = parsePositiveInt(item.menuId, "menuId");
        const quantity = parsePositiveInt(item.quantity, "quantity");
        merged.set(menuId, (merged.get(menuId) || 0) + quantity);
    }

    return Array.from(merged.entries()).map(([menuId, quantity]) => ({
        menuId,
        quantity,
    }));
}

async function buildOrderFromItems(items) {
    const normalized = normalizeItems(items);
    const menuIds = normalized.map((item) => item.menuId);

    const menus = await prisma.menu.findMany({
        where: {
            id: { in: menuIds },
        },
        select: {
            id: true,
            name: true,
            price: true,
        },
    });

    const byId = new Map(menus.map((menu) => [menu.id, menu]));
    const missingIds = menuIds.filter((menuId) => !byId.has(menuId));

    if (missingIds.length > 0) {
        throw new OrderValidationError(
            `Menu item(s) not found for id(s): ${missingIds.join(", ")}`,
        );
    }

    const orderItems = normalized.map((item) => {
        const menu = byId.get(item.menuId);
        const unitPrice = Number(menu.price);
        const subtotal = Number((unitPrice * item.quantity).toFixed(2));

        return {
            menuId: item.menuId,
            menuName: menu.name,
            unitPrice,
            quantity: item.quantity,
            subtotal,
        };
    });

    const total = Number(
        orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
    );
    const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    return { orderItems, total, itemCount };
}

async function buildOrderFromCart(cartId) {
    const cart = await prisma.cart.findUnique({
        where: { id: parsePositiveInt(cartId, "cart id") },
        include: {
            items: {
                include: {
                    menu: {
                        select: { name: true },
                    },
                },
            },
        },
    });

    if (!cart) {
        throw new OrderValidationError("Cart not found");
    }

    if (!Array.isArray(cart.items) || cart.items.length === 0) {
        throw new OrderValidationError("Cart has no items");
    }

    const orderItems = cart.items.map((item) => ({
        menuId: item.menuId,
        menuName: item.menu?.name || `Menu #${item.menuId}`,
        unitPrice: Number(item.price),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
    }));

    return {
        orderItems,
        total: Number(cart.total),
        itemCount: Number(cart.itemCount),
    };
}

async function createOrder(data) {
    const userId = parsePositiveInt(data.userId, "user id");
    const paymentMethod = String(data.paymentMethod || "card").toLowerCase();

    const orderPayload = data.cartId
        ? await buildOrderFromCart(data.cartId)
        : await buildOrderFromItems(data.items);

    const created = await prisma.order.create({
        data: {
            userId,
            paymentMethod,
            paymentReference: data.paymentReference || null,
            paymentStatus: "PENDING",
            total: orderPayload.total,
            itemCount: orderPayload.itemCount,
            items: {
                create: orderPayload.orderItems,
            },
        },
        include: { items: true },
    });

    return mapOrderData(created);
}

async function getOrders(scope = {}) {
    const where = {};
    if (scope.userId) {
        where.userId = Number(scope.userId);
    }
    if (scope.assignedDriverId) {
        where.assignedDriverId = Number(scope.assignedDriverId);
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            items: true,
            user: { select: { id: true, email: true, name: true, role: true } },
            assignedDriver: { select: { id: true, email: true, name: true, role: true } },
        },
    });

    return orders.map(mapOrderData);
}

async function getOrderById(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: parsePositiveInt(orderId, "order id") },
        include: {
            items: true,
            user: { select: { id: true, email: true, name: true, role: true } },
            assignedDriver: { select: { id: true, email: true, name: true, role: true } },
        },
    });

    return order ? mapOrderData(order) : null;
}

async function deleteOrder(orderId) {
    try {
        const deleted = await prisma.order.delete({
            where: { id: parsePositiveInt(orderId, "order id") },
            include: { items: true },
        });

        return mapOrderData(deleted);
    } catch (error) {
        if (error.code === "P2025") {
            return null;
        }

        throw error;
    }
}

function validateStatus(status) {
    const normalizedStatus = String(status || "").toUpperCase();
    const allowed = ["PLACED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

    if (!allowed.includes(normalizedStatus)) {
        throw new OrderValidationError("Invalid order status");
    }

    return normalizedStatus;
}

async function updateOrder(orderId, { status, assignedDriverId } = {}) {
    const data = {};

    if (status !== undefined) {
        data.status = validateStatus(status);
    }

    if (assignedDriverId !== undefined) {
        if (assignedDriverId === null || assignedDriverId === "") {
            data.assignedDriverId = null;
        } else {
            data.assignedDriverId = parsePositiveInt(assignedDriverId, "assignedDriverId");
            const driver = await prisma.user.findUnique({
                where: { id: data.assignedDriverId },
                select: { id: true, role: true },
            });

            if (!driver || driver.role !== "DRIVER") {
                throw new OrderValidationError("assignedDriverId must belong to a DRIVER user");
            }
        }
    }

    if (Object.keys(data).length === 0) {
        throw new OrderValidationError("No order changes provided");
    }

    const updated = await prisma.order.update({
        where: { id: parsePositiveInt(orderId, "order id") },
        data,
        include: {
            items: true,
            user: { select: { id: true, email: true, name: true, role: true } },
            assignedDriver: { select: { id: true, email: true, name: true, role: true } },
        },
    });

    return mapOrderData(updated);
}

async function updateOrderStatus(orderId, status) {
    return updateOrder(orderId, { status });
}

module.exports = {
    OrderValidationError,
    createOrder,
    getOrders,
    getOrderById,
    deleteOrder,
    updateOrder,
    updateOrderStatus,
    markOrderPaidByReference,
};

async function markOrderPaidByReference(paymentReference) {
    const order = await prisma.order.findFirst({
        where: { paymentReference: String(paymentReference) },
    });

    if (!order) {
        return null;
    }

    const updated = await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID" },
        include: { items: true },
    });

    return mapOrderData(updated);
}