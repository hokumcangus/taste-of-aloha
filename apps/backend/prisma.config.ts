import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/taste_of_aloha";

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
