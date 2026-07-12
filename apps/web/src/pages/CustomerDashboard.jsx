import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";
import { createRealtimeStream } from "../services/realtimeService";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService
      .list()
      .then(setOrders)
      .catch((e) => setError(e.message));

    const close = createRealtimeStream((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 20));
    });
    return close;
  }, []);

  return (
    <section className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Customer Tracking Dashboard</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-2">My Orders</h2>
          <ul className="space-y-2 text-sm">
            {orders.map((order) => (
              <li key={order.id} className="border rounded p-2">
                #{order.id} — {order.status} — ${order.total.toFixed(2)}
              </li>
            ))}
            {orders.length === 0 && <li>No orders yet.</li>}
          </ul>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-2">Live Events</h2>
          <ul className="space-y-2 text-xs max-h-80 overflow-auto">
            {events.map((event, index) => (
              <li key={`${event.id || index}-${index}`} className="border rounded p-2">
                {JSON.stringify(event)}
              </li>
            ))}
            {events.length === 0 && <li>No live events yet.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
