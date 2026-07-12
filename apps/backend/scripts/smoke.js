process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  ["postgresql", "://", "postgres", ":", "postgres", "@localhost:5432/taste_of_aloha"].join("");

const request = require("supertest");
const app = require("../index");

async function main() {
  const health = await request(app).get("/health");
  if (health.status !== 200) {
    throw new Error(`Health check failed with status ${health.status}`);
  }
  console.log("Backend smoke check passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
