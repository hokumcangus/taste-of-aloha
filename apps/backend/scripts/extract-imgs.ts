import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);
const IMAGE_DIR = path.join(__dirname, '../public/menu-images');
const MENU_URL = 'https://taste-of-aloha-marysville.cloveronline.com/menu/all';

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    file.on('error', reject); // attach before any I/O
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // clean up partial file
      reject(err);
    });
  });
}

async function migrateImages() {
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Navigating to ${MENU_URL} ...`);
  await page.goto(MENU_URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Card selector: avoids Tailwind bracket classes (h-[120px]) which need CSS escaping
  const CARD_SEL = 'div.flex.shadow-md.rounded-b-md.cursor-pointer.bg-white';
  const NAME_SEL = 'span.line-clamp-1.text-lg.font-medium.text-ellipsis';

  await page.waitForSelector(CARD_SEL, { timeout: 15000 }).catch(() => {
    console.warn('⚠️  Card selector not found — Clover may have updated their markup.');
  });

  const items = await page.evaluate(([card, nameSel]) => {
    return Array.from(document.querySelectorAll(card)).map((el) => ({
      itemName: el.querySelector(nameSel)?.textContent?.trim() ?? '',
      imageUrl: (el.querySelector('img') as HTMLImageElement | null)?.src ?? '',
    })).filter(({ itemName, imageUrl }) => itemName && imageUrl);
  }, [CARD_SEL, NAME_SEL]);

  await browser.close();

  console.log(`Found ${items.length} menu item(s) to process.`);

  for (const { itemName, imageUrl } of items) {
    // Sanitize: lowercase first, then replace path-unsafe chars
    const safeBaseName = itemName.toLowerCase().replace(/[/\\]/g, '-').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const fileName = `${safeBaseName}.jpg`;
    const filePath = path.join(IMAGE_DIR, fileName);
    try {
      await downloadFile(imageUrl, filePath);
      await prisma.menu.updateMany({
        where: { name: itemName },
        data: { image: `/menu-images/${fileName}` },
      });
      console.log(`✅ Saved & Linked: ${itemName}`);
    } catch (err) {
      console.error(`❌ Failed for ${itemName}:`, err instanceof Error ? err.message : String(err));
    }
  }

  console.log('Migration complete!');
}

migrateImages()
  .catch((err) => {
    console.error('Fatal:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect().catch(() => {}));