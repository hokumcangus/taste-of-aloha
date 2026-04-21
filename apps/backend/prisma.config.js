import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDbUser = process.env.PRISMA_FALLBACK_DB_USER ?? "local_user";
const fallbackDbPassword =
  process.env.PRISMA_FALLBACK_DB_PASSWORD ?? "local_password";
const fallbackDbHost = process.env.PRISMA_FALLBACK_DB_HOST ?? "localhost";
const fallbackDbPort = process.env.PRISMA_FALLBACK_DB_PORT ?? "5432";
const fallbackDbName = process.env.PRISMA_FALLBACK_DB_NAME ?? "taste_of_aloha";

const databaseUrl =
  process.env.DATABASE_URL ??
  `postgresql://${fallbackDbUser}:${fallbackDbPassword}@${fallbackDbHost}:${fallbackDbPort}/${fallbackDbName}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    // `prisma generate` does not require a live DB connection, but Prisma config
    // must still have a valid URL at load time (e.g., on Vercel build).
    url: databaseUrl,
  },
});
