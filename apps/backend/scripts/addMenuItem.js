require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const [nameArg, priceArg] = process.argv.slice(2);
  const name = nameArg || 'Spam Musubi';
  const price = priceArg ? Number(priceArg) : 5.99;

  const item = await prisma.menu.create({
    data: {
      name,
      description: 'Sample menu item created via script',
      price,
      image: null,
      category: 'Specials',
    },
  });

  console.log('Menu item created:', item);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
