const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.use(requireAuth);

router.get("/", notificationController.listMyNotifications);
router.patch("/read-all", notificationController.markAllRead);
router.patch("/:id/read", notificationController.markOneRead);

module.exports = router;
