import "dotenv/config";

// Prisma 7 CLI configuration
// Provides schema path and datasource URL for migrate commands
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};