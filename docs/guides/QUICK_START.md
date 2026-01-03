# Quick Start Guide 🚀

This guide will get you up and running with the Taste of Aloha application in under 5 minutes.

---

## Prerequisites

- Node.js v20+ installed
- Docker and Docker Compose installed
- Git installed

### Verify installation (Windows PowerShell)
```powershell
docker --version
docker compose version
docker info
```
If `docker info` fails, start Docker Desktop, wait until it shows "Running", then re-run the checks.

---

## Option 1: Quick Start with Docker (Recommended)

This starts everything (database, backend, frontend) with one command:

```bash
# 1. Clone the repository (if not already done)
git clone https://github.com/hokumcangus/taste-of-aloha.git
cd taste-of-aloha

# 2. Start all services
docker compose up --build

# That's it! Access the app:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - Database: localhost:5432
```

### Stop the application:
```bash
docker compose down
```

### Fresh start (reset database):
```bash
docker compose down -v  # Remove volumes
docker compose up --build
```

---

## Option 2: Local Development (No Docker)

Run services locally for faster development with hot reload:

### Step 1: Start the Database

```bash
# Start PostgreSQL in Docker
docker compose up postgres -d

# Verify it's running
docker ps
```

### Step 2: Start the Backend

```bash
# Open a new terminal
cd apps/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and ensure DATABASE_URL points to localhost:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taste_of_aloha

# Start the server
npm run dev

# Server will run at http://localhost:3000
```

### Step 3: Start the Frontend

```bash
# Open another terminal
cd apps/web

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the dev server
npm run dev

# Frontend will run at http://localhost:5173
```

---

## Test the API

### Windows PowerShell Commands

Once the backend is running, test it with these commands:

```powershell
# Get all snacks
Invoke-WebRequest -Uri "http://localhost:3000/api/snacks" -UseBasicParsing

# Get and display as JSON
Invoke-WebRequest -Uri "http://localhost:3000/api/snacks" -Method GET -UseBasicParsing | Select-Object -ExpandProperty Content

# Create a new snack
$body = @{
    name = "Coconut Shrimp"
    description = "Crispy coconut-crusted shrimp"
    price = 8.99
    category = "appetizer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/snacks" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

# Get snack by ID
Invoke-WebRequest -Uri "http://localhost:3000/api/snacks/1" -UseBasicParsing
```

### macOS/Linux (curl)

```bash
# Health check
curl http://localhost:3000/health

# Get all snacks
curl http://localhost:3000/api/snacks

# Create a new snack
curl -X POST http://localhost:3000/api/snacks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coconut Shrimp",
    "description": "Crispy coconut-crusted shrimp",
    "price": 8.99,
    "category": "appetizer"
  }'

# Get snack by ID
curl http://localhost:3000/api/snacks/1
```

---

## Run Tests

### Backend Tests
```bash
cd apps/backend
npm test

# With coverage
npm test -- --coverage
```

### Frontend Tests
```bash
cd apps/web
npm test

# With UI
npm run test:ui

# With coverage
npm run test:coverage
```

---

## Common Commands

### Development
```bash
# Start backend
cd apps/backend && npm run dev

# Start frontend
cd apps/web && npm run dev

# Install dependencies (from root)
npm install
```

### Database
```bash
# Connect to database
docker exec -it taste-of-aloha-db psql -U postgres -d taste_of_aloha

# View all snacks
SELECT * FROM snacks;

# Exit psql
\q

# Reset database (remove all data)
docker compose down -v
docker compose up postgres -d
```

### Docker
```bash
# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart a service
docker compose restart backend

# Stop all services
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

---

## What's Next?

1. **Read the full guide**: [DATABASE_API_GUIDE.md](DATABASE_API_GUIDE.md)
2. **Understand the architecture**: [System Architecture](../architecture/README.md)
3. **Learn to add features**: See the "Adding New Features" section in DATABASE_API_GUIDE.md

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Ensure PostgreSQL is running
docker ps

# If not running, start it
docker compose up postgres -d

# Check the DATABASE_URL in apps/backend/.env
# For local dev: postgresql://postgres:postgres@localhost:5432/taste_of_aloha
# For Docker: postgresql://postgres:postgres@postgres:5432/taste_of_aloha
```

### "Port already in use"
```bash
# Stop local services if running Docker
# OR stop Docker if running locally

# Find what's using the port
lsof -i :3000  # For backend
lsof -i :5173  # For frontend
lsof -i :5432  # For database
```

### "Module not found" errors
```bash
# Reinstall dependencies
cd apps/backend && rm -rf node_modules && npm install
cd apps/web && rm -rf node_modules && npm install

# Or from root
rm -rf node_modules apps/*/node_modules
npm install
```

### Frontend can't reach backend (CORS error)
```bash
# Check backend .env has correct CORS_ORIGIN
# Should be: CORS_ORIGIN=http://localhost:5173

# Check frontend .env has correct API URL
# Should be: VITE_API_URL=http://localhost:3000
```

---

## Quick Reference

| Service | Local URL | Docker Container |
|---------|-----------|------------------|
| Frontend | http://localhost:5173 | taste-of-aloha-frontend |
| Backend API | http://localhost:3000 | taste-of-aloha-backend |
| Database | localhost:5432 | taste-of-aloha-db |

| Command | Purpose |
|---------|---------|
| `docker compose up` | Start all services |
| `docker compose down` | Stop all services |
| `docker compose down -v` | Stop and reset database |
| `npm test` | Run tests |
| `npm run dev` | Start dev server |

---

**Happy Coding! 🌺**
