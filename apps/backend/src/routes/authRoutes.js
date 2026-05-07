const express = require("express");
const authController = require("../controllers/authController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/guest", authController.guestAuth);
router.get("/me", requireAuth, authController.me);
router.patch("/users/:id/role", requireAuth, requireRole("ADMIN"), authController.updateUserRole);

module.exports = router;
