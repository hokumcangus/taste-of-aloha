import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

dotenv.config();

type ScrapedImage = {
  itemName: string;
  imageUrl: string;
  price?: number;
};

const __dirname = path.dirname(process.argv[1]);
const IMAGE_DIR = path.join(__dirname, '../public/menu-images');
const OUTPUT_MAP_FILE = path.join(__dirname, 'menu-image-map.ndjson');
const ALIASES_FILE = path.join(__dirname, 'menu-item-aliases.json');

// Load aliases mapping
let aliases: Record<string, string> = {};
try {
  if (fs.existsSync(ALIASES_FILE)) {
    const aliasesJson = fs.readFileSync(ALIASES_FILE, 'utf8');
    aliases = JSON.parse(aliasesJson);
  }
} catch (err) {
  console.warn('Could not load aliases file:', err instanceof Error ? err.message : String(err));
}

const args = process.argv.slice(2);
const shouldUpdateDb = args.includes('--db');
const urlArg = args.find((entry) => entry.startsWith('--url='));
const MENU_URL =
  urlArg?.split('=')[1] ||
  process.env.MENU_URL ||
  'https://www.ordertasteofaloha.com/order';

function normalizeName(name: string): string {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function resolveActualName(itemName: string, nameIndex: Map<string, number[]>): { resolved: string; found: boolean } {
  const normalized = normalizeName(itemName);
  
  // Check if alias exists for this normalized name
  if (aliases[normalized]) {
    return { resolved: aliases[normalized], found: nameIndex.has(normalizeName(aliases[normalized])) };
  }
  
  // Fall back to direct lookup
  return { resolved: itemName, found: nameIndex.has(normalized) };
}

function toFileSafeBase(name: string): string {
  return normalizeName(name).replace(/\s+/g, '-');
}

function getFileExtension(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    const ext = path.extname(url.pathname).toLowerCase();
    if (ext === '.png' || ext === '.webp' || ext === '.jpeg' || ext === '.jpg') {
      return ext;
    }
  } catch {
    // fall through to default
  }
  return '.jpg';
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    file.on('error', reject);
    const protocol = url.startsWith('https') ? https : http;
    protocol
      .get(url, (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          fs.unlink(dest, () => {});
          reject(new Error(`Image download failed with status ${res.statusCode || 'unknown'}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function scrapeMenuImages(menuUrl: string): Promise<ScrapedImage[]> {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Navigating to ${menuUrl} ...`);
  await page.goto(menuUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  const rows = await page.evaluate(() => {
    const found: Array<{ itemName: string; imageUrl: string; price?: number }> = [];

    const itemCards = Array.from(document.querySelectorAll('new-menufy-item-card[item-image-url]'));
    for (const card of itemCards) {
      const imageUrl = card.getAttribute('item-image-url') || '';
      const itemName = card.getAttribute('item-name') || '';
      if (itemName && imageUrl) {
        const priceStr = card.getAttribute('item-price') || '';
        let price: number | undefined;
        if (priceStr) {
          price = parseFloat(priceStr);
          if (isNaN(price)) {
            price = undefined;
          }
        }
        found.push({ itemName: itemName.trim(), imageUrl: imageUrl.trim(), price });
      }
    }

    const imgTags = Array.from(document.querySelectorAll('img'));
    for (const img of imgTags) {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      if (!src) {
        continue;
      }

      let itemName = '';
      const altMatch = alt.match(/^image of\s+(.+)$/i);
      if (altMatch?.[1]) {
        itemName = altMatch[1].trim();
      }

      if (!itemName) {
        const card = img.closest('div, li, article, section');
        const heading = card?.querySelector('h3, h4, .menu-item-name, .line-clamp-1');
        itemName = heading?.textContent?.trim() || '';
      }

      if (!itemName) {
        continue;
      }

      found.push({ itemName, imageUrl: src, price: undefined });
    }

    return found;
  });

  await browser.close();

  const byName = new Map<string, ScrapedImage>();
  for (const row of rows) {
    const key = normalizeName(row.itemName);
    if (!key || byName.has(key)) {
      continue;
    }
    byName.set(key, {
      itemName: row.itemName,
      imageUrl: row.imageUrl,
      price: row.price
    });
  }

  return Array.from(byName.values());
}

async function maybeCreatePrismaClient(): Promise<PrismaClient | null> {
  if (!shouldUpdateDb) {
    return null;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required when using --db');
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

async function writeImageMappings(items: ScrapedImage[]) {
  const lines = items.map((entry) => JSON.stringify(entry)).join('\n');
  fs.writeFileSync(OUTPUT_MAP_FILE, `${lines}\n`, 'utf8');
  console.log(`Saved image map: ${OUTPUT_MAP_FILE}`);
}

async function migrateImages() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }

  const prisma = await maybeCreatePrismaClient();

  try {
    const items = await scrapeMenuImages(MENU_URL);
    console.log(`Found ${items.length} menu item image candidate(s).`);

    await writeImageMappings(items);

    let linkedCount = 0;
    let priceUpdateCount = 0;
    let nameIndex = new Map<string, number[]>();
    if (prisma) {
      const dbMenus = await prisma.menu.findMany({
        select: { id: true, name: true },
      });

      for (const menu of dbMenus) {
        const key = normalizeName(menu.name);
        if (!key) {
          continue;
        }

        const existing = nameIndex.get(key) || [];
        existing.push(menu.id);
        nameIndex.set(key, existing);
      }
    }

    for (const { itemName, imageUrl, price } of items) {
      const safeBaseName = toFileSafeBase(itemName);
      const extension = getFileExtension(imageUrl);
      const fileName = `${safeBaseName}${extension}`;
      const filePath = path.join(IMAGE_DIR, fileName);

      try {
        await downloadFile(imageUrl, filePath);

        if (prisma) {
          const { resolved, found } = resolveActualName(itemName, nameIndex);
          const ids = nameIndex.get(normalizeName(resolved)) || [];

          if (ids.length === 0) {
            console.warn(`No DB match for menu item: ${itemName}`);
            continue;
          }

          const updateData: any = { image: `/menu-images/${fileName}` };
          if (price !== undefined) {
            updateData.price = price;
          }

          const updated = await prisma.menu.updateMany({
            where: {
              id: { in: ids },
            },
            data: updateData,
          });
          linkedCount += updated.count;
          if (price !== undefined) {
            priceUpdateCount += updated.count;
          }
        }

        const priceStr = price !== undefined ? ` | $${price.toFixed(2)}` : '';
        console.log(`Saved image: ${itemName} -> /menu-images/${fileName}${priceStr}`);
      } catch (err) {
        console.error(`Failed for ${itemName}:`, err instanceof Error ? err.message : String(err));
      }
    }

    if (prisma) {
      console.log(`DB link updates applied: ${linkedCount}`);
      if (priceUpdateCount > 0) {
        console.log(`Price updates applied: ${priceUpdateCount}`);
      }
    } else {
      console.log('Dry-run mode complete (no DB writes). Re-run with --db to update Menu.image values.');
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
  }
}

migrateImages().catch((err) => {
  console.error('Fatal:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});