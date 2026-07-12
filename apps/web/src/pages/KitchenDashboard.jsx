import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";

export default function KitchenDashboard() {
  const [queue, setQueue] = useState([]);

  const loadQueue = () => {
    orderService.kitchenQueue().then(setQueue).catch(() => setQueue([]));
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const moveToReady = async (orderId) => {
    await orderService.transition(orderId, "READY_FOR_PICKUP");
    await loadQueue();
  };

  return (
    <section className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Kitchen Queue</h1>
      <div className="bg-white shadow rounded p-4">
        <ul className="space-y-2">
          {queue.map((order) => (
            <li key={order.id} className="border rounded p-3 flex justify-between items-center">
              <div className="text-sm">
                #{order.id} — {order.itemCount} items — ${order.total.toFixed(2)}
              </div>
              <button
                className="px-2 py-1 rounded bg-green-600 text-white text-xs"
                onClick={() => moveToReady(order.id)}
              >
                Mark Ready
              </button>
            </li>
          ))}
          {queue.length === 0 && <li className="text-sm">No active kitchen orders.</li>}
        </ul>
      </div>
    </section>
  );
}
