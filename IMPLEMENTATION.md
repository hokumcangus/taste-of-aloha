# Implementation Summary: Frontend-Backend Connection

## Overview

This implementation connects the React frontend to the Express backend using Redux Toolkit for state management and a custom API service layer. The connection enables the frontend to fetch, display, and manage snack data from the backend API.

## What Was Implemented

**Redux Store Setup:** Redux Toolkit was used to create a centralized state management system. A `snackSlice` was created with async thunks (special Redux functions) that handle API calls for fetching all snacks, fetching by ID, creating, updating, and deleting snacks. The store manages three key states: the snacks array, loading status, and error messages. This allows any component to access snack data without prop drilling.

**API Service Layer:** A two-layer API architecture was implemented. The base `api.js` file creates a generic API client using the native `fetch` API, which handles all HTTP requests (GET, POST, PUT, DELETE) with proper error handling and JSON parsing. The `snackService.js` file provides specific functions for each snack-related API endpoint, making it easy to call backend routes like `/api/snacks` from anywhere in the app. The API base URL is configurable via environment variables, defaulting to `http://localhost:3000`.

**Backend CORS Configuration:** The Express backend was updated to include CORS (Cross-Origin Resource Sharing) middleware. This is essential because the frontend runs on a different port (typically 5173 for Vite) than the backend (3000), and browsers block cross-origin requests by default. The `cors()` middleware allows the frontend to make API requests to the backend without security errors.

**Component Integration:** The Menu page was updated to use Redux hooks (`useSelector` to read state, `useDispatch` to trigger actions). When the Menu component loads, it automatically dispatches the `fetchSnacks` action, which calls the API service, updates the Redux store, and re-renders the component with the fetched data. The component displays loading states while fetching and error messages if the API call fails.

**Development Configuration:** Vite's proxy feature was configured to forward `/api` requests to the backend during development, simplifying API calls (you can use `/api/snacks` instead of `http://localhost:3000/api/snacks`). Additionally, PostCSS configuration was fixed for Tailwind CSS v4 compatibility by installing and using the `@tailwindcss/postcss` plugin, and the package.json was updated to use ES modules (`"type": "module"`).

**Nginx Configuration:** Nginx serves as the web server in the Docker production environment. It serves the built React application's static files (HTML, CSS, JavaScript, images) and acts as a reverse proxy to route API requests from `/api/*` to the backend container. This setup provides several benefits: efficient static file serving, eliminates CORS issues by routing all requests through the same domain, adds a security layer between the internet and the application, and enables caching and compression for better performance. The Nginx configuration file (`nginx.conf`) defines these routing rules and is included in the web app's Docker container.

**Tailwind CSS v4 Migration:** The project uses Tailwind CSS v4, which changed the syntax for importing styles. Instead of the older `@tailwind` directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`), v4 uses a single `@import "tailwindcss";` statement in the CSS file. This change was made in `index.css` to eliminate linting errors and ensure compatibility with the newer Tailwind version.

## How It Works Together

When a user visits the Menu page: (1) The component mounts and dispatches `fetchSnacks()`, (2) Redux calls the snack service which uses the API client to make a GET request to `/api/snacks`, (3) The backend (with CORS enabled) responds with JSON data, (4) Redux updates the store with the snacks array and sets loading to false, (5) The Menu component re-renders with the new data from Redux state, displaying the snacks in a grid layout. This pattern ensures data flows in one direction (unidirectional data flow) and makes the app predictable and easier to debug.

