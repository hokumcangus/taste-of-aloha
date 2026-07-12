const { prisma } = require("../config/database");
const { canTransition, ORDER_STATUS } = require("../constants/orderLifecycle");
const realtimeHub = require("../services/realtimeHub");

class OrderValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "OrderValidationError";
    this.statusCode = statusCode;
  }
}

function parsePositiveInt(value, name) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new OrderValidationError(`Invalid ${name}`);
  }
  return parsed;
}

async function normalizeOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderValidationError("Order items are required");
  }

  const normalized = [];
  for (const rawItem of items) {
    const quantity = parsePositiveInt(rawItem.quantity, "item quantity");
    let name = rawItem.name;
    let unitPrice = Number(rawItem.unitPrice ?? rawItem.price);
    let menuId = rawItem.menuId ? parsePositiveInt(rawItem.menuId, "menuId") : null;

    if (menuId) {
      const menu = await prisma.menu.findUnique({ where: { id: menuId } });
      if (!menu) {
        throw new OrderValidationError(`Menu item not found: ${menuId}`);
      }
      name = name || menu.name;
      unitPrice = Number.isFinite(unitPrice) ? unitPrice : Number(menu.price);
    }

    if (!name || !Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new OrderValidationError(
        "Each item must include valid name and unitPrice (or menuId)",
      );
    }

    normalized.push({
      menuId,
      name: String(name),
      unitPrice: Number(unitPrice.toFixed(2)),
      quantity,
      subtotal: Number((unitPrice * quantity).toFixed(2)),
    });
  }

  return normalized;
}

function mapOrder(order) {
  return {
    ...order,
    total: Number(order.total),
    items: (order.items || []).map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
    })),
  };
}

async function createOrder(payload, actor) {
  const items = await normalizeOrderItems(payload.items || []);
  const total = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const created = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId: actor?.id || payload.customerId || null,
        cartId: payload.cartId || null,
        total,
        itemCount,
        status: ORDER_STATUS.CART_SUBMITTED,
        items: { create: items },
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        deliveryAssignments: true,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        fromStatus: null,
        toStatus: ORDER_STATUS.CART_SUBMITTED,
        actorRole: actor?.role || "CUSTOMER",
        actorUserId: actor?.id || null,
        note: "Order created",
      },
    });

    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        deliveryAssignments: true,
      },
    });
  });

  realtimeHub.publish("order.created", { orderId: created.id, status: created.status });
  return mapOrder(created);
}

async function getOrders(filters = {}) {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.customerId) {
    where.customerId = Number(filters.customerId);
  }

  const rows = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      deliveryAssignments: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return rows.map(mapOrder);
}

async function getOrderById(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: parsePositiveInt(orderId, "order id") },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      deliveryAssignments: { orderBy: { createdAt: "desc" } },
    },
  });
  return order ? mapOrder(order) : null;
}

async function transitionOrder(orderId, toStatus, actor, note) {
  const id = parsePositiveInt(orderId, "order id");
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    throw new OrderValidationError("Order not found", 404);
  }

  if (!canTransition(existing.status, toStatus, actor.role)) {
    throw new OrderValidationError(
      `Transition ${existing.status} -> ${toStatus} is not allowed for ${actor.role}`,
    );
  }

  if (toStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
    const activeAssignment = await prisma.deliveryAssignment.findFirst({
      where: { orderId: id, isActive: true },
    });
    if (!activeAssignment) {
      throw new OrderValidationError(
        "Driver must be assigned before moving to OUT_FOR_DELIVERY",
      );
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        fromStatus: existing.status,
        toStatus,
        actorRole: actor.role,
        actorUserId: actor.id || null,
        note: note || null,
      },
    });

    return tx.order.update({
      where: { id },
      data: { status: toStatus },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        deliveryAssignments: { orderBy: { createdAt: "desc" } },
      },
    });
  });

  realtimeHub.publish("order.transitioned", {
    orderId: id,
    fromStatus: existing.status,
    toStatus,
    actorRole: actor.role,
  });
  return mapOrder(order);
}

async function deleteOrder(orderId) {
  const id = parsePositiveInt(orderId, "order id");
  try {
    const deleted = await prisma.order.delete({
      where: { id },
      include: { items: true, statusHistory: true },
    });
    realtimeHub.publish("order.deleted", { orderId: id });
    return deleted;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

async function getKitchenQueue() {
  return getOrders({
    status: ORDER_STATUS.PREPARING,
  });
}

async function assignDriver(orderId, driverId, actor) {
  const parsedOrderId = parsePositiveInt(orderId, "order id");
  const parsedDriverId = parsePositiveInt(driverId, "driver id");

  const assignment = await prisma.$transaction(async (tx) => {
    await tx.deliveryAssignment.updateMany({
      where: { orderId: parsedOrderId, isActive: true },
      data: { isActive: false, unassignedAt: new Date() },
    });

    return tx.deliveryAssignment.create({
      data: {
        orderId: parsedOrderId,
        driverId: parsedDriverId,
      },
    });
  });

  realtimeHub.publish("order.driver_assigned", {
    orderId: parsedOrderId,
    driverId: parsedDriverId,
    assignedBy: actor?.id || null,
  });
  return assignment;
}

async function recordDriverLocation(orderId, actor, payload) {
  const parsedOrderId = parsePositiveInt(orderId, "order id");
  const activeAssignment = await prisma.deliveryAssignment.findFirst({
    where: { orderId: parsedOrderId, driverId: actor.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!activeAssignment) {
    throw new OrderValidationError(
      "Active assignment not found for this driver and order",
      403,
    );
  }

  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new OrderValidationError("latitude and longitude are required");
  }

  const ping = await prisma.driverLocationPing.create({
    data: {
      assignmentId: activeAssignment.id,
      orderId: parsedOrderId,
      driverId: actor.id,
      latitude,
      longitude,
      accuracyMeters: Number(payload.accuracyMeters) || null,
      headingDegrees: Number(payload.headingDegrees) || null,
      speedKph: Number(payload.speedKph) || null,
    },
  });

  realtimeHub.publish("driver.location", {
    orderId: parsedOrderId,
    driverId: actor.id,
    latitude: ping.latitude,
    longitude: ping.longitude,
    recordedAt: ping.recordedAt,
  });

  return ping;
}

module.exports = {
  OrderValidationError,
  createOrder,
  getOrders,
  getOrderById,
  transitionOrder,
  deleteOrder,
  getKitchenQueue,
  assignDriver,
  recordDriverLocation,
};