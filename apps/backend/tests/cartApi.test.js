const request = require("supertest");
const express = require("express");

let mockPrisma;
let mockTx;

jest.mock("pg", () => ({
  Pool: jest.fn(() => ({})),
}));

jest.mock("@prisma/adapter-pg", () => ({
  PrismaPg: jest.fn(() => ({})),
}));

jest.mock("@prisma/client", () => {
  mockTx = {
    cartItem: {
      deleteMany: jest.fn(),
    },
    cart: {
      update: jest.fn(),
    },
  };

  mockPrisma = {
    menu: {
      findMany: jest.fn(),
    },
    cart: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(async (fn) => fn(mockTx)),
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

let consoleErrorSpy;
const cartRoutes = require("../src/routes/cartRoutes");

const app = express();
app.use(express.json());
app.use("/api/cart", cartRoutes);

describe("Cart API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockPrisma.cart.create.mockImplementation(async ({ data }) => ({
      id: 10,
      userId: data.userId || null,
      total: data.total || 0,
      itemCount: data.itemCount || 0,
      items: (data.items?.create || []).map((item, index) => ({
        id: index + 1,
        ...item,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    mockTx.cart.update.mockImplementation(async ({ where, data }) => ({
      id: where.id,
      userId: data.userId || null,
      total: data.total || 0,
      itemCount: data.itemCount || 0,
      items: (data.items?.create || []).map((item, index) => ({
        id: index + 1,
        ...item,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
      consoleErrorSpy = null;
    }
  });

  test("POST /api/cart should compute totals from menu prices", async () => {
    mockPrisma.menu.findMany.mockResolvedValue([{ id: 1, price: 5 }]);

    const response = await request(app)
      .post("/api/cart")
      .send({ items: [{ menuId: 1, quantity: 3 }] });

    expect(response.status).toBe(201);
    expect(response.body.itemCount).toBe(3);
    expect(response.body.total).toBe(15);
    expect(response.body.items[0]).toMatchObject({
      menuId: 1,
      quantity: 3,
      price: 5,
      subtotal: 15,
    });
  });

  test("POST /api/cart should return 400 for invalid menu id", async () => {
    mockPrisma.menu.findMany.mockResolvedValue([]);

    const response = await request(app)
      .post("/api/cart")
      .send({ items: [{ menuId: 999, quantity: 1 }] });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Menu item\(s\) not found/i);
  });

  test("PUT /api/cart/:id should return 404 when cart does not exist", async () => {
    mockPrisma.cart.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/cart/404")
      .send({ items: [{ menuId: 1, quantity: 2 }] });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Cart item not found");
  });
});
