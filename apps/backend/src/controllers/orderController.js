const orderModel = require("../models/orderModel");
const { ORDER_STATUS } = require("../constants/orderLifecycle");

function handleOrderError(res, error, fallbackMessage) {
  if (error?.name === "OrderValidationError") {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: fallbackMessage });
}

exports.getOrders = async (req, res) => {
  try {
    const filters = {};
    if (req.user?.role === "CUSTOMER") {
      filters.customerId = req.user.id;
    } else if (req.query.customerId) {
      filters.customerId = req.query.customerId;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }
    const orders = await orderModel.getOrders(filters);
    return res.json(orders);
  } catch (error) {
    return handleOrderError(res, error, "Failed to fetch orders");
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (req.user?.role === "CUSTOMER" && order.customerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json(order);
  } catch (error) {
    return handleOrderError(res, error, "Failed to fetch order");
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const order = await orderModel.createOrder(req.body || {}, req.user);
    return res.status(201).json(order);
  } catch (error) {
    return handleOrderError(res, error, "Failed to place order");
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await orderModel.deleteOrder(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({ message: "Order deleted", order: deletedOrder });
  } catch (error) {
    return handleOrderError(res, error, "Failed to delete order");
  }
};

exports.transitionOrder = async (req, res) => {
  try {
    const { status, note } = req.body || {};
    if (!status || !Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({ message: "Invalid target status" });
    }
    const order = await orderModel.transitionOrder(req.params.id, status, req.user, note);
    return res.json(order);
  } catch (error) {
    return handleOrderError(res, error, "Failed to transition order");
  }
};

exports.getKitchenQueue = async (_req, res) => {
  try {
    const orders = await orderModel.getKitchenQueue();
    return res.json(orders);
  } catch (error) {
    return handleOrderError(res, error, "Failed to fetch kitchen queue");
  }
};

exports.assignDriver = async (req, res) => {
  try {
    const assignment = await orderModel.assignDriver(
      req.params.id,
      req.body?.driverId,
      req.user,
    );
    return res.status(201).json(assignment);
  } catch (error) {
    return handleOrderError(res, error, "Failed to assign driver");
  }
};

exports.recordDriverLocation = async (req, res) => {
  try {
    const ping = await orderModel.recordDriverLocation(req.params.id, req.user, req.body || {});
    return res.status(201).json(ping);
  } catch (error) {
    return handleOrderError(res, error, "Failed to record driver location");
  }
};
