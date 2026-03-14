# Quick Reference

Last updated: March 14, 2026

## Start / Stop

```bash
# From repo root
docker compose up --build
docker compose down
```

## Database Reset (destructive)

```bash
# From repo root
docker compose down -v
docker compose up -d postgres

# From apps/backend
npx prisma migrate dev
npx prisma generate
```

## Run Apps Locally (without Docker app containers)

```bash
# Terminal 1
cd apps/backend
npm run dev

# Terminal 2
cd apps/web
npm run dev
```

## Useful Backend Commands

```bash
cd apps/backend
npx prisma studio
npx prisma migrate dev --name <change_name>
npx prisma migrate status
npx prisma validate
npm run test:snack
```

## Useful Frontend Commands

```bash
cd apps/web
npm run dev
npm run build
npm run test
npm run test:coverage
```

## API Endpoints (Current)

- `GET /health`
- `GET /api/menu`
- `GET /api/menu/:id`
- `POST /api/menu`
- `PUT /api/menu/:id`
- `DELETE /api/menu/:id`

## Docs

- Project: `README.md`
- Backend: `apps/backend/README.md`
- Frontend: `apps/web/README.md`
- Database: `apps/backend/DATABASE_SETUP_GUIDE.md`
- API guide: `docs/guides/BACKEND_API_GUIDE.md`
- Troubleshooting: `docs/guides/TROUBLESHOOTING.md`
