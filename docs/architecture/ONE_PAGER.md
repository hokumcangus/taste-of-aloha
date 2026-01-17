# Architecture One-Pager

Fast, visual overview to explain the system.

---

## Services & Ports

- Frontend: React + Vite (5173)
- Backend: Node + Express (3000)
- Database: PostgreSQL (5432)
- Docker network: `app-network`

---

## Data Flow

1. Browser → Frontend (Vite)
2. Frontend → Backend (`/api/...`)
3. Backend → Prisma 7 (PG adapter)
4. Prisma → Postgres

---

## Key Tables

- `Menu` (items)
- `Cart`, `CartItem` (shopping cart)
- `User`, `Post` (examples)

---

## Configuration

- `VITE_API_URL`: frontend → backend URL
- `CORS_ORIGIN`: allowed origin for backend
- `DATABASE_URL`: Postgres connection string
- Prisma Client: `PrismaPg` adapter + `Pool`

---

## Dev vs Prod

- Dev: `docker compose up --build` (hot reload)
- Migrations: `docker exec -i taste-of-aloha-backend npx prisma migrate dev --name init`
- Prod: `docker compose -f docker-compose.prod.yml up --build -d` (Nginx proxy)

---

## Diagrams

- [System Architecture](system-architecture.dio)
- [Services Diagram](services-diagram.dio)
- Viewing guide: [HOW_TO_VIEW_DIAGRAMS.md](../HOW_TO_VIEW_DIAGRAMS.md)

Last updated: January 16, 2026