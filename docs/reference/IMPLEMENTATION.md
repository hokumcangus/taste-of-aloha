# Implementation Summary: Frontend-Backend Connection

## Foundation Tasks Status ✅

All foundational setup tasks are complete:

**1. Development Environment Setup**
- Node.js LTS v24.11.0 installed (`node --version` verified)
- Docker installed and running (`docker ps` verified)
- Developer machine ready for local and containerized development

**2. Frontend Scaffold**
- Vite + React + JavaScript setup complete in `apps/web/`
- Dev server runs on port 5173 with hot module replacement
- React Router configured with Home, Menu, and About pages
- Tailwind CSS v4 integrated with proper `@import` syntax
- Redux Toolkit store configured with MenuSlice

**3. Backend Scaffold**
- Node.js + Express + JavaScript setup complete in `apps/backend/`
- Dev server runs on port 3000 with nodemon auto-restart
- Health endpoint `/health` returns 200 status (verified with curl)
- API endpoints `/api/Menus` working with CRUD operations
- CORS middleware configured for frontend communication

**4. Docker Compose**
- `docker-compose.yml` for development with hot reload
- `docker-compose.prod.yml` for production builds
- Three services orchestrated: postgres, backend, frontend
- Multi-stage Dockerfiles reduce image vulnerabilities
- Nginx configured as reverse proxy in production
- Database and backend containers run locally (verified)

**Known Issue:** Port 3000 conflict when running both local dev server and Docker backend simultaneously. Solution: Choose one environment (local OR Docker) for development.

---

## Overview

This implementation connects the React frontend to the Express backend using Redux Toolkit for state management and a custom API service layer. The connection enables the frontend to fetch, display, and manage Menu data from the backend API.

## What Was Implemented

**Redux Store Setup:** Redux Toolkit was used to create a centralized state management system. A `MenuSlice` was created with async thunks (special Redux functions) that handle API calls for fetching all Menus, fetching by ID, creating, updating, and deleting Menus. The store manages three key states: the Menus array, loading status, and error messages. This allows any component to access Menu data without prop drilling.

**API Service Layer:** A two-layer API architecture was implemented. The base `api.js` file creates a generic API client using the native `fetch` API, which handles all HTTP requests (GET, POST, PUT, DELETE) with proper error handling and JSON parsing. The `MenuService.js` file provides specific functions for each Menu-related API endpoint, making it easy to call backend routes like `/api/Menus` from anywhere in the app. The API base URL is configurable via environment variables, defaulting to `http://localhost:3000`.

**Backend CORS Configuration:** The Express backend was updated to include CORS (Cross-Origin Resource Sharing) middleware. This is essential because the frontend runs on a different port (typically 5173 for Vite) than the backend (3000), and browsers block cross-origin requests by default. The `cors()` middleware allows the frontend to make API requests to the backend without security errors.

**Component Integration:** The Menu page was updated to use Redux hooks (`useSelector` to read state, `useDispatch` to trigger actions). When the Menu component loads, it automatically dispatches the `fetchMenus` action, which calls the API service, updates the Redux store, and re-renders the component with the fetched data. The component displays loading states while fetching and error messages if the API call fails.

**Development Configuration:** Vite's proxy feature was configured to forward `/api` requests to the backend during development, simplifying API calls (you can use `/api/Menus` instead of `http://localhost:3000/api/Menus`). Additionally, PostCSS configuration was fixed for Tailwind CSS v4 compatibility by installing and using the `@tailwindcss/postcss` plugin, and the package.json was updated to use ES modules (`"type": "module"`).

**Nginx Configuration:** Nginx serves as the web server in the Docker production environment. It serves the built React application's static files (HTML, CSS, JavaScript, images) and acts as a reverse proxy to route API requests from `/api/*` to the backend container. This setup provides several benefits: efficient static file serving, eliminates CORS issues by routing all requests through the same domain, adds a security layer between the internet and the application, and enables caching and compression for better performance. The Nginx configuration file (`nginx.conf`) defines these routing rules and is included in the web app's Docker container.

**Tailwind CSS v4 Migration:** The project uses Tailwind CSS v4, which changed the syntax for importing styles. Instead of the older `@tailwind` directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`), v4 uses a single `@import "tailwindcss";` statement in the CSS file. This change was made in `index.css` to eliminate linting errors and ensure compatibility with the newer Tailwind version.

**React Router Implementation:** React Router DOM was integrated to enable client-side navigation between pages. The app now uses `BrowserRouter` to wrap the application, with `Routes` and `Route` components defining the URL structure. Three main routes were created: `/` (Home), `/menu` (Menu), and `/about` (About). A sticky navigation bar was added with `Link` components for seamless page transitions without full page reloads. The Nginx configuration supports this with the `try_files` directive, ensuring all routes fallback to `index.html` for proper SPA behavior.

**Homepage Video Background:** A full-screen looping video background was implemented on the homepage using HTML5 video element. The video includes `autoPlay`, `loop`, `muted`, and `playsInline` attributes for optimal user experience and autoplay compatibility. A poster image serves as a fallback while the video loads. For mobile devices (screen width < 768px), a static image is displayed instead of the video to reduce bandwidth usage and improve performance. A dark overlay (`bg-black/50`) was added over the video to ensure text readability, and responsive typography (`text-5xl md:text-7xl`) adapts to different screen sizes.

**Git Workflow & Branch Management:** The project follows a feature-branch workflow with clear separation of concerns. Docker-related changes (Dockerfiles, docker-compose files, nginx config) were committed to `feat/docker-setup` branch, while UI and feature changes (homepage video, React Router, documentation) were committed to `feat/homepage-video-ui` branch. This separation keeps pull requests focused and easier to review. Both branches were successfully pushed to the remote repository for future pull request creation.

## How It Works Together

When a user visits the Menu page: (1) The component mounts and dispatches `fetchMenus()`, (2) Redux calls the Menu service which uses the API client to make a GET request to `/api/Menus`, (3) The backend (with CORS enabled) responds with JSON data, (4) Redux updates the store with the Menus array and sets loading to false, (5) The Menu component re-renders with the new data from Redux state, displaying the Menus in a grid layout. This pattern ensures data flows in one direction (unidirectional data flow) and makes the app predictable and easier to debug.

