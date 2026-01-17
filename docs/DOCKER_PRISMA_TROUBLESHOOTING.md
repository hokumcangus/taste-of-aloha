# Docker + Prisma 7 Troubleshooting & Quick Reference

## Roadblocks & Fixes

### 🔴 Roadblock #1: Wrong Prisma Adapter (SQLite instead of PostgreSQL)
**Problem:** Backend kept crashing with PrismaClient initialization errors because package.json had `@prisma/adapter-better-sqlite3` (for SQLite) instead of PostgreSQL adapter.

**Error Message:**
```
PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`
```

**Root Cause:** Default template was set up for SQLite, but we're using PostgreSQL in Docker.

**Fix:**
```bash
# Updated package.json dependencies:
- "@prisma/adapter-better-sqlite3": "^7.1.0"  ❌ WRONG
+ "@prisma/adapter-pg": "^7.1.0"              ✅ CORRECT
+ "pg": "^8.11.3"                             ✅ ADDED
```

**Impact:** All PrismaClient instantiations needed updating.

---

### 🔴 Roadblock #2: Prisma 7 Removed URL from Schema
**Problem:** Prisma 7 no longer supports `url = env("DATABASE_URL")` in the schema datasource.

**Error Message:**
```
Error: The datasource property `url` is no longer supported in schema files.
Move connection URLs to `prisma.config.ts` and pass either `adapter` for 
a direct database connection or `accelerateUrl` for Accelerate to the `PrismaClient` constructor.
```

**Root Cause:** Prisma v7 changed how datasources are configured to be more flexible.

**Fix:**
1. Removed `url` from [prisma/schema.prisma](prisma/schema.prisma):
```prisma
datasource db {
  provider = "postgresql"
  // url = env("DATABASE_URL")  ❌ REMOVED
}
```

2. Created [apps/backend/prisma.config.ts](apps/backend/prisma.config.ts):
```typescript
import "dotenv/config";

export default {
  schema: "prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL },
};
```

---

### 🔴 Roadblock #3: PrismaClient Constructor Pattern Changed
**Problem:** Old syntax `new PrismaClient({ datasources: { db: { url: ... } } })` doesn't work in Prisma 7.

**Root Cause:** Prisma 7 requires using database adapters instead of the old datasources config.

**Fix:** Updated all PrismaClient instantiations to use PrismaPg adapter:

**Before (Prisma 6):**
```javascript
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});
```

**After (Prisma 7):**
```javascript
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
```

**Files Updated:**
- [apps/backend/src/models/snackModel.js](apps/backend/src/models/snackModel.js)
- [apps/backend/src/models/menuModel.js](apps/backend/src/models/menuModel.js)
- [apps/backend/scripts/addMenuItem.js](apps/backend/scripts/addMenuItem.js)
 - [apps/backend/prisma.config.ts](apps/backend/prisma.config.ts)

---

### 🔴 Roadblock #4: CommonJS vs ES6 Imports
**Problem:** Backend is CommonJS but seed script used ES6 imports.

**Error:**
```
Cannot use import statement outside a module
```

**Fix:** Converted to CommonJS:
```javascript
// ❌ Before
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// ✅ After
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
```

---

## ✅ What We Did (Summary)

| Issue | Fix | File(s) |
|-------|-----|---------|
| Wrong adapter | Changed to `@prisma/adapter-pg` | `apps/backend/package.json` |
| Missing pg driver | Added `"pg": "^8.11.3"` | `apps/backend/package.json` |
| Prisma 7 schema | Removed `url` from datasource | `apps/backend/prisma/schema.prisma` |
| Config format | Created minimal `prisma.config.ts` | `apps/backend/prisma.config.ts` |
| PrismaClient pattern | Added PrismaPg adapter usage | 3 model/script files |
| ES6 in CommonJS | Converted to require() | `addMenuItem.js` |

---

## 🧪 Testing & Verification

### Step 1: Check Docker Containers Are Running
```powershell
docker ps
```

Expected output: 3 containers running
- `taste-of-aloha-db` (postgres:16-alpine) - port 5432
- `taste-of-aloha-backend` (node) - port 3000
- `taste-of-aloha-frontend` (node) - port 5173

### Step 2: Check Backend Logs
```powershell
docker logs taste-of-aloha-backend -n 20
```

Expected output should show:
```
[dotenv] injecting env (0) from .env
Server running at http://localhost:3000
```

❌ If you see PrismaClient errors, the adapter isn't configured correctly.

### Step 3: Test API Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/snacks" -Method GET -UseBasicParsing
```

Expected output: JSON array (empty `[]` or with menu items)

If you get "table does not exist", run migrations inside the backend container:
```powershell
docker exec -i taste-of-aloha-backend npx prisma migrate dev --name init
```

### Step 4: Seed Test Data
```powershell
docker exec taste-of-aloha-backend npm run seed:menu
```

Expected output:
```
Menu item created: {
  id: 1,
  name: 'Spam Musubi',
  description: 'Sample menu item created via script',
  price: 5.99,
  ...
}
```

### Step 5: Verify Data in API
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/snacks" -Method GET -UseBasicParsing | 
  Select-Object -ExpandProperty Content
```

Expected output: Array with the menu item you just seeded.

---

## 📋 Common Commands

### Start Everything
```powershell
cd C:\Users\mcang\projects\taste-of-aloha
docker-compose up -d
```

### Stop Everything
```powershell
docker-compose down
```

### Rebuild & Start (after code changes)
```powershell
docker-compose down
docker-compose up -d --build
```

### View Backend Logs
```powershell
docker logs taste-of-aloha-backend -f  # Follow logs in real-time
docker logs taste-of-aloha-backend -n 50  # Last 50 lines
```

### Restart Backend Only
```powershell
docker restart taste-of-aloha-backend
```

### Execute Command in Backend Container
```powershell
docker exec taste-of-aloha-backend <command>

# Examples:
docker exec taste-of-aloha-backend npm run seed:menu
docker exec taste-of-aloha-backend npx prisma generate
docker exec taste-of-aloha-backend npx prisma migrate dev --name init
```

### Add a Menu Item (Local - if running outside Docker)
```powershell
npm run seed:menu
npm run seed:menu "Garlic Shrimp" 14.50
```

### Check Database Connection
```powershell
docker exec taste-of-aloha-db psql -U postgres -d taste_of_aloha -c "SELECT COUNT(*) FROM menu;"
```

### View All Environment Variables
```powershell
docker exec taste-of-aloha-backend env | grep DATABASE
```

---

## 🔍 Debugging Tips

### Backend Won't Start?
```powershell
# Check logs
docker logs taste-of-aloha-backend

# Common causes:
# 1. DATABASE_URL not set → Check .env file
# 2. Adapter mismatch → Check package.json
# 3. Node modules outdated → Rebuild: docker-compose up --build
# 4. Port 3000 already in use → docker port taste-of-aloha-backend
```

### API Returning Empty Array?
```powershell
# Seed the database
docker exec taste-of-aloha-backend npm run seed:menu

# Then test API again
Invoke-WebRequest -Uri "http://localhost:3000/api/snacks" -UseBasicParsing
```

### Database Connection Failed?
```powershell
# Check if DB is healthy
docker ps | grep taste-of-aloha-db

# Should show status: "Up X seconds (healthy)"

# Connect to database directly
docker exec -it taste-of-aloha-db psql -U postgres -d taste_of_aloha
```

### Prisma Client Generation Failed?
```powershell
# Regenerate client
docker exec taste-of-aloha-backend npx prisma generate

# Check schema is valid
docker exec taste-of-aloha-backend npx prisma validate
```

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| [apps/backend/package.json](../../apps/backend/package.json) | Dependencies (Prisma adapter, pg driver) |
| [apps/backend/.env](../../apps/backend/.env) | Database URL: `postgresql://postgres:postgres@postgres:5432/taste_of_aloha` |
| [apps/backend/prisma.config.ts](../../apps/backend/prisma.config.ts) | Prisma 7 config (loads dotenv) |
| [apps/backend/prisma/schema.prisma](../../apps/backend/prisma/schema.prisma) | Database schema definition |
| [apps/backend/src/models/snackModel.js](../../apps/backend/src/models/snackModel.js) | Menu data access layer |
| [apps/backend/scripts/addMenuItem.js](../../apps/backend/scripts/addMenuItem.js) | Seed script |
| [docker-compose.yml](../../docker-compose.yml) | Docker services definition |

---

## 🎯 Quick Status Check
Run this to verify everything is working:

```powershell
# 1. Check containers
Write-Host "=== CONTAINERS ===" -ForegroundColor Green
docker ps --filter "name=taste-of-aloha"

# 2. Check backend
Write-Host "`n=== BACKEND ===" -ForegroundColor Green
Invoke-WebRequest -Uri "http://localhost:3000/api/snacks" -UseBasicParsing | 
  Select-Object StatusCode, Content

# 3. Check database
Write-Host "`n=== DATABASE ===" -ForegroundColor Green
docker exec taste-of-aloha-db psql -U postgres -d taste_of_aloha -c "SELECT COUNT(*) as menu_items FROM menu;"
```

---

## 📖 References

- **Prisma 7 Migration Guide**: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases/postgresql
- **Prisma Adapter Documentation**: https://www.prisma.io/docs/orm/reference/prisma-client-reference#adapter
- **PostgreSQL Adapter**: https://github.com/prisma/prisma/tree/main/packages/adapter-pg
- **Docker Compose Docs**: https://docs.docker.com/compose/

