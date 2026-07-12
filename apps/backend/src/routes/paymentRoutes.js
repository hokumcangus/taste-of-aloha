const express = require("express");
const paymentController = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Raw body for Stripe webhook signature verification is applied globally in index.js
// before express.json(), so no additional body parser is needed here.
router.post("/webhook", paymentController.handleWebhook);
router.post("/intent", requireAuth, paymentController.createIntent);

module.exports = router;
