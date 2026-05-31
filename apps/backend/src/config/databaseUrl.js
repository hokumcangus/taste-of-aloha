const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.tasteofalohadb_POSTGRES_PRISMA_URL ||
  process.env.tasteofalohadb_POSTGRES_URL ||
  process.env.tasteofalohadb_DATABASE_URL ||
  (process.env.PRISMA_FALLBACK_DB_USER &&
    `postgresql://${process.env.PRISMA_FALLBACK_DB_USER}:${process.env.PRISMA_FALLBACK_DB_PASSWORD || "postgres"}@${process.env.PRISMA_FALLBACK_DB_HOST || "localhost"}:${process.env.PRISMA_FALLBACK_DB_PORT || "5432"}/${process.env.PRISMA_FALLBACK_DB_NAME || "taste_of_aloha"}`);

if (!databaseUrl) {
  throw new Error(
    "Missing database URL. Set DATABASE_URL, POSTGRES_* vars, or PRISMA_FALLBACK_DB_* vars.",
  );
}

module.exports = { databaseUrl };
