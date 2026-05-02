// Seed script: populates the Menu table with sample Hawaiian menu items.
// Run via:  npx prisma db seed
//       or: npm run db:seed   (from apps/backend/)

require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { databaseUrl } = require("../src/config/databaseUrl");

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const menuItems = [
  {
    name: "Spam Musubi",
    description:
      "Grilled SPAM on a block of rice wrapped with nori. A Hawaiian classic.",
    price: 4.99,
    category: "Snack",
    image: null,
    isAvailable: true,
  },
  {
    name: "Poke Bowl",
    description:
      "Fresh ahi tuna marinated in shoyu, sesame oil, and green onion over steamed rice.",
    price: 14.99,
    category: "Entree",
    image: null,
    isAvailable: true,
  },
  {
    name: "Loco Moco",
    description:
      "White rice topped with a beef patty, fried egg, and rich brown gravy.",
    price: 12.99,
    category: "Entree",
    image: null,
    isAvailable: true,
  },
  {
    name: "Plate Lunch",
    description:
      "Two scoops of rice, macaroni salad, and your choice of protein.",
    price: 11.99,
    category: "Entree",
    image: null,
    isAvailable: true,
  },
  {
    name: "Garlic Shrimp",
    description:
      "Juicy shrimp sautéed in butter and garlic, served over steamed rice.",
    price: 13.99,
    category: "Entree",
    image: null,
    isAvailable: true,
  },
  {
    name: "Malasada",
    description:
      "Portuguese-style fried doughnut, dusted in sugar. No hole in the middle!",
    price: 3.5,
    category: "Dessert",
    image: null,
    isAvailable: true,
  },
  {
    name: "Shave Ice",
    description:
      "Finely shaved ice topped with tropical syrups. Add azuki beans or ice cream.",
    price: 5.99,
    category: "Dessert",
    image: null,
    isAvailable: true,
  },
  {
    name: "Coconut Chips",
    description:
      "Lightly toasted coconut chips with a hint of sea salt and honey.",
    price: 3.99,
    category: "Snack",
    image: null,
    isAvailable: true,
  },
  {
    name: "Haupia",
    description: "Traditional Hawaiian coconut milk pudding, served chilled.",
    price: 4.5,
    category: "Dessert",
    image: null,
    isAvailable: true,
  },
  {
    name: "Manapua",
    description:
      "Steamed bun filled with seasoned char siu pork. Hawaiian dim sum favorite.",
    price: 4.99,
    category: "Snack",
    image: null,
    isAvailable: true,
  },
];

async function main() {
  console.log("🌺 Seeding menu items...");

  for (const item of menuItems) {
    const existing = await prisma.menu.findFirst({
      where: { name: item.name },
    });
    if (existing) {
      console.log(`  ⏭  Skipped (already exists): ${item.name}`);
    } else {
      await prisma.menu.create({ data: item });
      console.log(`  ✅ Created: ${item.name}`);
    }
  }

  console.log("🌺 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
