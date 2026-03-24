# Backend API Guide

Last updated: March 24, 2026

## API Base

Backend default URL: `http://localhost:3000`  
Primary resource path: `/api/menu`

## Current Routes

- `GET /health` — service health
- `GET /api/menu` — list menu items
- `GET /api/menu/:id` — get one menu item
- `POST /api/menu` — create menu item
- `PUT /api/menu/:id` — update menu item
- `DELETE /api/menu/:id` — delete menu item

## Source Files

- Server entry: `apps/backend/index.js`
- Route definitions: `apps/backend/src/routes/menuRoutes.js`
- Controller logic: `apps/backend/src/controllers/menuController.js`
- Data access: `apps/backend/src/models/menuModel.js`
- Schema: `apps/backend/prisma/schema.prisma`

## Sample Requests

```bash
# List menu
curl http://localhost:3000/api/menu | jq

# Get by ID
curl http://localhost:3000/api/menu/1 | jq

# Create
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"Spam Musubi","description":"Hawaiian classic","price":4.99,"category":"Snacks"}' | jq

# Update
curl -X PUT http://localhost:3000/api/menu/1 \
  -H "Content-Type: application/json" \
  -d '{"price":5.49}' | jq

# Delete
curl -X DELETE http://localhost:3000/api/menu/1
```

## Windows PowerShell Requests

Use `curl.exe` in PowerShell to avoid alias issues with `curl`:

```powershell
# Health + reads
curl.exe http://localhost:3000/health | jq
curl.exe http://localhost:3000/api/menu | jq
curl.exe "http://localhost:3000/api/menu?category=Snacks" | jq

# Create
curl.exe -X POST http://localhost:3000/api/menu -H "Content-Type: application/json" -d "{\"name\":\"Curl Test Item\",\"description\":\"created by curl\",\"price\":7.25,\"category\":\"Snacks\",\"isAvailable\":true}" | jq

# Update
curl.exe -X PUT http://localhost:3000/api/menu/1 -H "Content-Type: application/json" -d "{\"price\":8.10,\"category\":\"Snack\"}" | jq

# Delete
curl.exe -X DELETE http://localhost:3000/api/menu/1

# Pretty JSON output
Invoke-RestMethod http://localhost:3000/api/menu | ConvertTo-Json -Depth 6
```

## Verification Commands (PowerShell)

Use these to confirm API behavior after startup:

```powershell
# Health
(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode

# Menu API status + record count
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$items = $response.Content | ConvertFrom-Json
"status=$($response.StatusCode) count=$($items.Count)"

# Preview sample rows
$items | Select-Object -First 3 id,name,price,category | Format-Table -AutoSize
```

Expected:
- Health: `200`
- Menu API: `status=200` and `count > 0`

## Known Docker Error + Fix

If `GET /api/menu` returns 500 and logs show Prisma `P2021` (`public.Menu` does not exist), database schema is out of sync.

Fix in Docker:

```bash
# From repo root
docker exec taste-of-aloha-backend npx prisma db push --accept-data-loss
docker exec taste-of-aloha-backend node prisma/menu.seed.js
```

Re-check with:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$items = $response.Content | ConvertFrom-Json
"status=$($response.StatusCode) count=$($items.Count)"
```

## Local Run

```bash
cd apps/backend
npm run dev
```

## Tests

```bash
cd apps/backend
npm test
npm run test:coverage
```

- Category values normalize `Snack`/`Snacks` handling in controller/model.
- DB table backing menu is Prisma model `Menu`.

## Connectivity Verification Commands

Use the canonical connectivity checks in [QUICK_REFERENCE.md](../../QUICK_REFERENCE.md#connectivity-verification-powershell).

