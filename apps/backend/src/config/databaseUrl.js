const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.tasteofalohadb_POSTGRES_PRISMA_URL ||
  process.env.tasteofalohadb_POSTGRES_URL ||
  process.env.tasteofalohadb_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database connection URL. Set DATABASE_URL or a supported POSTGRES_* variable.",
  );
}

module.exports = { databaseUrl };
