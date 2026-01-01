# Prisma v7 Setup Guide: PostgreSQL Configuration

This guide documents the learnings from setting up Prisma v7 with PostgreSQL in the Taste of Aloha backend.

---

## Table of Contents
1. [Key Changes in Prisma v7](#key-changes-in-prisma-v7)
2. [PostgreSQL Adapter Setup](#postgresql-adapter-setup)
3. [Common Issues & Solutions](#common-issues--solutions)
4. [File Structure](#file-structure)
5. [Database Operations](#database-operations)

---

## Key Changes in Prisma v7

### Breaking Change: Datasource URL Removal

**Prisma v7 no longer supports `url` in the schema datasource.**

❌ **This no longer works:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ❌ ERROR in Prisma v7
}
```

✅ **This is the new way:**
```prisma
datasource db {
  provider = "postgresql"
  // No url here - moved to PrismaClient constructor
}
```

**Why the change?**
- Prisma v7 requires explicit adapter configuration for better performance and flexibility
- Allows using different connection strategies (direct connection, adapters, Accelerate)
- More explicit control over database connection behavior

---

## PostgreSQL Adapter Setup

### What You Need

1. **@prisma/adapter-pg** - PostgreSQL adapter for Prisma
2. **pg** - PostgreSQL driver for Node.js
3. A centralized PrismaClient instance

### Installation

```bash
npm install @prisma/adapter-pg pg
```

### Creating the Centralized PrismaClient

Create `apps/backend/src/utils/prismaClient.js`:

```javascript
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: process.cwd() + '/.env' });

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter
const adapter = new PrismaPg(pool);

// Create PrismaClient with adapter
const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});

export default prisma;
```

### Why a Centralized Instance?

✅ **Single source of truth** - One database connection for the entire app
✅ **Connection pooling** - Efficient connection management
✅ **Consistent configuration** - Same settings everywhere
✅ **Easier to test** - Mock or replace in tests

---

## Common Issues & Solutions

### Issue 1: "PrismaClient needs to be constructed with non-empty, valid PrismaClientOptions"

**Error:**
```
PrismaClientInitializationError: Using engine type "client" requires either 
"adapter" or "accelerateUrl" to be provided to PrismaClient constructor.
```

**Cause:** 
- PrismaClient instantiated without adapter or accelerateUrl
- Datasource doesn't have a `url` property

**Solution:**
```javascript
// ❌ Wrong
const prisma = new PrismaClient();

// ✅ Correct
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
```

### Issue 2: "Prisma schema validation - The datasource property `url` is no longer supported"

**Error:**
```
Prisma schema validation - error: The datasource property `url` is no longer 
supported in schema files.
```

**Cause:** 
- Still using `url = env("DATABASE_URL")` in schema.prisma

**Solution:**
Remove the `url` line from your schema:

```prisma
// ❌ Remove this:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // DELETE THIS LINE
}

// ✅ Keep only this:
datasource db {
  provider = "postgresql"
}
```

Then regenerate the client:
```bash
npx prisma generate
```

### Issue 3: "app.use() requires a middleware function"

**Error:**
```
TypeError: app.use() requires a middleware function
```

**Cause:** 
- Logger utility exported as plain object, not middleware function

**Solution:**
Create a middleware function in your logger:

```javascript
// ✅ Correct approach
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

export default {
  middleware: loggerMiddleware,
  log: (message) => console.log(`[LOG] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  info: (message) => console.info(`[INFO] ${message}`)
};
```

Then use it in Express:
```javascript
app.use(logger.middleware);  // ✅ Pass the function
```

---

## File Structure

### Backend Project Layout

```
apps/backend/
├── src/
│   ├── controllers/
│   │   └── menuController.js      (Handles request logic)
│   ├── models/
│   │   ├── menuModel.js           (Database queries)
│   │   └── snackModel.js          (Legacy model)
│   ├── routes/
│   │   └── menuRoutes.js          (Route definitions)
│   └── utils/
│       ├── prismaClient.js        (✨ CENTRALIZED - see below)
│       └── logger.js              (Logging utility)
├── prisma/
│   └── schema.prisma              (Database schema)
├── index.js                        (Express app entry)
└── package.json
```

### Prisma Configuration Files

**prisma/schema.prisma** - Defines your database models:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // ✨ Note: NO url property in v7
}

model Menu {
  id          Int     @id @default(autoincrement())
  name        String
  description String
  price       Float
  // ... other fields
}
```

---

## Database Operations

### Using the Centralized PrismaClient

#### In Models

```javascript
// ✅ Good - Import once at top
import prisma from '../utils/prismaClient.js';

export const getAllMenuItems = async () => {
  return await prisma.menu.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createMenuItem = async (data) => {
  return await prisma.menu.create({
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
    },
  });
};
```

#### In Controllers

```javascript
import menuModel from '../models/menuModel.js';

export const getAllMenuItems = async (req, res) => {
  try {
    const items = await menuModel.getAllMenuItems();
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
    });
  }
};
```

### Common Prisma Queries

```javascript
// Find all records
const all = await prisma.menu.findMany();

// Find by ID
const item = await prisma.menu.findUnique({
  where: { id: 1 }
});

// Create new record
const newItem = await prisma.menu.create({
  data: {
    name: 'Pizza',
    price: 12.99,
  }
});

// Update record
const updated = await prisma.menu.update({
  where: { id: 1 },
  data: { price: 13.99 }
});

// Delete record
await prisma.menu.delete({
  where: { id: 1 }
});

// Find with filtering
const available = await prisma.menu.findMany({
  where: { isAvailable: true }
});
```

---

## Environment Variables

Your `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taste_of_aloha?schema=public"
PORT=5001
```

**Format:** `postgresql://user:password@host:port/database?schema=public`

---

## Running Prisma Commands

```bash
# Generate/regenerate the Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name add_feature

# View database in Prisma Studio
npx prisma studio

# Format your schema
npx prisma format
```

---

## Summary of Changes from v6 to v7

| Aspect | v6 | v7 |
|--------|----|----|
| **Datasource URL** | In schema file | In PrismaClient constructor |
| **Adapter** | Optional | Required (must choose adapter/accelerate) |
| **Configuration** | Simple | More explicit |
| **Connection** | Direct string | Pool-based for PostgreSQL |

---

## Resources

- [Prisma v7 Migration Guide](https://www.prisma.io/docs/orm/prisma-client/deployment/edge-deploy)
- [PostgreSQL Adapter Docs](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- [Prisma Configuration](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)

