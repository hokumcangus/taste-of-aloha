# 🌴 Taste of Aloha | Monorepo

Welcome to the Taste of Aloha full-stack monorepo. This project uses a workspace architecture to manage our frontend, backend, and database in one place.

## 🏗 Project Structure

- **`apps/web`**: React Frontend (Vite + Redux + Tailwind CSS v4)
- **`apps/backend`**: Express API (Node.js + Prisma 7 + PostgreSQL)
- **`docs/`**: Architectural deep-dives, guides, and diagrams

## 🚀 Quick Start (Docker Recommended)

The easiest way to run the entire system:

```bash
docker compose up --build
```

This starts:
- **Frontend**: http://localhost:5173 (React + Vite)
- **Backend**: http://localhost:3000 (Express API)
- **Database**: localhost:5432 (PostgreSQL)

To stop:
```bash
docker compose down
```

To reset the database (wipe volumes):
```bash
docker compose down -v
docker compose up --build
```

## 🛠 Manual Development Scripts

Run these from app directories:

```bash
cd apps/backend
npm run dev            # Start API (port 3000)

cd ../web
npm run dev            # Start frontend (port 5173)

cd ../backend
npx prisma studio      # Optional DB GUI
```

## 🧪 PowerShell Copy/Paste DB Check

```powershell
cd C:\path\to\taste-of-aloha
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
docker compose down -v
docker compose up -d postgres
cd apps\backend
npx prisma migrate dev
npx prisma generate
node index.js
```

In another terminal:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing
```

### PowerShell API Smoke Test (curl-safe)

Use `curl.exe` in PowerShell (not `curl`, which is an alias for `Invoke-WebRequest`):

```powershell
# Health
curl.exe http://localhost:3000/health

# Read menu
curl.exe http://localhost:3000/api/menu
curl.exe "http://localhost:3000/api/menu?category=Snacks"

# Create test item
curl.exe -X POST http://localhost:3000/api/menu -H "Content-Type: application/json" -d "{\"name\":\"Curl Test Item\",\"description\":\"created by curl\",\"price\":7.25,\"category\":\"Snacks\",\"isAvailable\":true}"

# Update item 1
curl.exe -X PUT http://localhost:3000/api/menu/1 -H "Content-Type: application/json" -d "{\"price\":8.10,\"category\":\"Snack\"}"

# Delete item 1
curl.exe -X DELETE http://localhost:3000/api/menu/1

# Pretty JSON alternative
Invoke-RestMethod http://localhost:3000/api/menu | ConvertTo-Json -Depth 6
```

## 📚 Documentation & Resources

- **[Frontend Guide](apps/web/README.md)** — React, Redux, and UI components
- **[Backend Guide](apps/backend/README.md)** — API routes and database models
- **[Architecture Diagrams](docs/architecture/system-architecture.dio)** — System design diagrams
- **[Database Setup](apps/backend/DATABASE_SETUP_GUIDE.md)** — PostgreSQL and Prisma configuration

## 🐛 Troubleshooting

For common issues and solutions:
- **Setup Issues**: [TROUBLESHOOTING.md](docs/guides/TROUBLESHOOTING.md)
- **Database Issues**: [DATABASE_SETUP_GUIDE.md](apps/backend/DATABASE_SETUP_GUIDE.md)

## 📖 Team Resources

- **Learning Guide**: [LEARNING_GUIDE.md](docs/guides/LEARNING_GUIDE.md)
- **Testing Guide**: [TESTING_GUIDE.md](docs/guides/TESTING_GUIDE.md)
