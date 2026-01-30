# Taste of Aloha — Start Here

This guide is the quickest, easiest path to run, verify, and iterate on Taste of Aloha. It covers Windows first, with Linux/macOS equivalents where helpful.

---

## What You Get

- Frontend (React + Vite): http://localhost:5173
- Backend (Node + Express): http://localhost:3000
- Database (PostgreSQL): localhost:5432 (container `taste-of-aloha-db`)

Services and ports come from the project’s Docker Compose config.

---

## One‑Command Run (Recommended)

From the project root:

```powershell
# Windows PowerShell
docker compose up --build
```

```bash
# macOS/Linux
docker compose up --build
```

When ready:

```powershell
docker compose down
```

Fresh start (wipe DB volume):

```powershell
docker compose down -v
docker compose up --build
```

---

## Verify It’s Working

### PowerShell (Windows)

```powershell
# Frontend should be reachable
Start-Process http://localhost:5173

# Backend health or root
Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing | Select-Object -ExpandProperty Content

# List snacks (may be empty initially)
Invoke-WebRequest -Uri http://localhost:3000/api/snacks -UseBasicParsing | Select-Object -ExpandProperty Content
```

### macOS/Linux (curl)

```bash
curl http://localhost:3000
curl http://localhost:3000/api/snacks
```

---

## Seed Data (Prisma)

Use Prisma to validate/migrate and add sample menu items. Run from `apps/backend`.

```powershell
cd apps/backend
npx prisma validate
npx prisma migrate dev --name init

# Add a sample item (script supports args)
node scripts/addMenuItem.js "Garlic Shrimp" 14.50

# Remove the sample item (host)
node scripts/removeMenuItem.js "Garlic Shrimp"

# Remove the sample item (container)
docker exec -i taste-of-aloha-backend node scripts/removeMenuItem.js "Garlic Shrimp"
```

Quick checks:

```powershell
# API
Invoke-WebRequest -Uri http://localhost:3000/api/snacks -UseBasicParsing | Select-Object -ExpandProperty Content

# psql (inside container)
docker exec -it taste-of-aloha-db psql -U postgres -d taste_of_aloha -c 'SELECT * FROM "Menu";'
```

More detail: [Run Services and Seed](RUN_SERVICES_AND_SEED.md)

---

## Local (No Docker) Dev

Faster iteration by running Node/Vite locally while keeping DB in Docker.

```powershell
# 1) Start DB
docker compose up -d postgres

# 2) Backend
cd apps/backend
npm install
# Ensure .env DATABASE_URL points to localhost
# postgresql://postgres:postgres@localhost:5432/taste_of_aloha
npm run dev  # http://localhost:3000

# 3) Frontend
cd ../../apps/web
npm install
npm run dev  # http://localhost:5173
```

---

## Common Fixes

- Database connection fails:
  - Ensure Docker Desktop is running and `postgres` service is healthy.
  - In Docker mode: `DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@postgres:5432/taste_of_aloha`
  - In local mode: `DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/taste_of_aloha`

- Frontend cannot reach backend (CORS):
  - Backend `CORS_ORIGIN` should be `http://localhost:5173`.
  - Frontend `VITE_API_URL` should be `http://localhost:3000`.

- Port conflict (3000/5173/5432):
  - Stop other processes using those ports or change `.env`/compose mapping.

- Reset DB quickly:
  - `docker compose down -v` then `docker compose up -d postgres`.

---

## Next Steps

- Quick Start (deeper): [guides/QUICK_START.md](QUICK_START.md)
- Backend API: [guides/BACKEND_API_GUIDE.md](BACKEND_API_GUIDE.md)
- Database Setup/API: [guides/DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md), [guides/DATABASE_API_GUIDE.md](DATABASE_API_GUIDE.md)
- Architecture: [architecture/README.md](../architecture/README.md)
- Troubleshooting: [DOCKER_PRISMA_TROUBLESHOOTING.md](../DOCKER_PRISMA_TROUBLESHOOTING.md)

---

Last updated: January 16, 2026