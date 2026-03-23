# Taste of Aloha — Master Documentation

Last updated: March 14, 2026

This file is the single consolidated overview for local setup, day-to-day commands, and current API/database behavior.

## 1) What is running today

- Frontend: React + Vite in `apps/web`
- Backend: Express + Prisma in `apps/backend`
- DB: PostgreSQL (local service or Docker)
- Main API base path: `/api/menu`

## 2) Quick start (recommended)

```bash
# From repo root
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/health`

Stop:

```bash
docker compose down
```

## 3) Local dev (split terminals)

```bash
# Terminal 1
cd apps/backend
npm run dev

# Terminal 2
cd apps/web
npm run dev
```

## 4) Database + Prisma

From `apps/backend`:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
npx prisma validate
npx prisma migrate status
```

Current Prisma table model for menu is `Menu` in `apps/backend/prisma/schema.prisma`.

## 5) Current API endpoints

- `GET /health`
- `GET /api/menu`
- `GET /api/menu/:id`
- `POST /api/menu`
- `PUT /api/menu/:id`
- `DELETE /api/menu/:id`

## 6) Known command rules used in docs

- Use `docker compose` (not legacy `docker-compose`).
- Run app scripts from each app directory (`apps/backend`, `apps/web`).
- Use Prisma commands from `apps/backend`.

## 7) Documentation index

- Root overview: `README.md`
- Quick commands: `QUICK_REFERENCE.md`
- Backend usage: `apps/backend/README.md`
- Frontend usage: `apps/web/README.md`
- Database setup: `apps/backend/DATABASE_SETUP_GUIDE.md`
- API guide: `docs/guides/BACKEND_API_GUIDE.md`
- Frontend/backend flow: `docs/guides/FRONTEND_BACKEND_FLOW_GUIDE.md`
- Troubleshooting: `docs/guides/TROUBLESHOOTING.md`
- Testing: `docs/guides/TESTING_GUIDE.md`
- Learning/reference: `docs/guides/LEARNING_GUIDE.md`
