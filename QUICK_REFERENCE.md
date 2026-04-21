# ⚡ Quick Reference

## 🛠 Development

| Command               | Description                                  |
| :-------------------- | :------------------------------------------- |
| `npm run dev`         | Starts DB, Backend, and Frontend in parallel |
| `npm run dev:backend` | API only                                     |
| `npm run dev:web`     | Frontend only                                |

## 🗄 Database (Prisma)

- `npx prisma studio`: Open database UI.
- `npm run db:seed`: Reset and re-seed the menu items.

## 🧭 Simple What / Why / How

### Local Docker DB mode

What: Run backend and frontend with local PostgreSQL in Docker.
Why: Best for repeatable local dev and debugging.
How:

```powershell
npm run dev:db
npm run dev:backend
npm run dev:web

(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode
(Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing).StatusCode
```

### Neon mode

What: Point backend to Neon PostgreSQL.
Why: Validate production-like DB behavior.
How:

```powershell
$env:PGUSER = "<your_user>"
$env:PGPASSWORD = "<your_password>"
$env:DATABASE_URL = "postgresql://<your_user>:<your_password>@<host>/<db>?sslmode=require&channel_binding=require"

npm run dev:backend
npm --workspace apps/backend run db:seed
(Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing).StatusCode
```

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

## ▲ Vercel Deploy Checklist

Create two separate Vercel projects and set each project root to its app directory, not the monorepo root.

### Frontend Project

- Root directory: `apps/web`
- Local build command:

```bash
cd apps/web
npm run build
```

- Production deploy command:

```bash
cd apps/web
vercel deploy --prod
```

- Required env vars:

```env
VITE_API_URL=https://<your-backend-domain>
```

### Backend Project

- Root directory: `apps/backend`
- Local build command:

```bash
cd apps/backend
npm run vercel-build
```

- Production deploy command:

```bash
cd apps/backend
vercel deploy --prod
```

- Required runtime env vars:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-runtime-secret
PORT=3000
```

- Optional build-time fallback vars:

```env
PRISMA_FALLBACK_DB_USER=postgres
PRISMA_FALLBACK_DB_PASSWORD=postgres
PRISMA_FALLBACK_DB_HOST=localhost
PRISMA_FALLBACK_DB_PORT=5432
PRISMA_FALLBACK_DB_NAME=taste_of_aloha
```

Use the fallback vars only if you intentionally want `prisma generate` to succeed when `DATABASE_URL` is absent during build.

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

## 🌿 Branch Status + Merge Checklist

Run from repo root:

```powershell
# 1) See current branch and uncommitted changes
git status --short --branch

# 2) Update remote refs
git fetch origin --prune

# 3) List local branches with tracking info
git branch -vv

# 4) List remote branches
git branch -r

# 5) Compare branch divergence vs main
# output format: <commits only on main> <commits only on your branch>
git rev-list --left-right --count main...fix/vercel-deploy-only
```

Optional checks before merge:

```powershell
# Ensure lockfile exists for CI (required for npm ci)
Test-Path .\package-lock.json

# Run tests locally (workspace commands)
npm --workspace apps/backend run test
npm --workspace apps/web run test
```

Merge readiness checklist:

- Working tree is clean (`git status` shows no pending edits for tracked files you do not want in the PR).
- Branch is ahead of `main` and not missing required commits from `main` for your release policy.
- GitHub PR checks are green (Test Suite + Vercel checks).
- No requested changes from reviewers.

If lockfile is missing, regenerate and commit it:

```powershell
npm install
git add package-lock.json
git commit -m "chore(ci): restore lockfile for npm ci"
git push
```
