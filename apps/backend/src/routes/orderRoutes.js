const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.placeOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;