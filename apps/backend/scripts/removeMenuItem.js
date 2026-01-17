// Deletes a menu item by name. Usage:
//   node scripts/removeMenuItem.js "Garlic Shrimp"

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const itemName = process.argv[2];
  if (!itemName) {
    console.error('Error: Provide a menu item name to delete.');
    console.error('Example: node scripts/removeMenuItem.js "Garlic Shrimp"');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not set in environment.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const result = await prisma.menu.deleteMany({ where: { name: itemName } });
    console.log(`Removed ${result.count} item(s) named "${itemName}".`);
  } catch (err) {
    console.error('Failed to remove item:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
