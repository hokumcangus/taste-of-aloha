const express = require('express');
const cors = require('cors');
const menuRoutes = require('./src/routes/menuRoutes');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => {
  res.send('Taste of Aloha backend is running 🌺');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
