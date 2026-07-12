const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

jest.mock("pg", () => ({ Pool: jest.fn(() => ({})) }));
jest.mock("@prisma/adapter-pg", () => ({ PrismaPg: jest.fn(() => ({})) }));

let mockPrisma;
jest.mock("@prisma/client", () => {
  mockPrisma = {
    order: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const paymentRoutes = require("../src/routes/paymentRoutes");

// Mount raw body middleware for webhook route (mirrors index.js setup)
const app = express();
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use("/api/payments", paymentRoutes);

const JWT_SECRET = "dev-secret-change-me";
const customerToken = jwt.sign({ sub: 5, email: "c@test.com", role: "CUSTOMER" }, JWT_SECRET);

let consoleErrorSpy;

beforeEach(() => {
  jest.clearAllMocks();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  // Ensure STRIPE_SECRET_KEY is unset so mock fallback is used
  delete process.env.STRIPE_SECRET_KEY;
});

afterEach(() => {
  consoleErrorSpy?.mockRestore();
});

describe("POST /api/payments/intent", () => {
  test("should return a mock payment intent when STRIPE_SECRET_KEY is not set", async () => {
    const res = await request(app)
      .post("/api/payments/intent")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 25.99, method: "card" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("clientSecret");
    expect(res.body.clientSecret).toMatch(/^mock_pi_/);
    expect(res.body).toHaveProperty("intentId");
    expect(res.body.intentId).toMatch(/^mock_pi_/);
    expect(res.body.amount).toBe(25.99);
    expect(res.body.provider).toBe("mock");
  });

  test("should return 400 if amount is missing or zero", async () => {
    const res = await request(app)
      .post("/api/payments/intent")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 0 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/positive amount/i);
  });

  test("should return 400 if amount is negative", async () => {
    const res = await request(app)
      .post("/api/payments/intent")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: -10 });

    expect(res.status).toBe(400);
  });

  test("should return 401 if not authenticated", async () => {
    const res = await request(app)
      .post("/api/payments/intent")
      .send({ amount: 10 });

    expect(res.status).toBe(401);
  });
});

describe("POST /api/payments/webhook", () => {
  test("should return 200 in mock mode (no STRIPE_SECRET_KEY)", async () => {
    const res = await request(app)
      .post("/api/payments/webhook")
      .set("Content-Type", "application/json")
      .send(Buffer.from(JSON.stringify({ type: "payment_intent.succeeded" })));

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
    expect(res.body.provider).toBe("mock");
  });
});
