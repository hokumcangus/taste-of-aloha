const { Pool } = require('pg');

/**
 * Shared Prisma client for the application.
 * Uses the PrismaPg adapter so the same pg Pool is reused across requests.
 *
 * Import this module wherever you need database access:
 *   const { prisma } = require('./config/database');
 */
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = { prisma, pool };

