const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

jest.mock("pg", () => ({ Pool: jest.fn(() => ({})) }));
jest.mock("@prisma/adapter-pg", () => ({ PrismaPg: jest.fn(() => ({})) }));

let mockPrisma;
jest.mock("@prisma/client", () => {
  mockPrisma = {
    menu: { findMany: jest.fn() },
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cart: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const orderRoutes = require("../src/routes/orderRoutes");

const app = express();
app.use(express.json());
app.use("/api/orders", orderRoutes);

const JWT_SECRET = "dev-secret-change-me";
const customerToken = jwt.sign({ sub: 5, email: "c@test.com", role: "CUSTOMER" }, JWT_SECRET);
const adminToken = jwt.sign({ sub: 1, email: "a@test.com", role: "ADMIN" }, JWT_SECRET);

const baseOrder = {
  id: 1,
  userId: 5,
  status: "PLACED",
  paymentStatus: "PAID",
  paymentMethod: "card",
  paymentReference: "mock_pi_123",
  total: 15,
  itemCount: 3,
  items: [{ id: 1, menuId: 1, menuName: "Spam Musubi", unitPrice: 5, quantity: 3, subtotal: 15 }],
  createdAt: new Date(),
  updatedAt: new Date(),
};

let consoleErrorSpy;

beforeEach(() => {
  jest.clearAllMocks();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy?.mockRestore();
});

describe("POST /api/orders", () => {
  test("should place an order from items when authenticated", async () => {
    mockPrisma.menu.findMany.mockResolvedValue([{ id: 1, name: "Spam Musubi", price: 5 }]);
    mockPrisma.order.create.mockResolvedValue(baseOrder);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ items: [{ menuId: 1, quantity: 3 }], paymentMethod: "card" });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(15);
    expect(res.body.userId).toBe(5);
  });

  test("should return 400 if items array is empty", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ items: [], paymentMethod: "card" });

    expect(res.status).toBe(400);
  });

  test("should return 401 if not authenticated", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ items: [{ menuId: 1, quantity: 1 }] });

    expect(res.status).toBe(401);
  });

  test("should return 400 if menu item not found", async () => {
    mockPrisma.menu.findMany.mockResolvedValue([]);

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ items: [{ menuId: 999, quantity: 1 }], paymentMethod: "card" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe("GET /api/orders", () => {
  test("customer should only see their own orders", async () => {
    mockPrisma.order.findMany.mockResolvedValue([baseOrder]);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Verify prisma was called with userId filter
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 5 } }),
    );
  });

  test("admin should see all orders (no userId filter)", async () => {
    mockPrisma.order.findMany.mockResolvedValue([baseOrder]);

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });
});

describe("GET /api/orders/:id", () => {
  test("should return order belonging to authenticated user", async () => {
    mockPrisma.order.findUnique.mockResolvedValue(baseOrder);

    const res = await request(app)
      .get("/api/orders/1")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test("should return 403 if order belongs to different user", async () => {
    mockPrisma.order.findUnique.mockResolvedValue({ ...baseOrder, userId: 99 });

    const res = await request(app)
      .get("/api/orders/1")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
  });

  test("should return 404 if order not found", async () => {
    mockPrisma.order.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/orders/999")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/orders/:id/status", () => {
  test("admin can update order status", async () => {
    mockPrisma.order.update.mockResolvedValue({ ...baseOrder, status: "PREPARING" });

    const res = await request(app)
      .patch("/api/orders/1/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PREPARING" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("PREPARING");
  });

  test("should return 403 if customer tries to update status", async () => {
    const res = await request(app)
      .patch("/api/orders/1/status")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ status: "PREPARING" });

    expect(res.status).toBe(403);
  });

  test("should return 400 for invalid status", async () => {
    const res = await request(app)
      .patch("/api/orders/1/status")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "DELIVERED" });

    expect(res.status).toBe(400);
  });
});
