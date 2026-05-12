require("dotenv/config");
const express = require("express");
const cors = require("cors");

const menuRoutes = require("./src/routes/menuRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const authRoutes = require("./src/routes/authRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const logger = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
// Stripe webhook requires the raw request body for signature verification.
// Must be registered before express.json() so the webhook route receives
// the raw Buffer instead of a parsed object.
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(logger);

// Serve static files from public directory
app.use(express.static("public"));

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Taste of Aloha backend is running 🌺");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Good Vibes 🌺",
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
