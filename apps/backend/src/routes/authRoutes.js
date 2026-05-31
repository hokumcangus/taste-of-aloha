const express = require("express");
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { rateLimit } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/login", rateLimit({ max: 10, windowMs: 60000 }), authController.login);
router.get(
  "/me",
  rateLimit({ max: 120, windowMs: 60000 }),
  authenticate(true),
  authController.me,
);

module.exports = router;
