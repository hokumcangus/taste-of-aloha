import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";

export default function DriverDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");

  const loadOrders = () => {
    orderService
      .list("?status=OUT_FOR_DELIVERY")
      .then(setOrders)
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const markDelivered = async (orderId) => {
    await orderService.transition(orderId, "DELIVERED");
    await loadOrders();
  };

  const sendLocation = async () => {
    if (!selectedOrder || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      await orderService.pushLocation(selectedOrder, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracyMeters: position.coords.accuracy,
      });
    });
  };

  return (
    <section className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Driver Console</h1>
      <div className="bg-white shadow rounded p-4">
        <label className="text-sm">Order for location ping</label>
        <select
          className="ml-2 border rounded p-1"
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(Number(e.target.value))}
        >
          <option value="">Select</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              Order #{order.id}
            </option>
          ))}
        </select>
        <button
          className="ml-2 px-2 py-1 rounded bg-blue-600 text-white text-xs"
          onClick={sendLocation}
        >
          Send My Location
        </button>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-2">Active Deliveries</h2>
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="border rounded p-3 flex justify-between items-center">
              <div className="text-sm">
                #{order.id} — ${order.total.toFixed(2)}
              </div>
              <button
                className="px-2 py-1 rounded bg-green-600 text-white text-xs"
                onClick={() => markDelivered(order.id)}
              >
                Mark Delivered
              </button>
            </li>
          ))}
          {orders.length === 0 && <li className="text-sm">No active deliveries.</li>}
        </ul>
      </div>
    </section>
  );
}
