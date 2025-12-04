# 🌺 Taste of Aloha Monorepo 🌺

This repository powers the **Taste of Aloha Food Delivery Service**, the central platform that unifies our restaurant, grocery, and bakery into one seamless experience.  

## Overview
Taste of Aloha is a community‑driven Hawaiian business built around sharing authentic island flavors and culture.  
This monorepo is dedicated to developing and maintaining our **delivery infrastructure**, ensuring customers can enjoy Hawaiian meals, baked goods, and snacks wherever they are.  

## Ecosystem
- **Restaurant** — serving traditional Hawaiian dishes with aloha spirit  
- **Island Delights Grocery & Bakery** — offering baked goods, snacks, and local favorites  
- **Food Delivery Service** — the core of this repo, connecting our offerings with customers through modern delivery workflows  

## Tech Stack
- **Frontend**: React + Vite, Redux Toolkit (state management), Tailwind CSS v4 (styling)  
- **Backend**: Node.js / Express (order management, APIs)  
- **Database**: PostgreSQL (menu, inventory, orders)  
- **Infrastructure**: Docker, Nginx (production web server & reverse proxy), CI/CD pipelines, cloud deployment  
- **Integrations**: Stripe (payments), Twilio/SendGrid (notifications), Firebase (push messaging)  

---

## 🚀 Getting Started

You can run the app in two ways: **Local Development** or **Docker**.

### Option 1: Local Development (Recommended for Development)

#### 1. Install Dependencies
At the root:
```bash
npm install
```
This installs shared tools and links workspaces.

#### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env
# Edit .env with your settings (default values work for local dev)
```

#### 3. Frontend (apps/web)
```bash
cd apps/web
npm install
npm run dev
```
Runs Vite.js frontend at `http://localhost:5173`.

#### 4. Backend (apps/backend)
```bash
cd apps/backend
npm install
npm run dev
```
Starts backend server (Express) at `http://localhost:3000`.

#### 5. Shared Packages
Shared libraries (`shared/libs`) are automatically linked via workspaces.

---

### Option 2: Docker (Production-like Environment)

Docker runs the entire stack (frontend, backend, database) in isolated containers. Perfect for testing production builds or when you don't want to install dependencies locally.

#### Development Mode (with hot reload)
```bash
# From project root
docker-compose up --build
```

**What this does:**
- Starts PostgreSQL database on port 5432
- Starts backend (Node.js/Express) on port 3000 with nodemon for hot reload
- Starts frontend (React/Vite) on port 5173 with hot reload
- Your code changes are automatically reflected (volume mounts sync your local files)

**Access:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api/snacks`
- Database: `localhost:5432` (credentials in `.env`)

**Stop containers:**
```bash
docker-compose down
```

#### Production Mode
```bash
# From project root
docker-compose -f docker-compose.prod.yml up --build -d
```

**What this does:**
- Builds optimized production images
- Runs Nginx as reverse proxy serving static files
- Backend runs as non-root user for security
- All services have health checks and restart policies
- Database not exposed externally

**Access:**
- Frontend + API: `http://localhost` (Nginx routes `/api` to backend)

**Stop containers:**
```bash
docker-compose -f docker-compose.prod.yml down
```

---

### Environment Variables Explained

The `.env` file controls how services connect:

- **DB_USER, DB_PASSWORD, DB_NAME**: PostgreSQL credentials
- **CORS_ORIGIN**: Frontend URL for CORS (prevents unauthorized access)
- **VITE_API_URL**: Backend URL the frontend calls
- **DATABASE_URL**: Full connection string for backend to connect to database

**Local dev**: Frontend and backend run separately, talk via `localhost:3000`
**Docker dev**: Services use container names (e.g., `backend:3000`) via Docker network
**Docker prod**: Nginx proxies everything, frontend calls `/api` which routes to backend

---

## 📂 Project Structure
For the full file structure and detailed documentation, see the [Wiki](https://github.com/hokumcangus/taste-of-aloha/wiki#-file-structure).

```
taste-of-aloha/
  apps/
    web/                    # React + Vite frontend
      Dockerfile            # Multi-stage build (dev/prod)
      nginx.conf            # Production web server config
    backend/                # Node.js/Express backend
      Dockerfile            # Multi-stage build (dev/prod)
    mobile/                 # React Native wrapper (future)
  shared/                   # Configs + libraries
  infra/                    # Docker + Kubernetes
  docker-compose.yml        # Development environment
  docker-compose.prod.yml   # Production environment
  .env.example              # Environment variables template
  .env                      # Local environment (not committed)
  package.json              # Root workspace config
  README.md
```

---

Perfect 🌺 — here’s a **Contributing section** you can add to your README so collaborators know exactly how to work in the monorepo without confusion.

---

## 🤝 Contributing

We welcome contributions to **Taste of Aloha**!  
To keep the workflow smooth and consistent, please follow these guidelines:

### 1. Branch Strategy
- **`main`** → stable branch, always deployable.  
- **Feature branches** → create from `main` using the format:
  ```
  feature/<short-description>
  ```
  Example: `feature/add-checkout-page`

- **Fix branches** → for bug fixes:
  ```
  fix/<short-description>
  ```
  Example: `fix/order-validation`

- **Backend vs Frontend** → keep changes scoped:
  - Frontend work → `apps/web`
  - Backend work → `apps/backend`
  - Shared utilities → `shared/libs`

---

### 2. Commit Style
Use [Conventional Commits](https://www.conventionalcommits.org/) for clarity:
```
feat: add checkout page
fix: correct order validation logic
docs: update README with backend setup
chore: bump dependency versions
```

---

### 3. Pull Requests
- Open PRs against `main`.  
- Keep PRs focused (one feature/fix at a time).  
- Include screenshots or code snippets if relevant.  
- Add a short checklist in the PR description:
  - [ ] Code runs locally  
  - [ ] Tests pass (if applicable)  
  - [ ] Documentation updated  

---

### 4. Code Quality
- Run linting before committing:
  ```bash
  npm run lint
  ```
- Format code with Prettier:
  ```bash
  npm run format
  ```
- Ensure shared configs (`shared/configs`) are respected.

---

### 5. Onboarding Notes
- Always run `npm install` at the root before working in any app.  
- Use workspace scripts for convenience:
  ```bash
  npm run dev:web
  npm run dev:backend
  ```

---

## 🛠 Development Notes

This repo uses **Vite** for the frontend.  
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — Babel/Oxc for Fast Refresh  
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) — SWC for Fast Refresh  

### React Compiler
The React Compiler is not enabled in this template because of its impact on dev & build performance.  
To add it, see [React Compiler installation docs](https://react.dev/learn/react-compiler/installation).

### ESLint
For production apps, we recommend expanding ESLint with type‑aware rules.  
Check out the [TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for integration with [`typescript-eslint`](https://typescript-eslint.io).
