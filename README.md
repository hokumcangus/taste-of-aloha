Perfect 🌺 — here’s a **Taste of Aloha README skeleton** you can drop into your repo. It replaces the boilerplate Vite text with a clear intro, onboarding instructions, and keeps the useful Vite/React notes under “Development Notes.”

---

# Taste of Aloha Monorepo 🌺

This repository powers the **Taste of Aloha** platform — a community‑driven snack and food delivery service.  
It contains multiple apps and shared libraries:

- **apps/web** → Vite.js frontend (React + Tailwind/Shadcn)  
- **apps/backend** → Node.js/Express backend API  
- **apps/mobile** → React Native wrapper (future)  
- **shared/** → Configs and libraries shared across apps  
- **infra/** → Docker and Kubernetes manifests for deployment  

---

## 🚀 Getting Started

### 1. Install Dependencies
At the root:
```bash
npm install
```
This installs shared tools and links workspaces.

### 2. Frontend (apps/web)
```bash
cd apps/web
npm install
npm run dev
```
Runs Vite.js frontend at `http://localhost:5173`.

### 3. Backend (apps/backend)
```bash
cd apps/backend
npm install
npm run dev
```
Starts backend server (Express). Currently minimal, will expand later.

### 4. Shared Packages
Shared libraries (`shared/libs`) are automatically linked via workspaces.

---

## 📂 Project Structure
For the full file structure and detailed documentation, see the [Wiki](https://github.com/hokumcangus/taste-of-aloha/wiki#-file-structure).

```
taste-of-aloha/
  apps/
    web/        # React + Vite frontend
    backend/    # Node.js/Express backend
    mobile/     # React Native wrapper (future)
  shared/       # Configs + libraries
  infra/        # Docker + Kubernetes
  package.json  # Root workspace config
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
