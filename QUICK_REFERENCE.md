# ⚡ Quick Reference

## 🛠 Development
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts DB, Backend, and Frontend in parallel |
| `npm run dev:backend` | API only |
| `npm run dev:web` | Frontend only |

## 🗄 Database (Prisma)
- `npx prisma studio`: Open database UI.
- `npm run db:seed`: Reset and re-seed the menu items.

## ⚡ DB Populate in 60 Seconds
Run from repo root:

```powershell
# 1) Start Postgres
npm run dev:db

# 2) Apply migrations
npm --workspace apps/backend run db:migrate

# 3) Seed menu data
npm --workspace apps/backend run db:seed

# 4) Verify data exists
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/menu"
```

Files to update when seed content changes:
- `apps/backend/prisma/seed.js` (main seed dataset)
- `apps/backend/prisma/schema.prisma` (DB table/field shape)
- `apps/backend/prisma/menu.seed.json` (bulk menu data source)
- `apps/backend/prisma/menu.seed.js` (alternate bulk seed runner)
- `apps/backend/scripts/addMenuItem.js` (one-off quick inserts)

## 🧪 Verification (PowerShell)
```powershell
# Check Backend Health
(Invoke-WebRequest -Uri "http://localhost:3000/health").StatusCode

# Check Frontend URL
(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```

## 🩹 Troubleshooting (PowerShell)
If Vite says `Port 5173 is in use`, clear stale listeners and restart dev:

```powershell
$ports = 5173,5174,5175,5176
$pids = Get-NetTCPConnection -State Listen -LocalPort $ports -ErrorAction SilentlyContinue |
	Select-Object -ExpandProperty OwningProcess -Unique

if ($pids) {
	Stop-Process -Id $pids -Force
}

npm run dev
```