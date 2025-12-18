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

## 📚 Documentation

We have comprehensive documentation to help you understand and work with this project:

### Architecture & Features
- **[Documentation Index](docs/INDEX.md)** - Central hub for all documentation
- **[MVP Features](docs/planning/MVP_FEATURES.md)** - Complete feature specifications
- **[System Architecture Diagram](docs/architecture/system-architecture.dio)** - Visual system overview
- **[Services Diagram](docs/architecture/services-diagram.dio)** - Detailed service interactions
- **[Developer Quick Reference](docs/reference/QUICK_REFERENCE.md)** - Developer quick reference guide
- **[How to View Diagrams](docs/HOW_TO_VIEW_DIAGRAMS.md)** - Guide for viewing architecture diagrams

### Learning & Setup Guides
- **[Learning Guide](docs/guides/LEARNING_GUIDE.md)** - ⭐ Best place to start! Comprehensive guide to all technologies and setup
- **[Database Setup Guide](docs/guides/DATABASE_SETUP_GUIDE.md)** - Complete PostgreSQL & Prisma setup with all steps and commands
- **[Database Commands Reference](docs/reference/DATABASE_COMMANDS_REFERENCE.md)** - Quick lookup for database commands
- **[Docker Setup Guide](docs/setup/DOCKER_SETUP_GUIDE.md)** - Docker configuration and running containers
- **[Setup Checklist](docs/setup/SETUP_CHECKLIST.md)** - Step-by-step checklist for getting started

### Project Planning & Tasks
- **[Quick Reference](docs/reference/QUICK_REFERENCE.md)** - Quick guide to creating issues and organizing work
- **[Task Breakdown](docs/planning/TASK_BREAKDOWN.md)** - Detailed breakdown of all tasks by sprint
- **[Sprint Planning](docs/planning/SPRINT_PLANNING.md)** - Sprint overview, timelines, and dependencies
- **[Issues Setup Guide](docs/setup/ISSUES_SETUP_GUIDE.md)** - Complete guide for using GitHub issues and project boards

**New to the project?** Start with [Learning Guide](docs/guides/LEARNING_GUIDE.md) for full setup and technology explanations!

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

## ✅ Foundation Tasks Completed

The following foundational setup tasks have been completed:

### 1. Development Environment
- ✅ **Node.js LTS**: v24.11.0 installed and verified
- ✅ **Docker**: Installed and running
- **Verification**: `node --version` and `docker ps` both work

### 2. Frontend Scaffold
- ✅ **Tech Stack**: Vite + React + JavaScript
- ✅ **Dev Server**: Runs at http://localhost:5173 with hot reload
- ✅ **Features**: React Router (Home, Menu, About), Tailwind CSS v4, Redux Toolkit
- **Verification**: `npm run dev` in `apps/web` serves the site

### 3. Backend Scaffold
- ✅ **Tech Stack**: Node.js + Express + JavaScript
- ✅ **Dev Server**: Runs at http://localhost:3000 with nodemon
- ✅ **Health Check**: GET `/health` returns 200 with status JSON
- ✅ **API Endpoints**: `/api/snacks` CRUD operations working
- **Verification**: `npm run dev` in `apps/backend` starts server, `curl http://localhost:3000/health` returns status

### 4. Docker Compose
- ✅ **Services**: PostgreSQL database + backend + frontend
- ✅ **Development Mode**: `docker-compose.yml` with hot reload and volume mounts
- ✅ **Production Mode**: `docker-compose.prod.yml` with optimized builds and Nginx
- ⚠️ **Note**: Cannot run local dev servers and Docker simultaneously on same ports
- **Verification**: `docker-compose up` starts all services (stop local servers first)

### 📖 Next Steps

See **[LEARNING_GUIDE.md](./docs/guides/LEARNING_GUIDE.md)** for a comprehensive guide on:
- Understanding what was built and why
- Learning the technologies used
- Implementing the order system (next major feature)
- Best practices and resources

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

---

## 🏗️ Architecture

This project follows a modern, scalable architecture designed for growth. Key highlights:

- **Client-Server Architecture**: Clear separation between frontend (React) and backend (Express)
- **Service-Oriented Design**: Modular services for menu, cart, checkout, orders, payments, and admin
- **Multi-Role Support**: Guest, authenticated customer, and admin user flows
- **External Integrations**: Stripe (payments), Firebase/Auth0 (auth), SendGrid/Twilio (notifications)
- **Scalable Infrastructure**: Docker containers, CI/CD pipeline, cloud hosting with CDN

**Want to understand the complete system?**
- 📊 View [System Architecture Diagram](docs/architecture/system-architecture.dio) for the big picture
- 🔄 View [Services Diagram](docs/architecture/services-diagram.dio) for service interactions
- 📖 Read [Architecture README](docs/architecture/README.md) for detailed documentation

**Need the .dio files?** They're Draw.io diagrams! See [How to View Diagrams](docs/HOW_TO_VIEW_DIAGRAMS.md) for instructions.

---

## 🌺 About Taste of Aloha

We're not just building a delivery platform—we're creating a way to share authentic Hawaiian culture and flavors with the world. Every feature is designed with aloha spirit: quality, community, and genuine care for our customers.
