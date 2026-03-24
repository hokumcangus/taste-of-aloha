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

## 🛠 Development Scripts

### One Command (from repo root)

```bash
npm run dev
```

This automatically:
1. Starts Docker Desktop if not already running
2. Brings up the postgres container
3. Starts backend (port 3000) and frontend (port 5173) in parallel

### Individual Scripts (from repo root)

```bash
npm run dev:backend    # Start API only (port 3000)
npm run dev:web        # Start frontend only (port 5173)
npm run dev:db         # Start postgres container only
npm run test:coverage  # Run coverage for both apps
```

### Manual (from app directories)

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
cd /path/to/taste-of-aloha
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
curl.exe http://localhost:3000/health | jq

# Read menu
curl.exe http://localhost:3000/api/menu | jq
curl.exe "http://localhost:3000/api/menu?category=Snacks" | jq

# Create test item
curl.exe -X POST http://localhost:3000/api/menu -H "Content-Type: application/json" -d "{\"name\":\"Curl Test Item\",\"description\":\"created by curl\",\"price\":7.25,\"category\":\"Snacks\",\"isAvailable\":true}" | jq

# Update item 1
curl.exe -X PUT http://localhost:3000/api/menu/1 -H "Content-Type: application/json" -d "{\"price\":8.10,\"category\":\"Snack\"}" | jq

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

## 🔌 Connectivity Verification (PowerShell)

```powershell
# From repo root — starts everything in one command
npm run dev

# In a separate terminal: verify backend + frontend connectivity
(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode

$menuResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$menuItems = $menuResponse.Content | ConvertFrom-Json
"menu-status=$($menuResponse.StatusCode) menu-count=$($menuItems.Count)"

$cartResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/cart" -UseBasicParsing
$cartItems = $cartResponse.Content | ConvertFrom-Json
"cart-status=$($cartResponse.StatusCode) cart-count=$($cartItems.Count)"

# Frontend should usually be on 5173 unless that port was already in use
(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```

Expected:
- Health: `200`
- Menu API: `menu-status=200`
- Cart API: `cart-status=200`
- Frontend: `200`
