# 🚀 Quick Reference Card — Taste of Aloha

**Print this or keep it in your terminal!**

---

## ⚡ One-Command Startup

```bash
# Everything at once (Recommended)
docker-compose up --build

# Then open:
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
# Database: Use Prisma Studio (see below)
```

---

## 🔥 Most-Used Commands

| What | Command | Duration |
|------|---------|----------|
| **Start all services** | `docker-compose up --build` | ~30 sec |
| **Stop all** | `docker-compose down` | ~5 sec |
| **Reset database** | `docker-compose down -v && docker-compose up` | ~30 sec |
| **View database GUI** | `npx prisma studio` | Opens at `:5555` |
| **Run migrations** | `npx prisma migrate dev --name [name]` | ~10 sec |
| **Run frontend tests** | `npm run test` (in `apps/web/`) | ~5 sec |
| **Run backend tests** | `npm run test:api` (in `apps/backend/`) | ~10 sec |

---

## 📍 Service Locations

| Service | URL | Health Check |
|---------|-----|--------------|
| Frontend | http://localhost:5173 | Open in browser |
| Backend | http://localhost:3000/health | Returns `200` |
| Database | localhost:5432 | `psql -U postgres -d taste_of_aloha` |
| Prisma Studio | http://localhost:5555 | GUI after running `prisma studio` |

---

## 🛒 Frontend Essentials

**Location:** `apps/web/`

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Check code style
npm run lint
```

**Redux Cart Methods:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, selectCartTotal } from './store/cartSlice';

// In component:
const dispatch = useDispatch();
const total = useSelector(selectCartTotal);

dispatch(addItem(product));
dispatch(removeItem(productId));
```

---

## ⚙️ Backend Essentials

**Location:** `apps/backend/`

```bash
# Start dev server
npm run dev

# Run API tests
npm run test:api

# Database management
npx prisma studio         # GUI viewer
npx prisma migrate dev    # Create & apply migration
npx prisma generate      # Update client
npx prisma validate      # Check schema
```

**API Endpoints:**
```
GET    /health              Check if backend is running
GET    /api/menu           Get all menu items
POST   /api/menu           Create menu item
GET    /api/menu/:id       Get menu item by ID
PUT    /api/menu/:id       Update menu item
DELETE /api/menu/:id       Delete menu item
```

---

## 🗄️ Database Essentials

**Location:** `apps/backend/DATABASE_SETUP_GUIDE.md` (for full details)

```bash
# Connect to database (local)
psql -U postgres -d taste_of_aloha

# Inside psql:
\dt                 List all tables
\d "Menu"           Show Menu structure
SELECT * FROM "Menu";  Query menu

# Create a backup
pg_dump -U postgres taste_of_aloha > backup.sql

# Restore from backup
psql -U postgres taste_of_aloha < backup.sql
```

---

## 🐛 Debugging Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| **Port already in use** | `docker-compose down` and restart |
| **Can't connect to DB** | `docker-compose ps` (verify postgres is Up) |
| **Frontend can't reach backend** | Check `VITE_API_URL` in `.env` |
| **Backend slow** | `docker-compose logs backend` (check for errors) |
| **Tests failing** | `npm install` then `npm run test` |
| **Database corruption** | `docker-compose down -v && docker-compose up --build` |

---

## 📚 Reading Path by Role

### 👨‍💻 I'm a Frontend Developer
1. This card (2 min)
2. `apps/web/README.md` (5 min)
3. `docs/guides/LEARNING_GUIDE.md` (30 min)

### ⚙️ I'm a Backend Developer
1. This card (2 min)
2. `apps/backend/README.md` (5 min)
3. `docs/guides/BACKEND_API_GUIDE.md` (30 min)
4. `apps/backend/DATABASE_SETUP_GUIDE.md` (as needed)

### 🔧 I'm DevOps / Database Team
1. This card (2 min)
2. `apps/backend/DATABASE_SETUP_GUIDE.md` (20 min)
3. `docs/guides/DATABASE_API_GUIDE.md` (30 min)

### 🆕 I'm Joining the Team
1. This card (2 min)
2. `/README.md` (5 min)
3. Choose your role path above

---

## 🆘 When Things Break

### Step 1: Turn it off and on again
```bash
docker-compose down -v
docker-compose up --build
```

### Step 2: Check the logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Step 3: Search the troubleshooting guide
→ `docs/guides/EXTERNAL_TROUBLESHOOTING_TEMPLATE.md`

### Step 4: Ask for help
**In Slack #engineering, include:**
- What were you trying to do?
- What error did you get?
- Output of `docker-compose ps`

---

## 📋 Environment Variables

**Create these files:**

### `apps/web/.env`
```env
VITE_API_URL=http://localhost:3000
```

### `apps/backend/.env`
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/taste_of_aloha?schema=public
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Never commit `.env` files!**

---

## ⏱️ Typical Workflow

```bash
# 1. Start services (do this once, keep running)
docker-compose up --build

# 2. In another terminal, navigate to frontend or backend
cd apps/frontend
npm run dev          # Frontend hot reloads on file change

# 3. Or in another terminal for backend
cd apps/backend
npm run dev          # Backend hot reloads on file change

# 4. Open browser
firefox http://localhost:5173

# 5. When done, Ctrl+C in each terminal, then:
docker-compose down
```

---

## 🎯 Key Files You'll Edit

| File | Purpose | Edit When |
|------|---------|-----------|
| `src/components/**/*.jsx` | UI components | Building frontend |
| `src/store/cartSlice.js` | Redux state | Updating cart logic |
| `src/routes/**/*.jsx` | Pages | Adding new pages |
| `src/services/**/*.js` | API calls | Connecting to backend |
| `src/controllers/**/*.js` | Request handlers | Building API |
| `src/models/**/*.js` | Database queries | Changing data access |
| `prisma/schema.prisma` | Database schema | Adding tables |
| `.env` | Configuration | Changing ports/URLs |

---

## 💾 Git Workflow

```bash
# See current status
git status

# Create a new branch
git checkout -b feature/my-feature

# Make changes, then commit
git add .
git commit -m "Add my feature"

# Push to GitHub
git push origin feature/my-feature

# Create a Pull Request on GitHub
```

---

## 📞 Need Help?

| Question | Answer |
|----------|--------|
| **How do I start?** | `docker-compose up --build` |
| **Where's the code?** | Frontend: `apps/web/src/`, Backend: `apps/backend/src/` |
| **How do I add a page?** | Edit `apps/web/src/pages/`, add to router |
| **How do I add an endpoint?** | Edit `apps/backend/src/routes/`, `apps/backend/src/controllers/` |
| **How do I change the database?** | Edit `apps/backend/prisma/schema.prisma`, run migration |
| **Where's the full docs?** | `/README.md` or `docs/` folder |
| **Something's broken, help!** | See "When Things Break" section above |

---

**Last Updated:** January 30, 2026  
**Created by:** Taste of Aloha Team  
**For questions:** Ask in #engineering on Slack
