import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
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

async function migrateImages() {
  // Ensure directory exists
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

  const { data } = await axios.get('https://taste-of-aloha-marysville.cloveronline.com/menu/all');
  const $ = cheerio.load(data);

  console.log("Starting image migration...");

  // Collect items synchronously first, then process with async/await
  const items: { itemName: string; imageUrl: string }[] = [];
  $('.menu-item-card').each((_, el) => {
    const itemName = $(el).find('.item-name').text().trim();
    const imageUrl = $(el).find('img').attr('src');
    if (imageUrl && itemName) {
      items.push({ itemName, imageUrl });
    }
  });

  console.log(`Found ${items.length} menu item(s) to process.`);

  for (const { itemName, imageUrl } of items) {
    const fileName = `${itemName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    const filePath = path.join(IMAGE_DIR, fileName);

    try {
      // Download the image
      const response = await axios({ url: imageUrl, responseType: 'stream' });
      await new Promise<void>((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Update Prisma with the local path
      await prisma.menu.updateMany({
        where: { name: itemName },
        data: { image: `/menu-images/${fileName}` }
      });
      console.log(`✅ Saved & Linked: ${itemName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ Failed for ${itemName}:`, message);
    }
  }
}

migrateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());