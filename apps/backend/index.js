require('dotenv').config();
const express = require('express');
const cors = require('cors');
const snackRoutes = require('./src/routes/snackRoutes');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/snacks', snackRoutes);

app.get('/', (req, res) => {
  res.send('Taste of Aloha backend is running 🌺');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
