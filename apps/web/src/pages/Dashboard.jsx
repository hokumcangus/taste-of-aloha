import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardService } from "../services/dashboardService";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setStatus("loading");
      setError(null);

      try {
        const dashboardData =
          user?.role === "ADMIN"
            ? await dashboardService.getAdminDashboard()
            : await dashboardService.getMyDashboard();

        if (active) {
          setData(dashboardData);
          setStatus("succeeded");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load dashboard");
          setStatus("failed");
        }
      }
    }

    if (user) {
      loadDashboard();
    }

    return () => {
      active = false;
    };
  }, [user]);

  if (status === "loading") {
    return <div className="mx-auto max-w-5xl px-4 py-8">Loading dashboard...</div>;
  }

  if (status === "failed") {
    return <div className="mx-auto max-w-5xl px-4 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">
        Welcome back{user?.name ? `, ${user.name}` : ""}.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Object.entries(data?.summary || {}).map(([key, value]) => (
          <div key={key} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs uppercase text-gray-500">{key}</div>
            <div className="mt-1 text-2xl font-semibold">{Number.isFinite(value) ? value : String(value)}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Order Status Breakdown</h2>
        <ul className="mt-3 space-y-2">
          {(data?.orderStatusBreakdown || []).map((entry) => (
            <li key={entry.status} className="flex justify-between border-b border-gray-100 pb-2 text-sm">
              <span>{entry.status}</span>
              <span className="font-medium">{entry.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <div className="mt-3 space-y-3">
          {(data?.recentOrders || []).map((order) => (
            <div key={order.id} className="rounded border border-gray-100 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">Order #{order.id}</span>
                <span>{order.status}</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
