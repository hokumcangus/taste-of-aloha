import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: process.cwd() + '/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

// Shared Prisma client configured for PostgreSQL
const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});

export default prisma;
