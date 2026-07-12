const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, requireRoles } = require("../middleware/auth");
const { rateLimit } = require("../middleware/rateLimit");

router.use(rateLimit({ max: 180, windowMs: 60000 }));
router.use(authenticate(true));

router.get(
  "/",
  requireRoles("CUSTOMER", "ADMIN", "KITCHEN", "DRIVER"),
  orderController.getOrders,
);
router.get(
  "/kitchen/queue",
  requireRoles("KITCHEN", "ADMIN"),
  orderController.getKitchenQueue,
);
router.get("/:id", requireRoles("CUSTOMER", "ADMIN", "KITCHEN", "DRIVER"), orderController.getOrderById);
router.post("/", requireRoles("CUSTOMER", "ADMIN"), orderController.placeOrder);
router.patch(
  "/:id/status",
  requireRoles("CUSTOMER", "ADMIN", "KITCHEN", "DRIVER"),
  orderController.transitionOrder,
);
router.post("/:id/assign-driver", requireRoles("ADMIN"), orderController.assignDriver);
router.post(
  "/:id/driver/location",
  requireRoles("DRIVER"),
  orderController.recordDriverLocation,
);
router.delete("/:id", requireRoles("ADMIN"), orderController.deleteOrder);

module.exports = router;