const express = require("express");
const paymentController = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/intent", requireAuth, paymentController.createIntent);

module.exports = router;
