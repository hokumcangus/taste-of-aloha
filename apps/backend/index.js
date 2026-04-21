require("dotenv").config();
const express = require("express");
const cors = require("cors");
const menuRoutes = require("./src/routes/menuRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const logger = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Taste of Aloha backend is running 🌺");
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "Good Vibes 🌺", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
