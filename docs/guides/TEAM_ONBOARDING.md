# Team Onboarding

A scan-friendly guide for running, migrating, seeding, testing, and explaining the project to the team.

---

## What, Why, How

- What: React frontend, Express backend, PostgreSQL database. Managed with Docker; Prisma 7 for schema/data.
- Why: Reliable dev/prod parity, clear separation of concerns, and fast iteration with hot reload.
- How:
  - Run services: `docker compose up --build`
  - Apply migrations: `docker exec -i taste-of-aloha-backend npx prisma migrate dev --name init`
  - Verify: Frontend at http://localhost:5173, API `/api/snacks`, DB tables via `psql`.

---

## Quick Start (5 minutes)

```powershell
# From project root
docker compose up --build

# Apply Prisma migrations (inside backend container)
docker exec -i taste-of-aloha-backend npx prisma migrate dev --name init

# Verify API returns JSON (may be empty initially)
Invoke-WebRequest -Uri http://localhost:3000/api/snacks -UseBasicParsing | Select-Object -ExpandProperty Content
```

Seed a sample item:
```powershell
docker exec -i taste-of-aloha-backend node scripts/addMenuItem.js "Garlic Shrimp" 14.50
```

Fresh start (reset DB):
```powershell
docker compose down -v
docker compose up --build
docker exec -i taste-of-aloha-backend npx prisma migrate dev --name init
```

---

## Local Dev (no Docker for Node/Vite)

```powershell
# DB via Docker
docker compose up -d postgres

# Backend
cd apps/backend
npm install
npx prisma validate
npx prisma migrate dev --name init
npm run dev  # http://localhost:3000

# Frontend
cd ../../apps/web
npm install
npm run dev  # http://localhost:5173
```

---

## Verify & Test

- Frontend: open http://localhost:5173
- API: `Invoke-WebRequest -Uri http://localhost:3000/api/snacks -UseBasicParsing | Select-Object -ExpandProperty Content`
- DB tables: `docker exec -i taste-of-aloha-db psql -U postgres -d taste_of_aloha -c "\\dt"`

Run tests:
```powershell
cd apps/backend
npm test

cd ../web
npm test
```

---

## Architecture One-Slide

- Services: Frontend (5173), Backend (3000), Postgres (5432).
- Flow: Browser → Frontend → Backend `/api` → Prisma PG adapter → Postgres.
- Key tables: `Menu`, `Cart`, `CartItem`, `User`, `Post`.
- Config: `VITE_API_URL`, `CORS_ORIGIN`, `DATABASE_URL`.
- Migrations: Prisma 7 with `prisma.config.ts`.
- Production: Nginx proxies `/api` to backend.

See the one-pager: [architecture/ONE_PAGER.md](../architecture/ONE_PAGER.md) and diagrams: [system-architecture.dio](../architecture/system-architecture.dio), [services-diagram.dio](../architecture/services-diagram.dio). For viewing .dio files, see [HOW_TO_VIEW_DIAGRAMS.md](../HOW_TO_VIEW_DIAGRAMS.md).

---

## Team Workflow

- Branches: `feat/...`, `fix/...` from `main`.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`).
- PRs: small, focused; include verification steps.

---

## Common Issues

- Missing tables: run migrations inside backend container.
- CORS errors: set `CORS_ORIGIN=http://localhost:5173` and `VITE_API_URL=http://localhost:3000`.
- Port conflicts: stop other processes using 3000/5173/5432 or adjust `.env`.

---

## Links

- Start Here: [guides/START_HERE.md](START_HERE.md)
- Quick Start: [guides/QUICK_START.md](QUICK_START.md)
- Backend API: [guides/BACKEND_API_GUIDE.md](BACKEND_API_GUIDE.md)
- Troubleshooting: [DOCKER_PRISMA_TROUBLESHOOTING.md](../DOCKER_PRISMA_TROUBLESHOOTING.md)

Last updated: January 16, 2026