const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL connection pool
 * Uses environment variables for configuration
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  // Log the error but don't exit - let the application handle the error gracefully
});

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = (text, params) => {
  return pool.query(text, params);
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
const getClient = () => {
  return pool.connect();
};

module.exports = {
  query,
  getClient,
  pool,
};
