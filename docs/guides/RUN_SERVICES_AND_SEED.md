# Run Backend, Frontend, and Seed Data

These steps start the dev stack (Docker), run migrations, and add a sample menu item using Prisma.

## Prereqs
- Docker Desktop running
- Node.js installed (for Prisma CLI on host)
- From repo root unless noted

## 1) Start services (backend, frontend, postgres)
```sh
docker compose up -d --build
```
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- DB: postgres container `postgres:5432`

## 2) Ensure Prisma sees the schema
Run Prisma commands from `apps/backend/` (or pass `--schema prisma/schema.prisma`). Example:
```sh
cd apps/backend
npx prisma validate
```

## 3) Run migrations
```sh
cd apps/backend
npx prisma migrate dev --name init
```
This uses `DATABASE_URL` from `apps/backend/.env` (currently `postgresql://postgres:postgres@postgres:5432/taste_of_aloha?schema=public`).

## 4) Add a sample menu item
From `apps/backend/`:
```sh
npm run seed:menu
# or pass name/price
node scripts/addMenuItem.js "Garlic Shrimp" 14.50
```
This creates a row in `Menu` via Prisma.

## 5) Verify data
- API (snacks endpoint backed by Menu table):
	- `curl http://localhost:3000/api/snacks`
	- `curl http://localhost:3000/api/snacks/1`
- Frontend (Menu page pulls from /api/snacks): http://localhost:5173/menu
- psql: `psql -h localhost -U postgres -d taste_of_aloha -c 'SELECT * FROM "Menu";'`
- Prisma Studio (optional):
```sh
cd apps/backend
npx prisma studio --schema prisma/schema.prisma
```

## 6) Common fixes
- **Schema not found**: run from `apps/backend/` or add `--schema prisma/schema.prisma`.
- **Auth failed**: confirm `DATABASE_URL` in `apps/backend/.env` matches docker-compose credentials (user `postgres`, pass `postgres`, host `postgres`, db `taste_of_aloha`).
- **Migrations stale**: rerun `npx prisma migrate dev` after edits to `prisma/schema.prisma`.

## 7) Stop services
```sh
docker compose down
```
