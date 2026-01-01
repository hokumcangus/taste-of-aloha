import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import menuRoutes from './src/routes/menuRoutes.js';
import logger from './src/utils/logger.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger.middleware);

// Routes
app.use('/api/menu', menuRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});