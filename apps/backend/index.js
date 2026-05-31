require("dotenv/config");
const express = require("express");
const cors = require("cors");

const menuRoutes = require("./src/routes/menuRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const authRoutes = require("./src/routes/authRoutes");
const realtimeRoutes = require("./src/routes/realtimeRoutes");
const logger = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/realtime", realtimeRoutes);

app.get("/", (req, res) => {
  res.send("Taste of Aloha backend is running 🌺");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Good Vibes 🌺",
    timestamp: new Date().toISOString(),
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
