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
npm run test
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

## PowerShell API Checks (Copy/Paste)

```powershell
# Use curl.exe in PowerShell to avoid alias issues
curl.exe http://localhost:3000/health
curl.exe http://localhost:3000/api/menu
curl.exe "http://localhost:3000/api/menu?category=Snacks"

curl.exe -X POST http://localhost:3000/api/menu -H "Content-Type: application/json" -d "{\"name\":\"Curl Test Item\",\"description\":\"created by curl\",\"price\":7.25,\"category\":\"Snacks\",\"isAvailable\":true}"
curl.exe -X PUT http://localhost:3000/api/menu/1 -H "Content-Type: application/json" -d "{\"price\":8.10,\"category\":\"Snack\"}"
curl.exe -X DELETE http://localhost:3000/api/menu/1

# Pretty JSON output
Invoke-RestMethod http://localhost:3000/api/menu | ConvertTo-Json -Depth 6
```

## Verification Checks (PowerShell)

Run these after startup to confirm frontend + backend + DB are aligned:

```powershell
# 1) Backend health
(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode

# 2) Menu endpoint status + count
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$items = $response.Content | ConvertFrom-Json
"status=$($response.StatusCode) count=$($items.Count)"

# 3) Preview first rows
$items | Select-Object -First 3 id,name,price,category | Format-Table -AutoSize

# 4) Frontend reachable
(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```

Expected:
- Health: `200`
- Menu API: `status=200` and `count > 0`
- Frontend: `200`

## Docker DB Sync (Avoid "Menu table does not exist")

If `/api/menu` returns 500 with Prisma `P2021` (`public.Menu` does not exist), run:

```bash
# From repo root
docker exec taste-of-aloha-backend npx prisma db push --accept-data-loss
docker exec taste-of-aloha-backend node prisma/menu.seed.js
```

Then re-check:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$items = $response.Content | ConvertFrom-Json
"status=$($response.StatusCode) count=$($items.Count)"
```

## Docs

- Project: `README.md`
- Backend: `apps/backend/README.md`
- Frontend: `apps/web/README.md`
- Database: `apps/backend/DATABASE_SETUP_GUIDE.md`
- API guide: `docs/guides/BACKEND_API_GUIDE.md`
- Troubleshooting: `docs/guides/TROUBLESHOOTING.md`
