const express = require("express");
const realtimeController = require("../controllers/realtimeController");
const { authenticate } = require("../middleware/auth");
const { rateLimit } = require("../middleware/rateLimit");

const router = express.Router();

router.get(
  "/stream",
  rateLimit({ max: 60, windowMs: 60000 }),
  authenticate(true),
  realtimeController.stream,
);
router.get(
  "/events",
  rateLimit({ max: 120, windowMs: 60000 }),
  authenticate(true),
  realtimeController.listEvents,
);

module.exports = router;
