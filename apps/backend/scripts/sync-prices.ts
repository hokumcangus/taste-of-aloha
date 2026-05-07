import { chromium } from 'playwright';
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
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Navigating to ${MENU_URL} ...`);
  await page.goto(MENU_URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Card selector: avoids Tailwind bracket classes (h-[120px]) which need CSS escaping
  const CARD_SEL = 'div.flex.shadow-md.rounded-b-md.cursor-pointer.bg-white';
  const NAME_SEL = 'span.line-clamp-1.text-lg.font-medium.text-ellipsis';
  const PRICE_SEL = 'span.text-sm.font-medium.pl-3';

  await page.waitForSelector(CARD_SEL, { timeout: 15000 }).catch(() => {
    console.warn('⚠️  Card selector not found — Clover may have updated their markup.');
  });

  const items = await page.evaluate(([card, nameSel, priceSel]) => {
    return Array.from(document.querySelectorAll(card)).map((el) => {
      const name = el.querySelector(nameSel)?.textContent?.trim() ?? '';
      const rawPrice = el.querySelector(priceSel)?.textContent?.trim() ?? '';
      const isAvailable = !el.textContent?.includes('Unavailable');
      const price = parseFloat(rawPrice.replace(/[^0-9.-]+/g, ''));
      return { name, price, isAvailable };
    }).filter(({ name, price }) => name && !isNaN(price));
  }, [CARD_SEL, NAME_SEL, PRICE_SEL]);

  await browser.close();

  console.log(`Found ${items.length} item(s). Updating database...`);

  for (const item of items) {
    await prisma.menu.updateMany({
      where: { name: item.name },
      data: { price: item.price, isAvailable: item.isAvailable },
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