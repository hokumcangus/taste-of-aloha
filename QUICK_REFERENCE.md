# Quick Reference

Last updated: March 24, 2026

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
# From repo root — starts Docker, postgres, backend, and frontend in one command
npm run dev
```

```bash
# Individual scripts (from repo root)
npm run dev:backend    # API only
npm run dev:web        # Frontend only
npm run dev:db         # Postgres container only
```

```bash
# Manual (from app directories)
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
curl.exe http://localhost:3000/health | jq
curl.exe http://localhost:3000/api/menu | jq
curl.exe "http://localhost:3000/api/menu?category=Snacks" | jq

curl.exe -X POST http://localhost:3000/api/menu -H "Content-Type: application/json" -d "{\"name\":\"Curl Test Item\",\"description\":\"created by curl\",\"price\":7.25,\"category\":\"Snacks\",\"isAvailable\":true}" | jq
curl.exe -X PUT http://localhost:3000/api/menu/1 -H "Content-Type: application/json" -d "{\"price\":8.10,\"category\":\"Snack\"}" | jq
curl.exe -X DELETE http://localhost:3000/api/menu/1

# Pretty JSON output
Invoke-RestMethod http://localhost:3000/api/menu | ConvertTo-Json -Depth 6 | jq
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

## Connectivity Verification (PowerShell)

```powershell
# From repo root
npm run dev

# In a separate terminal
(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode

$menuResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$menuItems = $menuResponse.Content | ConvertFrom-Json
"menu-status=$($menuResponse.StatusCode) menu-count=$($menuItems.Count)"

$cartResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/cart" -UseBasicParsing
$cartItems = $cartResponse.Content | ConvertFrom-Json
"cart-status=$($cartResponse.StatusCode) cart-count=$($cartItems.Count)"

(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```
