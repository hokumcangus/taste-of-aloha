const express = require("express");
const paymentController = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Raw body required for Stripe webhook signature verification.
// express.raw() here only applies to this single route.
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.handleWebhook);
router.post("/intent", requireAuth, paymentController.createIntent);

module.exports = router;
