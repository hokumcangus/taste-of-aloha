# Database Setup Guide: PostgreSQL & Prisma

This guide documents the complete database setup process for Taste of Aloha, including all important steps, commands, and troubleshooting.

---

## Table of Contents
1. [Installation Steps](#installation-steps)
2. [PostgreSQL Setup](#postgresql-setup)
3. [Prisma Setup](#prisma-setup)
4. [Database Creation](#database-creation)
5. [Schema Definition](#schema-definition)
6. [Running Migrations](#running-migrations)
7. [Important Commands](#important-commands)
8. [Troubleshooting](#troubleshooting)

---

## Installation Steps

### Step 1: Install PostgreSQL 18 (Windows)

**Download & Install:**
1. Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Download PostgreSQL 18
3. Run installer
4. When prompted, select these components:
   - ✅ PostgreSQL Server 18
   - ✅ pgAdmin 4
   - ✅ Command Line Tools
   - ❌ pgBouncer (skip - not needed)
   - ❌ Database Drivers (skip - we use pg npm package)
   - ❌ Stack Builder (skip - optional)
5. Set **postgres** password to something you remember (e.g., `tasteofalohadb`)
6. Keep port as `5432` (default)

**Verify Installation:**
```powershell
psql --version
# Output: psql (PostgreSQL) 18.x.x
```

### Step 2: Install Node.js Prisma Packages

**In your backend directory** (`apps/backend/`):

```powershell
cd apps/backend

# Install Prisma and database drivers
npm install prisma @types/node @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

**What these packages do:**
- `prisma` - CLI tool for managing database schema
- `@prisma/client` - JavaScript ORM client to query database
- `pg` - PostgreSQL driver (allows Node.js to connect to PostgreSQL)
- `dotenv` - Loads environment variables from `.env` file

### Step 3: Verify Prisma is Installed

```powershell
npx prisma --version
# Output: 7.1.0 (or your installed version)
```

---

## PostgreSQL Setup

### Creating the Database

**Option A: Using psql (Command Line)**

```powershell
# Connect to PostgreSQL
psql -U postgres

# You'll be prompted for the password you set during installation
# Enter your password (e.g., tasteofalohadb)

# Now you're in the psql interactive shell
# Create the database
CREATE DATABASE taste_of_aloha;

# Verify it was created
\l

# Exit psql
\q
```

**Option B: Using pgAdmin 4 (GUI)**

1. Open pgAdmin 4 (installed with PostgreSQL)
2. Connect to PostgreSQL Server
3. Right-click on "Databases" → Create → Database
4. Name: `taste_of_aloha`
5. Click Save

### Verifying Database Connection

```powershell
# Connect to your new database
psql -U postgres -d taste_of_aloha

# If successful, you'll see:
# taste_of_aloha=#

# Exit
\q
```

---

## Prisma Setup

### Initialize Prisma in Backend

**Files Created:**
- `apps/backend/.env` - Environment variables (database connection string)
- `apps/backend/prisma/schema.prisma` - Database schema definition
- `apps/backend/prisma.config.ts` - Prisma configuration

### Configure Environment Variables

**File: `apps/backend/.env`**

```env
DATABASE_URL="postgresql://postgres:tasteofalohadb@localhost:5432/taste_of_aloha?schema=public"
```

**Breakdown:**
- `postgresql://` - Database type
- `postgres` - PostgreSQL username
- `tasteofalohadb` - The password you set during PostgreSQL installation
- `localhost:5432` - PostgreSQL server address and port
- `taste_of_aloha` - Your database name
- `?schema=public` - PostgreSQL schema (always use "public" for simplicity)

**⚠️ Important:** Do NOT commit `.env` to git! It contains passwords.

Add to `.gitignore`:
```
.env
.env.local
```

### Configure Prisma Config

**File: `apps/backend/prisma.config.ts`**

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    adapter: "postgres",  // Important: tells Prisma to use PostgreSQL
    url: env("DATABASE_URL"),  // Reads from .env file
  },
});
```

---

## Database Creation

### Prisma Schema Definition

**File: `apps/backend/prisma/schema.prisma`**

```prisma
// Define your database provider
datasource db {
  provider = "postgresql"  // Using PostgreSQL
}

// Generate Prisma Client for querying
generator client {
  provider = "prisma-client-js"
}

// Define your database models (tables)
model Menu {
  id          Int     @id @default(autoincrement())
  name        String
  description String
  price       Float
  image       String?
  category    String
  isAvailable Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Future models (add these later)
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}

model Order {
  id        Int     @id @default(autoincrement())
  userId    Int
  total     Float
  status    String  @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Understanding Field Attributes:**
- `@id` - Primary key (unique identifier)
- `@default(autoincrement())` - Automatically increment ID
- `@default(now())` - Set current timestamp
- `@updatedAt` - Automatically update timestamp on changes
- `@unique` - No duplicates allowed
- `String?` - Optional field (? means nullable)

---

## Running Migrations

### Create and Apply Initial Migration

**From `apps/backend/` directory:**

```powershell
npx prisma migrate dev --name init
```

**What happens:**
1. Analyzes your schema against current database
2. Creates a migration file in `apps/backend/prisma/migrations/`
3. Applies the migration (creates tables in PostgreSQL)
4. Generates Prisma Client

**Expected Output:**
```
Loaded Prisma config from prisma.config.ts.
PostgreSQL database taste_of_aloha created at localhost:5432
Applying migration `20251214184223_init`
Your database is now in sync with your schema.
```

### Generate Prisma Client (if needed)

```powershell
npx prisma generate
```

This creates the JavaScript methods you'll use in your code.

---

## Important Commands

### Database Commands (psql)

```powershell
# Connect to PostgreSQL
psql -U postgres

# List all databases
\l

# Connect to specific database
\c taste_of_aloha

# List all tables
\dt

# Show table structure
\d "Menu"

# Run SQL queries
SELECT * FROM "Menu";

# Exit
\q
```

### Prisma Commands (from `apps/backend/`)

```powershell
# Create and apply a new migration
npx prisma migrate dev --name <migration_name>
# Example: npx prisma migrate dev --name add_orders_table

# Create migration without applying (review first)
npx prisma migrate dev --create-only --name <migration_name>

# Apply pending migrations
npx prisma migrate deploy

# Reset database (DELETE ALL DATA - use with caution!)
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate

# Open visual database explorer
npx prisma studio

# Show migration status
npx prisma migrate status

# Check schema validity
npx prisma validate
```

### Testing Database Connection

```powershell
# Quick test in PowerShell
psql -U postgres -d taste_of_aloha -c "SELECT 1;"

# If returns "1", connection is working!
```

---

## Troubleshooting

### Error: "Authentication failed against database server"

**Cause:** Wrong password or username in DATABASE_URL

**Solution:**
1. Check your password in `.env`
2. Verify with: `psql -U postgres` (tests if postgres user works)
3. Make sure database exists: `psql -U postgres -l`
4. Recreate `.env` with correct credentials

### Error: "The datasource property 'url' is no longer supported"

**Cause:** Using Prisma 7 which requires datasource in config file, not schema

**Solution:**
1. Remove `url` from `prisma/schema.prisma` datasource block
2. Keep only `provider = "postgresql"`
3. Add `adapter` and `url` to `prisma.config.ts`

### Error: "Schema must contain a datasource block"

**Cause:** Datasource removed from schema but needs to be there for Prisma 7

**Solution:**
Include in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

The `url` goes in `prisma.config.ts`, not here.

### Error: "database 'taste_of_aloha' does not exist"

**Cause:** You forgot to create the database

**Solution:**
```powershell
# Create it manually
psql -U postgres -c "CREATE DATABASE taste_of_aloha;"

# Then run migration
npx prisma migrate dev --name init
```

### PostgreSQL Server Won't Start

**For Windows:**
```powershell
# Check service status
Get-Service postgresql-x64-18

# Restart the service
Restart-Service postgresql-x64-18 -Force

# Start the service
Start-Service postgresql-x64-18
```

### Can't Connect from pgAdmin

1. Open pgAdmin 4
2. Right-click "Servers" → Register → Server
3. **Name:** PostgreSQL 18
4. **Hostname/address:** localhost
5. **Port:** 5432
6. **Username:** postgres
7. **Password:** (your password)
8. Click Save

---

## Architecture Overview

```
Your Backend Code (Node.js/Express)
         ↓
    Prisma Client
         ↓
    Prisma Adapter
         ↓
      PostgreSQL Driver (pg package)
         ↓
PostgreSQL Database (taste_of_aloha)
         ↓
    Disk Storage
```

**Data Flow Example:**
```javascript
// 1. Your code
const menu = await prisma.menu.create({
  data: { name: "Spam Musubi", price: 5.99 }
});

// 2. Prisma translates to SQL
INSERT INTO "Menu" (name, price) VALUES ('Spam Musubi', 5.99);

// 3. pg sends to PostgreSQL
// 4. PostgreSQL stores in database
// 5. Response comes back through the chain

console.log(menu); // { id: 1, name: "Spam Musubi", price: 5.99, ... }
```

---

## Next Steps

1. ✅ PostgreSQL installed and running
2. ✅ Prisma configured and connected
3. ✅ Menu table created via migration
4. 🔄 **Next**: Create backend API endpoints to interact with database
5. 🔄 **Then**: Add User and Order models
6. 🔄 **Then**: Connect frontend to API endpoints

**See:** [ORDER_SYSTEM_GUIDE.md](ORDER_SYSTEM_GUIDE.md) for building the order system API.
