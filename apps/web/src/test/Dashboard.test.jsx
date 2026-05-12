import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("../services/dashboardService", () => ({
  dashboardService: {
    getMyDashboard: vi.fn(),
    getDriverDashboard: vi.fn(),
    getAdminDashboard: vi.fn(),
  },
}));

vi.mock("../services/notificationService", () => ({
  notificationService: {
    getMyNotifications: vi.fn().mockResolvedValue({ notifications: [], unreadCount: 0 }),
    markRead: vi.fn(),
    markAllRead: vi.fn(),
  },
}));

vi.mock("../services/orderService", () => ({
  orderService: {
    updateOrderStatus: vi.fn(),
  },
}));

import { dashboardService } from "../services/dashboardService";
import Dashboard from "../pages/Dashboard";

const customerUser = { id: 5, email: "c@test.com", name: "Hoku", role: "CUSTOMER" };
const driverUser = { id: 7, email: "d@test.com", name: "Driver", role: "DRIVER" };
const adminUser = { id: 1, email: "a@test.com", name: "Admin", role: "ADMIN" };

const mockCustomerData = {
  summary: { totalOrders: 4, paidTotal: 68.5 },
  orderStatusBreakdown: [
    { status: "COMPLETED", count: 3 },
    { status: "PLACED", count: 1 },
  ],
  recentOrders: [
    {
      id: 1,
      status: "COMPLETED",
      paymentStatus: "PAID",
      total: 15,
      itemCount: 3,
      createdAt: new Date().toISOString(),
    },
  ],
};

const mockAdminData = {
  summary: { users: 12, orders: 40, paidRevenue: 980 },
  orderStatusBreakdown: [
    { status: "COMPLETED", count: 30 },
    { status: "PLACED", count: 10 },
  ],
  recentOrders: [
    {
      id: 2,
      userId: 5,
      user: { name: "Hoku", email: "c@test.com" },
      status: "PLACED",
      paymentStatus: "PAID",
      total: 25,
      itemCount: 2,
      createdAt: new Date().toISOString(),
    },
  ],
};

const authReducer = (state = { user: null }) => state;

function makeStore(user) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user } },
  });
}

function renderDashboard(user) {
  return render(
    <Provider store={makeStore(user)}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>,
  );
}

describe("Dashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dashboardService.getMyDashboard.mockResolvedValue(mockCustomerData);
    dashboardService.getAdminDashboard.mockResolvedValue(mockAdminData);
    dashboardService.getDriverDashboard.mockResolvedValue(mockCustomerData);
  });

  it("shows loading state initially", () => {
    dashboardService.getMyDashboard.mockReturnValue(new Promise(() => {}));
    renderDashboard(customerUser);

    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it("renders customer dashboard summary after load", async () => {
    dashboardService.getMyDashboard.mockResolvedValue(mockCustomerData);

    renderDashboard(customerUser);

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/total orders/i)).toBeInTheDocument(); // totalOrders
    // "Welcome back, Hoku." is split across spans — use regex on the paragraph
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("calls getAdminDashboard for ADMIN users", async () => {
    dashboardService.getAdminDashboard.mockResolvedValue(mockAdminData);

    renderDashboard(adminUser);

    await waitFor(() => {
      expect(dashboardService.getAdminDashboard).toHaveBeenCalledTimes(1);
    });

    expect(dashboardService.getMyDashboard).not.toHaveBeenCalled();
  });

  it("calls getDriverDashboard for DRIVER users", async () => {
    dashboardService.getDriverDashboard.mockResolvedValue(mockCustomerData);

    renderDashboard(driverUser);

    await waitFor(() => {
      expect(dashboardService.getDriverDashboard).toHaveBeenCalledTimes(1);
    });

    expect(dashboardService.getMyDashboard).not.toHaveBeenCalled();
    expect(dashboardService.getAdminDashboard).not.toHaveBeenCalled();
  });

  it("renders admin revenue summary", async () => {
    dashboardService.getAdminDashboard.mockResolvedValue(mockAdminData);

    renderDashboard(adminUser);

    await waitFor(() => {
      expect(screen.getByText(/980/)).toBeInTheDocument();
    });
  });

  it("renders error message on failure", async () => {
    dashboardService.getMyDashboard.mockRejectedValue(new Error("Failed to load"));

    renderDashboard(customerUser);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it("shows welcome message with user name", async () => {
    dashboardService.getMyDashboard.mockResolvedValue(mockCustomerData);

    renderDashboard(customerUser);

    await waitFor(() => {
      expect(screen.getByText(/welcome back, hoku/i)).toBeInTheDocument();
    });
  });
});
