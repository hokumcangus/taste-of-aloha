const orders = [];

exports.createOrder = function createOrder(orderData) {
    const newOrder = { id: Date.now(), ...orderData };
    orders.push(newOrder);
    return newOrder;
};

exports.getOrders = function getOrders() {
    return orders;
};

exports.getOrderById = function getOrderById(orderId) {
    return orders.find((order) => order.id === orderId);
};

exports.deleteOrder = function deleteOrder(orderId) {
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) {
        return null;
    }

    const [deletedOrder] = orders.splice(orderIndex, 1);
    return deletedOrder;
};