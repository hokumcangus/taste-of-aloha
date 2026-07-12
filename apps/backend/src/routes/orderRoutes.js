const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.placeOrder);
router.patch("/:id/status", requireRole("ADMIN", "DRIVER"), orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;