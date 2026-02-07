# Troubleshooting Guide

## Common Errors and Solutions

### Docker not installed or Docker daemon not running

**Symptoms:**
- `docker : The term 'docker' is not recognized`
- `Cannot connect to the Docker daemon`
- `docker info` fails or times out

**Checks (Windows PowerShell):**
```powershell
docker --version
docker compose version
docker info
Get-Service com.docker.service
```

**Fixes:**
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Start Docker Desktop and wait until it shows "Running"
3. Re-run `docker info` to confirm the engine is up
4. Optional sanity test:
   ```powershell
   docker run hello-world
   ```


### 1. PostCSS Config Error: "Failed to load PostCSS config" or "Invalid or unexpected token"

**Problem:** PostCSS configuration file has incorrect syntax or package.json is missing module type.

**Error Messages:**
- `Failed to load PostCSS config: [SyntaxError] Invalid or unexpected token`
- `Module type of file is not specified and it doesn't parse as CommonJS`
- `Reparsing as ES module because module syntax was detected`

**Solution:**
1. **Add "type": "module" to package.json:**
   ```json
   {
     "name": "web",
     "version": "1.0.0",
     "type": "module",
     ...
   }
   ```

2. **Fix postcss.config.js** - It should export a configuration object, not contain CSS:
   ```javascript
   // ❌ WRONG - Don't put CSS directives here
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   // ✅ CORRECT - Export config object
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

3. **Make sure Tailwind directives are in your CSS file** (`src/index.css`):
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Restart the dev server** after making these changes:
   ```bash
   # Stop server (Ctrl+C)
   cd apps/web
   npm run dev
   ```

**How to verify:**
- Check `apps/web/package.json` has `"type": "module"` at the top level
- Check `apps/web/postcss.config.js` exports a config object (not CSS)
- Check `apps/web/src/index.css` contains the `@tailwind` directives
- Restart dev server and check for errors

---

### 1a. Tailwind CSS v4 PostCSS Plugin Error: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"

**Problem:** Tailwind CSS v4 requires a separate PostCSS plugin package. The PostCSS plugin has moved to `@tailwindcss/postcss`.

**Error Messages:**
- `It looks like you're trying to use tailwindcss directly as a PostCSS plugin`
- `The PostCSS plugin has moved to a separate package`
- `you'll need to install @tailwindcss/postcss`

**Solution:**
1. **Install the Tailwind v4 PostCSS plugin:**
   ```bash
   cd apps/web
   npm install -D @tailwindcss/postcss
   ```

2. **Update postcss.config.js** to use the new plugin:
   ```javascript
   // ❌ WRONG - For Tailwind v4
   export default {
     plugins: {
       tailwindcss: {},  // This doesn't work in v4
       autoprefixer: {},
     },
   };
   
   // ✅ CORRECT - For Tailwind v4
   export default {
     plugins: {
       '@tailwindcss/postcss': {},  // Use the new plugin
       autoprefixer: {},
     },
   };
   ```

3. **Restart the dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

**Alternative Solution (Downgrade to Tailwind v3):**
If you prefer the traditional setup, you can downgrade to Tailwind v3:
```bash
npm install -D tailwindcss@^3.4.0
```
Then use `tailwindcss: {}` in your PostCSS config (as shown in error #1).

**How to verify:**
- Check `apps/web/package.json` includes `@tailwindcss/postcss` in devDependencies
- Check `apps/web/postcss.config.js` uses `'@tailwindcss/postcss'` instead of `tailwindcss`
- Restart dev server - error should be gone

---

### 2. CORS Error: "Access to fetch at 'http://localhost:3000/api/menuitems' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Problem:** The backend is not allowing requests from the frontend.

**Solution:**
1. Make sure CORS is imported and configured in `apps/backend/index.js`:
   ```javascript
   const cors = require('cors');
   // ...
   app.use(cors());
   ```
2. Restart your backend server after adding CORS
3. Verify the backend is running on port 3000

**How to verify:**
- Check `apps/backend/index.js` has `const cors = require('cors');` at the top
- Check `apps/backend/index.js` has `app.use(cors());` before your routes
- Restart backend: `cd apps/backend && npm run dev`

---

### 3. Error: "Failed to fetch" or Network Error

**Problem:** The backend server is not running or not accessible.

**Solution:**
1. Make sure the backend is running:
   ```bash
   cd apps/backend
   npm run dev
   ```
2. Verify the backend is accessible:
   - Open `http://localhost:3000/` in your browser
   - You should see: "Taste of Aloha backend is running 🌺"
3. Check the backend port matches the frontend configuration:
   - Backend default: `http://localhost:3000`
   - Frontend config: `apps/web/src/config/api.js` should use `http://localhost:3000`

**How to test:**
```bash
# Test backend is running
curl http://localhost:3000/
# Should return: Taste of Aloha backend is running 🌺

# Test API endpoint
curl http://localhost:3000/api/menuitems
# Should return: [] (empty array if no menuitems)
```

---

### 4. Error: "Cannot read property 'menuitems' of undefined" or Redux State Issues

**Problem:** Redux store is not properly configured or Provider is missing.

**Solution:**
1. Verify `apps/web/src/main.jsx` wraps App with Provider:
   ```javascript
   import { Provider } from 'react-redux';
   import { store } from './store/store.js';
   
   <Provider store={store}>
     <App />
   </Provider>
   ```
2. Check that `apps/web/src/store/store.js` exists and exports the store
3. Verify Redux Toolkit is installed:
   ```bash
   cd apps/web
   npm list @reduxjs/toolkit react-redux
   ```

**How to verify:**
- Check browser console for Redux DevTools (if installed)
- Verify no import errors in the console

---

### 5. Error: "Module not found: Can't resolve './store/store.js'"

**Problem:** File path is incorrect or file doesn't exist.

**Solution:**
1. Verify the file structure:
   ```
   apps/web/src/
   ├── store/
   │   ├── store.js
   │   └── slices/
   │       └── snackSlice.js
   ├── services/
   │   ├── api.js
   │   └── snackService.js
   └── config/
       └── api.js
   ```
2. Check import paths are correct (case-sensitive)
3. Restart the dev server after creating new files

---

### 6. Error: "The requested module '/src/config/api.js' does not provide an export named 'default'"

**Problem:** Export/import mismatch in API configuration.

**Solution:**
1. Verify `apps/web/src/config/api.js` exports default:
   ```javascript
   export default API_BASE_URL;
   ```
2. Verify `apps/web/src/services/api.js` imports correctly:
   ```javascript
   import API_BASE_URL from '../config/api.js';
   ```

---

### 7. Error: "Loading menuitems..." but no data appears

**Problem:** Backend returns empty array or API call fails silently.

**Solution:**
1. Check browser Network tab (F12 → Network) for API requests
2. Verify the request URL is correct: `http://localhost:3000/api/menuitems`
3. Check if backend has any menuitems:
   ```bash
   curl http://localhost:3000/api/menuitems
   ```
4. Create a test menuitem via API:
   ```bash
   curl -X POST http://localhost:3000/api/menuitems \
     -H "Content-Type: application/json" \
     -d '{"name":"Test MenuItem","price":5.99}'
   ```

---

### 8. Error: "Proxy error: Could not proxy request /api/menuitems to http://localhost:3000"

**Problem:** Vite proxy configuration issue or backend not running.

**Solution:**
1. Verify `apps/web/vite.config.js` has proxy configuration:
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:3000',
         changeOrigin: true,
       },
     },
   },
   ```
2. Restart the frontend dev server after changing vite.config.js
3. Make sure backend is running on port 3000

---

### 9. Error: "useSelector is not a function" or "useDispatch is not a function"

**Problem:** React-Redux hooks are not imported correctly.

**Solution:**
1. Verify imports in your component:
   ```javascript
   import { useSelector, useDispatch } from 'react-redux';
   ```
2. Check that react-redux is installed:
   ```bash
   cd apps/web
   npm list react-redux
   ```
3. If not installed:
   ```bash
   npm install react-redux
   ```

---

### 10. Error: "Cannot read properties of null (reading 'getElementById')"

**Problem:** HTML file doesn't have the root element or script loads before DOM.

**Solution:**
1. Verify `apps/web/index.html` has:
   ```html
   <div id="root"></div>
   <script type="module" src="/src/main.jsx"></script>
   ```
2. Check that main.jsx is trying to mount to 'root':
   ```javascript
   document.getElementById('root')
   ```

---

### 11. Backend starts but frontend can't connect

**Problem:** Port mismatch or firewall blocking.

**Solution:**
1. Verify backend port in `apps/backend/index.js`:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```
2. Check if port 3000 is already in use:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```
3. If port is in use, either:
   - Stop the other process using port 3000
   - Change backend port and update frontend config

---

## Quick Diagnostic Checklist

When troubleshooting, check these in order:

- [ ] Backend is running (`http://localhost:3000/` works)
- [ ] CORS is configured in backend (`app.use(cors())`)
- [ ] Frontend dev server is running
- [ ] No console errors in browser (F12)
- [ ] Network requests show in browser DevTools → Network tab
- [ ] Redux store is properly configured
- [ ] All imports are correct (case-sensitive)
- [ ] Dependencies are installed (`npm install` in both apps/web and apps/backend)

---

## Getting Help

If you're still experiencing issues:

1. **Check the browser console** (F12) for error messages
2. **Check the Network tab** to see if API requests are being made
3. **Check backend console** for server-side errors
4. **Verify both servers are running:**
   - Backend: `cd apps/backend && npm run dev`
   - Frontend: `cd apps/web && npm run dev`

---

## Common Fixes Summary

| Error | Quick Fix |
|-------|-----------|
| PostCSS config error | Add `"type": "module"` to package.json and fix postcss.config.js |
| CORS error | Add `app.use(cors())` to backend and restart |
| Failed to fetch | Start backend server on port 3000 |
| Module not found | Check file paths and restart dev server |
| Redux errors | Verify Provider wraps App in main.jsx |
| Proxy error | Check vite.config.js and restart frontend |
| Empty menuitems | Backend returns `[]` - create menuitems via API |

---

## Testing Your Setup

### Test Backend:
```bash
# Should return: Taste of Aloha backend is running 🌺
curl http://localhost:3000/

# Should return: [] (empty array)
curl http://localhost:3000/api/menuitems
```

### Test Frontend:
1. Open `http://localhost:5173` (or your Vite port)
2. Open browser DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for API requests
5. Navigate to Menu page - should show "No menuitems available" or list of menuitems

---

## Still Having Issues?

1. **Restart both servers:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend: `cd apps/backend && npm run dev`
   - Start frontend: `cd apps/web && npm run dev`

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Reinstall dependencies:**
   ```bash
   cd apps/backend && rm -rf node_modules && npm install
   cd ../web && rm -rf node_modules && npm install
   ```

