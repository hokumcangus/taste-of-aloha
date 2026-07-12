const request = require("supertest");
const express = require("express");
const { authenticate, requireRoles, issueToken } = require("../src/middleware/auth");
const { rateLimit } = require("../src/middleware/rateLimit");

describe("auth middleware", () => {
  test("blocks missing token", async () => {
    const app = express();
    app.get(
      "/secure",
      rateLimit({ max: 10, windowMs: 60000 }),
      authenticate(),
      (_req, res) => res.json({ ok: true }),
    );
    const response = await request(app).get("/secure");
    expect(response.status).toBe(401);
  });

  test("allows role-based access", async () => {
    const app = express();
    app.get(
      "/admin",
      rateLimit({ max: 10, windowMs: 60000 }),
      authenticate(),
      requireRoles("ADMIN"),
      (_req, res) => res.json({ ok: true }),
    );
    const token = issueToken({ id: 10, email: "admin@test.dev", role: "ADMIN" });
    const response = await request(app)
      .get("/admin")
      .set("Authorization", ["Bearer", token].join(" "));
    expect(response.status).toBe(200);
  });

  test("rejects wrong role", async () => {
    const app = express();
    app.get(
      "/admin",
      rateLimit({ max: 10, windowMs: 60000 }),
      authenticate(),
      requireRoles("ADMIN"),
      (_req, res) => res.json({ ok: true }),
    );
    const token = issueToken({ id: 11, email: "driver@test.dev", role: "DRIVER" });
    const response = await request(app)
      .get("/admin")
      .set("Authorization", ["Bearer", token].join(" "));
    expect(response.status).toBe(403);
  });
});
