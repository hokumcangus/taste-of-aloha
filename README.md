# 🌺 Taste of Aloha

A modern full-stack monorepo for an island-inspired shopping experience.

## 🚀 Quick Start

1. **Clone & Install**: `npm install`
2. **Launch Everything**: `npm run dev`
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

## 📖 Documentation Links

- [Quick Reference Commands](./QUICK_REFERENCE.md) - All the `npm` and `docker` commands you need.
- [Team Wiki (External)](https://github.com/hokumcangus/taste-of-aloha/wiki) - Architecture, learning guides, and screenshots.

## 📂 Project Structure

- `apps/web`: React frontend.
- `apps/backend`: Express + Prisma backend.
- `shared/`: Shared configs and types.

## ▲ Deploying on Vercel

Deploy each app from its own folder, not from the monorepo root.

### Frontend

```bash
cd apps/web
npm run build
vercel deploy --prod
```

### Backend

```bash
cd apps/backend
npm run vercel-build
vercel deploy --prod
```

`apps/web` and `apps/backend` each contain their own `vercel.json`, so those directories should be the Vercel project root for CLI deploys and in the Vercel dashboard.

## Simple Commands (What / Why / How)

### Local Docker DB mode

What: Run app with local PostgreSQL in Docker.
Why: Fastest and most predictable local development.
How:

```powershell
npm run dev:db
npm run dev:backend
npm run dev:web

(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode
(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```

### Neon mode

What: Run backend against Neon cloud PostgreSQL.
Why: Validate cloud DB behavior before deploy.
How:

```powershell
$env:PGUSER = "<your_user>"
$env:PGPASSWORD = "<your_password>"
$env:DATABASE_URL = "postgresql://<your_user>:<your_password>@<host>/<db>?sslmode=require&channel_binding=require"

npm run dev:backend
npm --workspace apps/backend run db:seed
(Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing).StatusCode
```
