const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

jest.mock("pg", () => ({ Pool: jest.fn(() => ({})) }));
jest.mock("@prisma/adapter-pg", () => ({ PrismaPg: jest.fn(() => ({})) }));

let mockPrisma;
jest.mock("@prisma/client", () => {
  mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(async () => "hashed_password"),
  compare: jest.fn(async () => true),
}));

const bcrypt = require("bcrypt");
const authRoutes = require("../src/routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

const JWT_SECRET = "dev-secret-change-me";
const makeAdminToken = (id = 1) =>
  jwt.sign({ sub: id, email: "admin@test.com", role: "ADMIN" }, JWT_SECRET);
const makeCustomerToken = (id = 2) =>
  jwt.sign({ sub: id, email: "user@test.com", role: "CUSTOMER" }, JWT_SECRET);

const mockUser = {
  id: 1,
  email: "hoku@aloha.com",
  name: "Hoku",
  passwordHash: "hashed_password",
  role: "CUSTOMER",
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

describe("POST /api/auth/register", () => {
  test("should register a user and return a JWT token", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "hoku@aloha.com", password: "password123", name: "Hoku" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("hoku@aloha.com");
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  test("should return 409 if email already registered", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "hoku@aloha.com", password: "password123" });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);
  });

  test("should return 400 if password is too short", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "hoku@aloha.com", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/8 characters/i);
  });

  test("should return 400 if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "hoku@aloha.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });
});

describe("POST /api/auth/login", () => {
  test("should return a JWT token for valid credentials", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "hoku@aloha.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("hoku@aloha.com");
  });

  test("should return 401 for wrong password", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "hoku@aloha.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  test("should return 401 if user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ghost@aloha.com", password: "password123" });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  test("should return user profile when authenticated", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${makeCustomerToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("hoku@aloha.com");
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  test("should return 401 if no token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  test("should return 401 if token is invalid", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer notarealtoken");
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/auth/users/:id/role", () => {
  test("should update role as ADMIN", async () => {
    mockPrisma.user.update.mockResolvedValue({
      ...mockUser,
      role: "ADMIN",
    });

    const res = await request(app)
      .patch("/api/auth/users/1/role")
      .set("Authorization", `Bearer ${makeAdminToken()}`)
      .send({ role: "ADMIN" });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("ADMIN");
  });

  test("should return 403 if not ADMIN", async () => {
    const res = await request(app)
      .patch("/api/auth/users/2/role")
      .set("Authorization", `Bearer ${makeCustomerToken()}`)
      .send({ role: "ADMIN" });

    expect(res.status).toBe(403);
  });

  test("should return 400 for invalid role", async () => {
    const res = await request(app)
      .patch("/api/auth/users/1/role")
      .set("Authorization", `Bearer ${makeAdminToken()}`)
      .send({ role: "SUPERUSER" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/CUSTOMER or ADMIN/i);
  });
});

describe("POST /api/auth/guest", () => {
  const guestUser = {
    id: 10,
    email: "guest_8085551234@guest.taste-of-aloha.local",
    phone: "8085551234",
    name: null,
    passwordHash: "",
    role: "GUEST",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  test("should create a new guest user and return a JWT", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(guestUser);

    const res = await request(app)
      .post("/api/auth/guest")
      .send({ phone: "808-555-1234" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.role).toBe("GUEST");
    expect(res.body.user.phone).toBe("8085551234");
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  test("should return the same token for a returning guest (same phone)", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(guestUser);

    const res = await request(app)
      .post("/api/auth/guest")
      .send({ phone: "8085551234" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    // create should NOT have been called since user already exists
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  test("should return 400 for a phone number that is too short", async () => {
    const res = await request(app)
      .post("/api/auth/guest")
      .send({ phone: "123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/10/);
  });

  test("should return 400 if phone is missing", async () => {
    const res = await request(app)
      .post("/api/auth/guest")
      .send({});

    expect(res.status).toBe(400);
  });
});

