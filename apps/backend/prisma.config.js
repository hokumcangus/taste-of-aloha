import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDbUser = process.env.PRISMA_FALLBACK_DB_USER ?? "postgres";
const fallbackDbPassword =
  process.env.PRISMA_FALLBACK_DB_PASSWORD ?? "postgres";
const fallbackDbHost = process.env.PRISMA_FALLBACK_DB_HOST ?? "localhost";
const fallbackDbPort = process.env.PRISMA_FALLBACK_DB_PORT ?? "5432";
const fallbackDbName = process.env.PRISMA_FALLBACK_DB_NAME ?? "taste_of_aloha";

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  process.env.tasteofalohadb_POSTGRES_PRISMA_URL ??
  process.env.tasteofalohadb_POSTGRES_URL ??
  process.env.tasteofalohadb_DATABASE_URL ??
  `postgresql://${fallbackDbUser}:${fallbackDbPassword}@${fallbackDbHost}:${fallbackDbPort}/${fallbackDbName}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/menu.seed.js",
  },
  datasource: {
    // `prisma generate` does not require a live DB connection, but Prisma config
    // must still have a valid URL at load time (e.g., on Vercel build).
    url: databaseUrl,
  },
});
