# ⚙️ Taste of Aloha — Backend

The Express server and Prisma ORM layer for Taste of Aloha.

## 🧪 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **ORM**: Prisma 7 with PostgreSQL adapter
- **Database**: PostgreSQL 16+ (Docker default is 16-alpine)
- **Testing**: Jest + Supertest

## 🗄 Database (Prisma 7)

We use Prisma to interface with PostgreSQL. The schema defines all data models (Menu, User, Order, etc.).

**Key Files:**
- `prisma/schema.prisma` — Data models
- `prisma.config.ts` - Prisma CLI configuration and env loading
- `prisma/migrations/` — Version-controlled database changes
- `.env` — Database connection string (DATABASE_URL)

**Important:** Prisma 7 uses an external config file (`prisma.config.ts`) to read environment variables.

## 🛠 Database Commands

### Apply Schema Changes

```bash
npm run db:migrate
# or: npx prisma migrate dev --name <description>
```

Example:
```bash
npx prisma migrate dev --name add_orders_table
```

This creates a migration file and applies it to the database.

### Deploy Migrations (production / CI)

```bash
npm run db:migrate:deploy
# or: npx prisma migrate deploy
```

### Generate/Update Prisma Client

```bash
npm run db:generate
# or: npx prisma generate
```

### Seed the Database

```bash
npm run db:seed
# or: npx prisma db seed
```

Populates the Menu table with sample Hawaiian menu items defined in `prisma/seed.js`.

### Add a Single Menu Item (CLI)

```bash
npm run seed:menu              # adds default "Spam Musubi"
npm run seed:menu "Poke Bowl" 12.99
```

### View Data in Prisma Studio

```bash
npm run db:studio
# or: npx prisma studio
```

Opens an interactive GUI at http://localhost:5555 to view and edit database records.

### Reset Database (⚠️ Deletes all data)

```bash
npm run db:reset
# or: npx prisma migrate reset
```

## 🚀 Getting Started

### Local Development

```bash
cd apps/backend
npm install

# Ensure .env has the correct DATABASE_URL
npm run dev
```

### PowerShell Copy/Paste Setup Check

```powershell
cd /path/to/taste-of-aloha
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue

docker compose down -v
docker compose up -d postgres

cd apps\backend
npx prisma migrate dev
npx prisma generate
node index.js
```

In a second PowerShell terminal:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing
```

### PowerShell curl verification commands

```powershell
# IMPORTANT: In PowerShell, use curl.exe (not curl alias)
curl.exe http://localhost:3000/health | jq
curl.exe http://localhost:3000/api/menu | jq
curl.exe "http://localhost:3000/api/menu?category=Snacks" | jq

# Create
curl.exe -X POST http://localhost:3000/api/menu -H "Content-Type: application/json" -d "{\"name\":\"Curl Test Item\",\"description\":\"created by curl\",\"price\":7.25,\"category\":\"Snacks\",\"isAvailable\":true}" | jq

# Update
curl.exe -X PUT http://localhost:3000/api/menu/1 -H "Content-Type: application/json" -d "{\"price\":8.10,\"category\":\"Snack\"}" | jq

# Delete
curl.exe -X DELETE http://localhost:3000/api/menu/1

# Pretty JSON alternative
Invoke-RestMethod http://localhost:3000/api/menu | ConvertTo-Json -Depth 6
```

Server runs at **http://localhost:3000**

### Docker

```bash
docker compose up backend
```

## 🏗 Project Structure

```
src/
├── controllers/      # Request handlers
├── models/           # Prisma client queries
├── routes/           # API endpoints
├── utils/            # Helper functions
└── config/           # Configuration
```

## 🧪 Testing

Run the API test suite:

```bash
npm test
npm run test:coverage
```

### Writing API Tests

Tests use **Jest** and **Supertest** for HTTP assertions:

```javascript
import request from 'supertest';
import app from '../index';

test('GET /api/menu', async () => {
  const response = await request(app).get('/api/menu');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});
```

## 📋 API Endpoints

**Menu:**
- `GET /api/menu` — Get all menu items
- `POST /api/menu` — Create a menu item
- `GET /api/menu/:id` — Get menu item by ID
- `PUT /api/menu/:id` — Update menu item
- `DELETE /api/menu/:id` — Delete menu item

**Health:**
- `GET /health` — Server health check

## 🔑 Environment Variables

Create `.env` in `apps/backend/`:

```env
DATABASE_URL=postgresql://postgres:tasteofalohadb@localhost:5432/taste_of_aloha
PORT=3000
```

## 📚 Documentation

- **[Database Setup Guide](./DATABASE_SETUP_GUIDE.md)** — Complete PostgreSQL and Prisma setup
- **[Backend API Guide](../../docs/guides/BACKEND_API_GUIDE.md)** — Detailed API documentation
- **[Testing Guide](../../docs/guides/TESTING_GUIDE.md)** — Testing patterns and best practices

## 🔗 Related

- [Frontend Guide](../web/README.md) — React client
- [Root README](../../README.md) — Full monorepo overview

## 🔌 Connectivity Verification

Use the canonical connectivity checks in [QUICK_REFERENCE.md](../../QUICK_REFERENCE.md#connectivity-verification-powershell).

