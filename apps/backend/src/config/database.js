const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { databaseUrl } = require("./databaseUrl");

/**
 * Shared Prisma client for the application.
 * Uses the PrismaPg adapter so the same pg Pool is reused across requests.
 *
 * Import this module wherever you need database access:
 *   const { prisma } = require('./config/database');
 */
const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = { prisma, pool };
