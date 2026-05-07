import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const MENU_URL = 'https://taste-of-aloha-marysville.cloveronline.com/menu/all';

async function syncPrices() {
  console.log('Fetching live menu data...');

  const { data } = await axios.get(MENU_URL);
  const $ = cheerio.load(data);

  const items: { name: string; price: number; isAvailable: boolean }[] = [];

  $('.menu-item-card').each((_, element) => {
    const name = $(element).find('.item-name').text().trim();
    const rawPrice = $(element).find('.item-price').text().trim();
    const isAvailable = !$(element).text().includes('Unavailable');
    const price = parseFloat(rawPrice.replace(/[^0-9.-]+/g, ''));
    if (name && !isNaN(price)) {
      items.push({ name, price, isAvailable });
    }
  });

  console.log(`Found ${items.length} item(s). Updating database...`);

  for (const item of items) {
    await prisma.menu.updateMany({
      where: { name: item.name },
      data: {
        price: item.price,
        isAvailable: item.isAvailable,
      },
    });
    console.log(`✅ Updated: ${item.name} → $${item.price}`);
  }

  console.log('Sync complete!');
}

syncPrices()
  .catch((err) => {
    console.error('Error syncing prices:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());