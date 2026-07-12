import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardService } from "../services/dashboardService";
import { notificationService } from "../services/notificationService";
import { orderService } from "../services/orderService";

const ADMIN_ORDER_STATUSES = ["PLACED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
const DRIVER_ORDER_STATUSES = ["PREPARING", "READY", "COMPLETED"];

function formatSummaryKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifError, setNotifError] = useState(null);
  const [orderActionStatus, setOrderActionStatus] = useState("idle");

  const isAdmin = user?.role === "ADMIN";
  const isDriver = user?.role === "DRIVER";

  const canUpdateStatus = isAdmin || isDriver;

  const loadDashboardData = useCallback(async (activeFlag) => {
    setStatus("loading");
    setError(null);

    try {
      let dashboardData;
      if (isAdmin) {
        dashboardData = await dashboardService.getAdminDashboard();
      } else if (isDriver) {
        dashboardData = await dashboardService.getDriverDashboard();
      } else {
        dashboardData = await dashboardService.getMyDashboard();
      }

      if (activeFlag()) {
        setData(dashboardData);
        setStatus("succeeded");
      }
    } catch (err) {
      if (activeFlag()) {
        setError(err.message || "Failed to load dashboard");
        setStatus("failed");
      }
    }
  }, [isAdmin, isDriver]);

  const loadNotifications = useCallback(async (activeFlag, silent = false) => {
    if (!silent) {
      setNotifError(null);
    }

    try {
      const response = await notificationService.getMyNotifications(30);
      if (activeFlag()) {
        setNotifications(response.notifications || []);
        setUnreadCount(Number(response.unreadCount || 0));
      }
    } catch (err) {
      if (activeFlag() && !silent) {
        setNotifError(err.message || "Failed to load notifications");
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (user) {
      const activeFlag = () => active;
      // Data-fetching on mount/user-change is a legitimate useEffect pattern;
      // these async functions set state only after awaiting network responses.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadDashboardData(activeFlag);
      loadNotifications(activeFlag);

      const timer = setInterval(() => {
        loadNotifications(activeFlag, true);
      }, 15000);

      return () => {
        active = false;
        clearInterval(timer);
      };
    }

    return () => {
      active = false;
    };
  }, [user, loadDashboardData, loadNotifications]);

  async function refreshDashboardAndNotifications() {
    const activeFlag = () => true;
    await Promise.all([
      loadDashboardData(activeFlag),
      loadNotifications(activeFlag, true),
    ]);
  }

  async function handleMarkRead(notificationId) {
    try {
      await notificationService.markRead(notificationId);
      setNotifications((current) =>
        current.map((entry) =>
          entry.id === notificationId
            ? { ...entry, isRead: true, readAt: new Date().toISOString() }
            : entry,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      setNotifError(err.message || "Failed to mark notification as read");
    }
  }

  async function handleMarkAllRead() {
    try {
      await notificationService.markAllRead();
      setNotifications((current) => current.map((entry) => ({ ...entry, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setNotifError(err.message || "Failed to mark all notifications as read");
    }
  }

  async function handleStatusUpdate(orderId, nextStatus) {
    setOrderActionStatus("loading");
    setError(null);
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
      setOrderActionStatus("succeeded");
      await refreshDashboardAndNotifications();
    } catch (err) {
      setOrderActionStatus("failed");
      setError(err.message || "Failed to update order");
    }
  }

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
        Welcome back{user?.name ? `, ${user.name}` : ""}. Role: {user?.role || "CUSTOMER"}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Object.entries(data?.summary || {}).map(([key, value]) => (
          <div key={key} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs uppercase text-gray-500">{formatSummaryKey(key)}</div>
            <div className="mt-1 text-2xl font-semibold">{Number.isFinite(value) ? value : String(value)}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Notifications ({unreadCount} unread)</h2>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
          >
            Mark all read
          </button>
        </div>
        {notifError ? <p className="mt-2 text-sm text-red-600">{notifError}</p> : null}
        <div className="mt-3 space-y-2">
          {(notifications || []).length === 0 ? (
            <p className="text-sm text-gray-500">No notifications yet.</p>
          ) : (
            notifications.map((entry) => (
              <div
                key={entry.id}
                className={`rounded border p-3 ${entry.isRead ? "border-gray-100 bg-gray-50" : "border-blue-200 bg-blue-50"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium">{entry.title}</div>
                  {!entry.isRead ? (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(entry.id)}
                      className="rounded border border-blue-300 px-2 py-1 text-xs hover:bg-blue-100"
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-gray-700">{entry.message}</p>
                <p className="mt-1 text-xs text-gray-500">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
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
        {orderActionStatus === "loading" ? (
          <p className="mt-2 text-sm text-gray-500">Updating order...</p>
        ) : null}
        <div className="mt-3 space-y-3">
          {(data?.recentOrders || []).map((order) => (
            <div key={order.id} className="rounded border border-gray-100 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">Order #{order.id}</span>
                <span>{order.status}</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
              {order.user ? (
                <div className="mt-1 text-xs text-gray-500">
                  Customer: {order.user.name || order.user.email}
                </div>
              ) : null}
              {order.assignedDriver ? (
                <div className="mt-1 text-xs text-gray-500">
                  Driver: {order.assignedDriver.name || order.assignedDriver.email}
                </div>
              ) : null}
              <div className="mt-2 text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
              {canUpdateStatus ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(isDriver ? DRIVER_ORDER_STATUSES : ADMIN_ORDER_STATUSES).map((nextStatus) => (
                    <button
                      key={`${order.id}-${nextStatus}`}
                      type="button"
                      disabled={order.status === nextStatus || orderActionStatus === "loading"}
                      onClick={() => handleStatusUpdate(order.id, nextStatus)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {nextStatus}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
