import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDatabaseUrl = `postgresql://${
  process.env.PRISMA_FALLBACK_DB_USER ?? "local_user"
}:${process.env.PRISMA_FALLBACK_DB_PASSWORD ?? "local_password"}@$${""}`;

const databaseUrl =
  process.env.DATABASE_URL ??
  `postgresql://${
    process.env.PRISMA_FALLBACK_DB_USER ?? "local_user"
  }:${process.env.PRISMA_FALLBACK_DB_PASSWORD ?? "local_password"}@$${""}`;

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
