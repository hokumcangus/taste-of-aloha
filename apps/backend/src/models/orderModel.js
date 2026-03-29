const orders = [];

exports.createOrder = function(orderData) {
    const newOrder = { id: Date.now(), ...orderData };
    orders.push(newOrder);
    return newOrder;
}

exports.getOrders = function() {
    return orders;
}

exports.getOrderById = function(orderId) {
    return orders.find(o => o.id === orderId);
}