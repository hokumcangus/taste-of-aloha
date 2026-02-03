# ⚙️ Taste of Aloha — Backend

The Express server and Prisma ORM layer for Taste of Aloha.

## 🧪 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **ORM**: Prisma 7 with PostgreSQL adapter
- **Database**: PostgreSQL 18
- **Testing**: Jest + Supertest

## 🗄 Database (Prisma 7)

We use Prisma to interface with PostgreSQL. The schema defines all data models (Menu, User, Order, etc.).

**Key Files:**
- `prisma/schema.prisma` — Data models and database configuration
- `prisma/migrations/` — Version-controlled database changes
- `.env` — Database connection string (DATABASE_URL)

**Important:** Prisma 7 uses an external config file (`prisma.config.ts`) to read environment variables.

## 🛠 Database Commands

### Apply Schema Changes

```bash
npx prisma migrate dev --name <description>
```

Example:
```bash
npx prisma migrate dev --name add_orders_table
```

This creates a migration file and applies it to the database.

### Generate/Update Prisma Client

```bash
npx prisma generate
```

### View Data in Prisma Studio

```bash
npx prisma studio
```

Opens an interactive GUI at http://localhost:5555 to view and edit database records.

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

## 🚀 Getting Started

### Local Development

```bash
cd apps/backend
npm install

# Ensure .env has the correct DATABASE_URL
npm run dev
```

Server runs at **http://localhost:3000**

### Docker

```bash
docker-compose up backend
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
npm run test:api
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
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/taste_of_aloha?schema=public
PORT=3000
```

## 📚 Documentation

- **[Database Setup Guide](./DATABASE_SETUP_GUIDE.md)** — Complete PostgreSQL and Prisma setup
- **[Backend API Guide](../../docs/guides/BACKEND_API_GUIDE.md)** — Detailed API documentation
- **[Testing Guide](../../docs/guides/TESTING_GUIDE.md)** — Testing patterns and best practices

## 🔗 Related

- [Frontend Guide](../web/README.md) — React client
- [Root README](../../README.md) — Full monorepo overview
