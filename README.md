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
