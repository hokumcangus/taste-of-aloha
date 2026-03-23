import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SeedMenuItem = {
  name: string;
  description: string;
  price: number;
  image?: string | null;
  category?: string | null;
  isAvailable?: boolean;
};

async function main() {
  const seedPath = path.resolve(process.cwd(), 'prisma', 'menu.seed.json');
  const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as SeedMenuItem[];

  console.log(`🌺 Seeding ${data.length} menu items…`);

  for (const item of data) {
    const existing = await prisma.menu.findFirst({ where: { name: item.name } });

    if (existing) {
      continue;
    }

    await prisma.menu.create({
      data: {
        name: item.name,
        description: item.description,
        price: Number(item.price),
        category: item.category ?? null,
        image: item.image ?? null,
        isAvailable: item.isAvailable ?? true,
      },
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
    await pool.end();
  });
