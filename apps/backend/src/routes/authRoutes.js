const express = require("express");
const authController = require("../controllers/authController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { rateLimit } = require("../middleware/rateLimit");

const router = express.Router();

// Strict rate limit for credential endpoints (10 requests / minute per IP).
const authRateLimit = rateLimit({ max: 10, windowMs: 60_000 });

router.post("/register", authRateLimit, authController.register);
router.post("/login", authRateLimit, authController.login);
router.post("/guest", authRateLimit, authController.guestAuth);
router.get("/me", requireAuth, authController.me);
router.patch("/users/:id/role", requireAuth, requireRole("ADMIN"), authController.updateUserRole);

module.exports = router;
