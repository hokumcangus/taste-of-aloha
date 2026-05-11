const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", requireAuth, dashboardController.myDashboard);
router.get("/admin", requireAuth, requireRole("ADMIN"), dashboardController.adminDashboard);
router.get("/driver", requireAuth, requireRole("DRIVER"), dashboardController.driverDashboard);

module.exports = router;
