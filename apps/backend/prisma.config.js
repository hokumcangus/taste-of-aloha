import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDbUser = process.env.PRISMA_FALLBACK_DB_USER ?? "local_user";
const fallbackDbPassword =
  process.env.PRISMA_FALLBACK_DB_PASSWORD ?? "local_password";
const fallbackDbHost = process.env.PRISMA_FALLBACK_DB_HOST ?? "localhost";
const fallbackDbPort = process.env.PRISMA_FALLBACK_DB_PORT ?? "5432";
const fallbackDbName = process.env.PRISMA_FALLBACK_DB_NAME ?? "taste_of_aloha";

const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL ??
  `postgresql://${fallbackDbUser}:${fallbackDbPassword}@${fallbackDbHost}:${fallbackDbPort}/${fallbackDbName}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/menu.seed.js",
  },
  datasource: {
    // Use unpooled URL for migrations (shadow DB needs direct connection)
    // The app runtime uses the pooled DATABASE_URL via src/config/databaseUrl.js
    url: process.env.databaseUrl, // This will be DATABASE_URL_UNPOOLED if set, otherwise falls back to DATABASE_URL or constructed URL 
  },
});

export default defineConfig;
