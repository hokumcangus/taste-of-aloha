const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

jest.mock("pg", () => ({ Pool: jest.fn(() => ({})) }));
jest.mock("@prisma/adapter-pg", () => ({ PrismaPg: jest.fn(() => ({})) }));

let mockPrisma;
jest.mock("@prisma/client", () => {
  mockPrisma = {
    order: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const dashboardRoutes = require("../src/routes/dashboardRoutes");

const app = express();
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);

const JWT_SECRET = "dev-secret-change-me";
const customerToken = jwt.sign({ sub: 5, email: "c@test.com", role: "CUSTOMER" }, JWT_SECRET);
const adminToken = jwt.sign({ sub: 1, email: "a@test.com", role: "ADMIN" }, JWT_SECRET);

const mockRecentOrders = [
  {
    id: 1,
    userId: 5,
    status: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "card",
    paymentReference: null,
    total: 25,
    itemCount: 2,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let consoleErrorSpy;

beforeEach(() => {
  jest.clearAllMocks();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  mockPrisma.order.count.mockResolvedValue(3);
  mockPrisma.order.aggregate.mockResolvedValue({ _sum: { total: 75.5 } });
  mockPrisma.order.findMany.mockResolvedValue(mockRecentOrders);
  mockPrisma.order.groupBy.mockResolvedValue([
    { status: "COMPLETED", _count: { _all: 2 } },
    { status: "PLACED", _count: { _all: 1 } },
  ]);
  mockPrisma.user.count.mockResolvedValue(10);
});

afterEach(() => {
  consoleErrorSpy?.mockRestore();
});

describe("GET /api/dashboard/me", () => {
  test("should return user dashboard summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/me")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.summary).toHaveProperty("totalOrders", 3);
    expect(res.body.summary).toHaveProperty("paidTotal", 75.5);
    expect(Array.isArray(res.body.orderStatusBreakdown)).toBe(true);
    expect(Array.isArray(res.body.recentOrders)).toBe(true);
  });

  test("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/api/dashboard/me");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/dashboard/admin", () => {
  test("should return admin dashboard summary", async () => {
    const res = await request(app)
      .get("/api/dashboard/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.summary).toHaveProperty("users", 10);
    expect(res.body.summary).toHaveProperty("orders", 3);
    expect(res.body.summary).toHaveProperty("paidRevenue", 75.5);
    expect(Array.isArray(res.body.recentOrders)).toBe(true);
  });

  test("should return 403 for non-ADMIN users", async () => {
    const res = await request(app)
      .get("/api/dashboard/admin")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
  });

  test("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/api/dashboard/admin");
    expect(res.status).toBe(401);
  });
});
