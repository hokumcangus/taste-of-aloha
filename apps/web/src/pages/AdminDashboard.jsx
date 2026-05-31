import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [driverId, setDriverId] = useState("");

  const load = () => orderService.list().then(setOrders).catch(() => setOrders([]));

  useEffect(() => {
    load();
  }, []);

  const assign = async (orderId) => {
    if (!driverId) return;
    await orderService.assignDriver(orderId, Number(driverId));
    await load();
  };

  const transition = async (orderId, status) => {
    await orderService.transition(orderId, status);
    await load();
  };

  return (
    <section className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="bg-white shadow rounded p-4">
        <label className="text-sm font-medium">Driver ID for assignment</label>
        <input
          className="ml-2 border rounded p-1"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          placeholder="e.g. 4"
        />
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-3">Order Management</h2>
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="border rounded p-3 space-y-2">
              <div className="text-sm">
                #{order.id} — {order.status} — ${order.total.toFixed(2)}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  className="px-2 py-1 rounded bg-green-600 text-white"
                  onClick={() => transition(order.id, "CONFIRMED")}
                >
                  Confirm
                </button>
                <button
                  className="px-2 py-1 rounded bg-yellow-500 text-white"
                  onClick={() => transition(order.id, "PREPARING")}
                >
                  Preparing
                </button>
                <button
                  className="px-2 py-1 rounded bg-blue-600 text-white"
                  onClick={() => transition(order.id, "READY_FOR_PICKUP")}
                >
                  Ready
                </button>
                <button
                  className="px-2 py-1 rounded bg-indigo-600 text-white"
                  onClick={() => transition(order.id, "OUT_FOR_DELIVERY")}
                >
                  Out for Delivery
                </button>
                <button
                  className="px-2 py-1 rounded bg-gray-700 text-white"
                  onClick={() => transition(order.id, "DELIVERED")}
                >
                  Delivered
                </button>
                <button
                  className="px-2 py-1 rounded bg-red-600 text-white"
                  onClick={() => transition(order.id, "CANCELLED")}
                >
                  Cancel
                </button>
                <button
                  className="px-2 py-1 rounded bg-purple-600 text-white"
                  onClick={() => assign(order.id)}
                >
                  Assign Driver
                </button>
              </div>
            </li>
          ))}
          {orders.length === 0 && <li className="text-sm">No orders available.</li>}
        </ul>
      </div>
    </section>
  );
}
