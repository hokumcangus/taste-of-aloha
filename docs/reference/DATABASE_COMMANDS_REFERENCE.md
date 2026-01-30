# Database Commands Quick Reference

Quick lookup for the most important database commands you'll use regularly.

---

## PostgreSQL Commands (psql)

| Command | Purpose |
|---------|---------|
| `psql -U postgres` | Connect to PostgreSQL |
| `psql -U postgres -d taste_of_aloha` | Connect to specific database |
| `\l` | List all databases |
| `\c taste_of_aloha` | Switch to database |
| `\dt` | List all tables |
| `\d "Menu"` | Show Menu table structure |
| `SELECT * FROM "Menu";` | View all menu items |
| `\q` | Exit psql |

---

## Prisma Commands (from `apps/backend/`)

| Command | Purpose |
|---------|---------|
| `npx prisma migrate dev --name <name>` | Create & apply migration |
| `npx prisma migrate reset` | Reset database (⚠️ deletes all data) |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma studio` | Open visual database browser |
| `npx prisma validate` | Check schema for errors |

---

## Common Workflows

### Creating a New Table/Model

```bash
# 1. Add model to schema.prisma
# 2. Save file
# 3. Create migration
npx prisma migrate dev --name add_table_name 
// input table name

# 4. Verify in database
npx prisma studio
```

### Modifying an Existing Table

```bash
# 1. Update the model in schema.prisma
# 2. Create migration
npx prisma migrate dev --name describe_what_changed

# 3. Verify it worked
psql -U postgres -d taste_of_aloha
```

### Using Prisma Client in Code

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
await prisma.menu.create({
  data: { name: "Spam Musubi", price: 5.99 }
});

// READ
await prisma.menu.findMany();  // Get all
await prisma.menu.findUnique({ where: { id: 1 } });  // Get one

// UPDATE
await prisma.menu.update({
  where: { id: 1 },
  data: { price: 6.99 }
});

// DELETE
await prisma.menu.delete({ where: { id: 1 } });
```

---

## Environment Setup

**File: `apps/backend/.env`**
```env
# Use your own password — do not commit real secrets
DATABASE_URL={DATABASE_URL}
```

**Important:** Don't commit `.env` to git!

---

## Connection Verification

```powershell
# Test connection
psql -U postgres -d taste_of_aloha -c "SELECT 1;"

# If returns 1, everything is working!
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Authentication failed" | Check password in `.env` |
| "database does not exist" | Create it: `psql -U postgres -c "CREATE DATABASE taste_of_aloha;"` |
| "schema validation" | Run `npx prisma validate` to find errors |
| "migration failed" | Check `.env` DATABASE_URL has correct credentials |

---

## File Locations

```
apps/backend/
├── .env                           ← Connection string (don't commit!)
├── prisma/
│   ├── schema.prisma              ← Database schema definition
│   ├── migrations/                ← Auto-generated migration files
│   │   └── 20251214184223_init/
│   │       └── migration.sql      ← SQL that was run
│   └── migrations_lock.toml
└── prisma.config.ts               ← Prisma configuration
```

---

## When to Use Each Command

| Situation | Command |
|-----------|---------|
| First time setting up database | `npx prisma migrate dev --name init` |
| Adding a new table | `npx prisma migrate dev --name add_users_table` |
| Modifying a table | `npx prisma migrate dev --name update_menu_table` |
| Troubleshooting | `psql -U postgres -d taste_of_aloha` |
| Visual inspection | `npx prisma studio` |
| Start over (dev only!) | `npx prisma migrate reset` |
