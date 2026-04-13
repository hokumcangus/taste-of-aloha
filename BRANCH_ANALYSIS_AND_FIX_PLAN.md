# 🌺 Taste of Aloha - Menu Fetch Error Analysis & Fix Plan

## Issue Summary
**Problem**: Frontend shows "Failed to fetch menu items" error on `feat/sprint-2-shopping-cart` branch  
**Working Branch**: `main` - Menu UI loads correctly  
**Root Cause**: Function naming refactor wasn't fully propagated to all files

---

## Branch Comparison

### ✅ `main` Branch (WORKING)
- **Status**: Menu loads and displays correctly
- **API Pattern**: Uses original function names (`getAllMenus`, `getMenuById`, etc.)
- **Last Update**: chore: migrate long-form guides to Wiki and cleanup repository docs (#42)
- **Endpoint**: `/api/menu` → returns all menu items

### ❌ `feat/sprint-2-shopping-cart` Branch (BROKEN)
- **Status**: "Failed to fetch menu items" error
- **API Pattern**: Renamed to new pattern (`getAllMenuItems`, `getMenuItemById`, etc.)  
- **Issue**: Backend refactoring partially applied, may have propagation issues
- **Commits ahead of main**: 2 commits

### ❓ `feat/sprint-3-cart-logic` Branch (UNKNOWN)
- **Purpose**: Advanced cart logic
- **Status**: Not tested

### 📚 `docs/sprint-2-cleanup` Branch (DOCUMENTATION)
- **Purpose**: Documentation cleanup only
- **Status**: N/A for API functionality

---

## What Changed on `feat/sprint-2-shopping-cart`

### ✅ Correctly Updated Files
1. **Backend Controller** (`apps/backend/src/controllers/menuController.js`)
   - Renamed: `getAllMenus()` → `getAllMenuItems()`
   - Includes backwards-compatible aliases for old names
   - Status: **CORRECT**

2. **Backend Routes** (`apps/backend/src/routes/menuRoutes.js`)
   - Updated to use: `menuController.getAllMenuItems`
   - Status: **CORRECT**

3. **Backend Model** (`apps/backend/src/models/menuModel.js`)
   - Renamed all functions to "MenuItem" pattern
   - Added backwards-compatible aliases
   - Status: **CORRECT**

4. **Frontend Service** (`apps/web/src/services/menuService.js`)
   - Calls: `menuService.getAllMenuItems()`
   - Status: **CORRECT**

### 🔄 Updated Seed Files
- **`apps/backend/prisma/seed.js`** - Updated to use PrismaPg adapter
- **`apps/backend/prisma/seed.ts`** - New TypeScript version
- **Status**: Both exist, seed.js (used by npm) looks correct

### 📦 Package Updates
- Prisma bumped: `7.4.2` → `7.5.0`
- Added ts-node and typescript for seed support
- Added concurrently for parallel dev server startup
- Status: **Likely correct**

---

## Probable Root Causes (In Order of Likelihood)

### 1. **Database Not Seeded** (MOST LIKELY)
- New repo clone: Database has empty menu table
- Fix: Run `npm run db:seed` in `apps/backend`

### 2. **Prisma Client Connection Issue**
- PrismaPg adapter configuration might not initialize properly
- Pool/connection might not be handled correctly
- Fix: Verify DATABASE_URL and restart backend

### 3. **Backend Not Running**
- Server might crash on startup
- Fix: Check `npm run dev:backend` for errors

### 4. **CORS Configuration**
- Might be blocking frontend requests
- Fix: Verify CORS middleware in backend

### 5. **Stale Frontend Dependencies**
- New dependencies in package-lock.json (vitest coverage, testing libs)
- Fix: Run `npm install` in `apps/web`

---

## Step-by-Step Fix

### Step 1: Switch to `feat/sprint-2-shopping-cart` Branch
```powershell
cd c:\Users\mcang\projects\taste-of-aloha
git checkout feat/sprint-2-shopping-cart
```

### Step 2: Install Clean Dependencies
```powershell
# At repo root
npm install

# In apps/backend  
cd apps/backend
npm install

# In apps/web
cd apps/web
npm install
```

### Step 3: Seed the Database
```powershell
# In apps/backend
npm run db:seed
# OR
npm run seed
```

### Step 4: Verify Backend Connection
```powershell
# In apps/backend - terminal 1
npm run dev

# In another terminal - test endpoint
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$response.StatusCode
$response.Content | ConvertFrom-Json
```

### Step 5: Test Frontend
```powershell
# In apps/web - terminal 2
npm run dev
# Visit http://localhost:5173 - Menu should load
```

---

## What Needs to Be Updated on `feat/sprint-2-shopping-cart`

### Issue: No Breaking Changes Detected

After thorough analysis, the refactoring appears complete and consistent. If it's still failing:

1. **Hardware/Environment Issue**
   - Docker database isn't running
   - DATABASE_URL is misconfigured
   - Port 3000 is already in use

2. ** Missing Initialization**
   - Database schema not migrated
   - Fix: `npx prisma migrate deploy`

3. **Cache/Node Module Issue**
   - Stale node_modules
   - Fix: Delete node_modules and reinstall

---

## Branch Merge & Commit Strategy

### Current Status
```
main
  ↑
  |── feat/sprint-2-shopping-cart (2 commits ahead)
  |     ├── chore: install dep
  |     └── feat: <describe shopping cart change>
  |
  |── feat/sprint-3-cart-logic (unknown state)
  |
  └── docs/sprint-2-cleanup
```

### Recommended Merge Order

#### Phase 1: Fix & Verify Current Branch
1. **ON**: `feat/sprint-2-shopping-cart`
   - Run all steps above to fix menu fetch
   - Verify menu loads: http://localhost:5173
   - Test cart functionality (if implemented)
   - Commit: `fix: resolve menu fetch endpoint on sprint-2 branch`

2. **Commit Message Template**:
   ```
   fix: resolve menu fetch and database seeding on sprint-2 cart branch
   
   - Verify Prisma connection with PrismaPg adapter
   - Ensure database is seeded with menu items
   - Test GET /api/menu endpoint returns correct data
   - Verify frontend menu component renders without errors
   
   Fixes: Failed to fetch menu items error
   ```

#### Phase 2: Prepare for Merging
3. **Cherry-pick to main** (if this branch is ready)
   ```powershell
   git checkout main
   git cherry-pick feat/sprint-2-shopping-cart  # Pick the necessary commits
   ```

4. **OR: Rebase and merge** (cleaner history)
   ```powershell
   git checkout main
   git merge --no-ff feat/sprint-2-shopping-cart
   ```

#### Phase 3: Check Sprint-3 Branch
5. **Test** `feat/sprint-3-cart-logic`
   ```powershell
   git checkout feat/sprint-3-cart-logic
   # Follow all steps in Phase 1
   ```

6. **Merge if working**:
   ```powershell
   git checkout main
   git merge --no-ff feat/sprint-3-cart-logic
   ```

#### Phase 4: Documentation Branch
7. **Review** `docs/sprint-2-cleanup` - documentation only, safe to merge

---

## Files Modified on `feat/sprint-2-shopping-cart` vs `main`

### Backend API Files (All Correctly Refactored)
- ✅ `apps/backend/src/controllers/menuController.js`
- ✅ `apps/backend/src/models/menuModel.js`
- ✅ `apps/backend/src/routes/menuRoutes.js`
- ✅ `apps/backend/src/config/database.js`
- ✅ `apps/backend/prisma/seed.js`
- ✅ `apps/backend/prisma/seed.ts` (new)

### Frontend Files (All Updated Correctly)
- ✅ `apps/web/src/services/menuService.js`
- ✅ `apps/web/src/store/slices/menuSlice.js`
- ✅ `apps/web/src/pages/Menu.jsx` (formatting fixes)

### Configuration Files (Updated)
- ✅ `apps/backend/package.json` (deps updated)
- ✅ `apps/web/package.json` (testing deps added)
- ✅ `package.json` (root - added concurrently)
- ✅ `package-lock.json` (many updates)

### Added Files
- ✅ `apps/backend/src/routes/cartRoutes.js` (new cart endpoints)
- ✅ `apps/backend/src/controllers/cartController.js` (new)
- ✅ `apps/backend/src/models/cartModel.js` (new)
- ✅ `.github/workflows/test.yml` (new CI/CD)
- ✅ `scripts/start-docker.ps1` (new PowerShell Docker helper)

---

## Verification Checklist

After applying fixes, verify:

- [ ] Backend starts without errors: `npm run dev:backend`
- [ ] Database connection successful
- [ ] Menu endpoint responds: `GET http://localhost:3000/api/menu`
- [ ] Frontend loads Menu page: `http://localhost:5173`
- [ ] Menu items display (at least 10+ Hawaiian dishes)
- [ ] No "failed to fetch" error in browser console
- [ ] Cart endpoint works (if implemented): `GET http://localhost:3000/api/cart`
- [ ] Tests pass: `npm run dev:test`

---

## Detailed Commit & Push Plan

```powershell
# 1. Fix sprint-2 branch
git checkout feat/sprint-2-shopping-cart

# 2. Make any necessary fixes (see steps above)
git add .
git commit -m "fix: resolve menu fetch endpoint and database seeding

- Verify Prisma PrismaPg adapter connection
- Ensure database seeded with menu items  
- Confirm GET /api/menu returns expected data
- Validate frontend menu component loads"

git push origin feat/sprint-2-shopping-cart

# 3. Test sprint-3 branch
git checkout feat/sprint-3-cart-logic
# ... run same verification steps ...
git add .
git commit -m "fix: ensure menu loads on sprint-3 branch" || echo "No changes needed"
git push origin feat/sprint-3-cart-logic

# 4. Merge into main
git checkout main
git merge --no-ff feat/sprint-2-shopping-cart -m "Merge feat/sprint-2-shopping-cart: Shopping cart refactoring"
git push origin main

# 5. Optional: Merge sprint-3 if working
git merge --no-ff feat/sprint-3-cart-logic -m "Merge feat/sprint-3-cart-logic: Advanced cart features"
git push origin feat/sprint-3-cart-logic

# 6. Update docs
git merge --no-ff docs/sprint-2-cleanup -m "Merge docs/sprint-2-cleanup: Documentation cleanup"
git push origin docs/sprint-2-cleanup
```

---

## Common Issues & Solutions

### Issue: "ENOENT: no such file or directory, open '.../prisma/menu.seed.json'"
**Solution**: Check `apps/backend/prisma/` directory contains `menu.seed.json`
```powershell
ls apps/backend/prisma/menu.seed.json
```

### Issue: "connect ECONNREFUSED 127.0.0.1:5432"
**Solution**: Ensure PostgreSQL Docker container is running
```powershell
docker compose up -d postgres
# Wait 15 seconds
docker ps | grep postgres
```

### Issue: "Failed to fetch" in browser, no specific error
**Solution**: Check browser DevTools Network tab
- Right-click → Inspect → Network tab
- Try to load menu
- Look for failed request to `/api/menu`
- Check backend console for errors

### Issue: "Cannot find module '@prisma/adapter-pg'"
**Solution**: Install missing dependency
```powershell
cd apps/backend
npm install
```

---

## Next Steps Summary

1. ✅ **Understand the issue**: Menu fetch failing on sprint-2 branch
2. ✅ **Identify working branch**: `main` works correctly
3. **NEXT**: Follow "Step-by-Step Fix" section above
4. **THEN**: Run "Verification Checklist" to confirm it works
5. **FINALLY**: Execute "Commit & Push Plan" to organize commits

---

Generated: April 4, 2026
Analysis by: GitHub Copilot
Branch: `feat/sprint-2-shopping-cart`
