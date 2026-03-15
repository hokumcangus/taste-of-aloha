import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(
    fs.readFileSync('./prisma/menu.seed.json', 'utf-8')
  );

  console.log(`🌺 Seeding ${data.length} menu items…`);

  for (const item of data) {
    await prisma.menu.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isAvailable: item.isAvailable
      }
    });
  }

  console.log('✅ Menu seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
