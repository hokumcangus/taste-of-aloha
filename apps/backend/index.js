import express from "express";
import cors from "cors";
import "dotenv/config";

import menuRoutes from "./src/routes/menuRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import logger from "./src/utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Taste of Aloha backend is running 🌺");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Good Vibes 🌺",
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
