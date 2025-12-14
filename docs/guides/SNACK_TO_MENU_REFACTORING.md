# Menu → Menu Refactoring Guide

**Status**: In Progress - Update all "Menu" references to "menu" items across the codebase

This guide will help you systematically rename and update all Menu-related files and code to use "menu" terminology instead.

---

## Why This Change?

The project is a food delivery service with diverse menu items (not just Menus). Using "menu" is more accurate and professional.

**Old**: MenuController.js, MenuModel.js, MenuRoutes.js, `/api/Menus`
**New**: menuController.js, menuModel.js, menuRoutes.js, `/api/menu`

---

## Files to Rename

### Backend Files

#### Step 1: Rename Model File
```powershell
# From: apps/backend/src/models/MenuModel.js
# To: apps/backend/src/models/menuModel.js

Rename-Item -Path "apps/backend/src/models/MenuModel.js" -NewName "menuModel.js"
```

**Update inside the file:**
- Function names: `getAllMenus()` → `getAllMenuItems()`
- Function names: `getMenuById()` → `getMenuItemById()`
- Function names: `createMenu()` → `createMenuItem()`
- Function names: `updateMenu()` → `updateMenuItem()`
- Function names: `deleteMenu()` → `deleteMenuItem()`

#### Step 2: Rename Controller File
```powershell
Rename-Item -Path "apps/backend/src/controllers/MenuController.js" -NewName "menuController.js"
```

**Update inside the file:**
- Change import: `const MenuModel = require(...)` → `const menuModel = require(...)`
- Change all function names (same as above)
- Change all variable names: `Menu` → `menuItem`, `Menus` → `menuItems`
- Update error messages

#### Step 3: Rename Routes File
```powershell
Rename-Item -Path "apps/backend/src/routes/MenuRoutes.js" -NewName "menuRoutes.js"
```

**Update inside the file:**
- Change import: `const MenuController = require(...)` → `const menuController = require(...)`
- Change all references: `MenuController.*` → `menuController.*`

#### Step 4: Update Main Server File
**File: `apps/backend/index.js`**

```javascript
// BEFORE
const MenuRoutes = require('./src/routes/MenuRoutes');
app.use('/api/Menus', MenuRoutes);

// AFTER
const menuRoutes = require('./src/routes/menuRoutes');
app.use('/api/menu', menuRoutes);
```

### Frontend Files

#### Step 5: Rename Service File
```powershell
Rename-Item -Path "apps/web/src/services/MenuService.js" -NewName "menuService.js"
```

**Update inside:**
- Change all `Menu` references to `menu`
- Update API endpoint: `/api/Menus` → `/api/menu`

#### Step 6: Rename Redux Slice File
```powershell
Rename-Item -Path "apps/web/src/store/slices/MenuSlice.js" -NewName "menuSlice.js"
```

**Update inside:**
- Change all `Menu` references to `menu`
- Change all reducer names and actions
- Update imports in store configuration

#### Step 7: Update Redux Store Configuration
**File: `apps/web/src/store/store.js`**

```javascript
// BEFORE
import MenuSlice from './slices/MenuSlice';
export default configureStore({
  reducer: {
    Menus: MenuSlice,
    ...
  }
});

// AFTER
import menuSlice from './slices/menuSlice';
export default configureStore({
  reducer: {
    menu: menuSlice,
    ...
  }
});
```

#### Step 8: Update API Configuration
**File: `apps/web/src/config/api.js`** (if exists)

```javascript
// BEFORE
export const MenuS_API = 'http://localhost:5001/api/Menus';

// AFTER
export const MENU_API = 'http://localhost:5001/api/menu';
```

#### Step 9: Update Components Using Menus
**Any files importing/using Menus:**

```javascript
// BEFORE
import { useSelector } from 'react-redux';
const Menus = useSelector(state => state.Menus.items);

// AFTER
import { useSelector } from 'react-redux';
const menuItems = useSelector(state => state.menu.items);
```

---

## Documentation Files to Update

### Update BACKEND_API_GUIDE.md
Already started - need to finish all function references:
- All code examples showing Menu functions
- All API endpoint examples
- All curl commands

### Update BACKEND_API_CHECKLIST.md
- All file names and references
- All API endpoint paths
- All function names

### Update README.md
- API endpoint references: `/api/Menus` → `/api/menu`
- Any mentions of "Menus" in examples

### Update TROUBLESHOOTING.md
- All curl command examples
- All API endpoint references
- Error messages mentioning "Menus"

---

## Step-by-Step Rename Commands

Run these commands in PowerShell from project root:

```powershell
# Backend Files
Rename-Item -Path "apps/backend/src/models/MenuModel.js" -NewName "menuModel.js"
Rename-Item -Path "apps/backend/src/controllers/MenuController.js" -NewName "menuController.js"
Rename-Item -Path "apps/backend/src/routes/MenuRoutes.js" -NewName "menuRoutes.js"

# Frontend Files
Rename-Item -Path "apps/web/src/services/MenuService.js" -NewName "menuService.js"
Rename-Item -Path "apps/web/src/store/slices/MenuSlice.js" -NewName "menuSlice.js"

# Verify
Get-ChildItem -Recurse -Include "*Menu*"  # Should return nothing if complete
```

---

## Code Updates Checklist

### Backend Code Files

#### menuModel.js
- [ ] Rename file ✓
- [ ] Update export object with new function names
- [ ] `getAllMenus()` → `getAllMenuItems()`
- [ ] `getMenuById()` → `getMenuItemById()`
- [ ] `createMenu()` → `createMenuItem()`
- [ ] `updateMenu()` → `updateMenuItem()`
- [ ] `deleteMenu()` → `deleteMenuItem()`

#### menuController.js
- [ ] Rename file ✓
- [ ] Update import: `MenuModel` → `menuModel`
- [ ] Update all function names
- [ ] Update all variable names: `Menu` → `menuItem`, `Menus` → `menuItems`
- [ ] Update all error messages
- [ ] Update status messages

#### menuRoutes.js
- [ ] Rename file ✓
- [ ] Update import: `MenuController` → `menuController`
- [ ] Update all router calls: `MenuController.*` → `menuController.*`

#### index.js
- [ ] Update import: `MenuRoutes` → `menuRoutes`
- [ ] Update route: `app.use('/api/Menus', ...)` → `app.use('/api/menu', ...)`

### Frontend Code Files

#### menuService.js
- [ ] Rename file ✓
- [ ] Update all `Menu` references to `menu`
- [ ] Update API endpoint: `/api/Menus` → `/api/menu`
- [ ] Update function names if needed

#### menuSlice.js
- [ ] Rename file ✓
- [ ] Update all `Menu` references to `menu`
- [ ] Update reducer names
- [ ] Update action names
- [ ] Update initial state

#### store.js
- [ ] Update import: `MenuSlice` → `menuSlice`
- [ ] Update reducer: `Menus: MenuSlice` → `menu: menuSlice`

#### All Components Using Menu Data
- [ ] Search for uses of `Menu` state
- [ ] Update selectors: `state.Menus` → `state.menu`
- [ ] Update variable names throughout

### Documentation Updates

- [ ] BACKEND_API_GUIDE.md - All code examples
- [ ] BACKEND_API_CHECKLIST.md - All references
- [ ] README.md - API endpoint examples
- [ ] TROUBLESHOOTING.md - Curl commands and examples
- [ ] LEARNING_GUIDE.md - Any Menu references

---

## Testing After Rename

```powershell
# 1. Start backend
cd apps/backend
npm run dev

# 2. Test new endpoint
curl http://localhost:5001/api/menu

# 3. Start frontend
cd apps/web
npm run dev

# 4. Check browser console - no import errors
# 5. Check menu loads on page
```

---

## Git Commit

After completing all changes:

```powershell
git add -A
git commit -m "refactor: rename Menu references to menu throughout codebase

- Renamed files: MenuModel -> menuModel, MenuController -> menuController, etc.
- Updated API endpoints: /api/Menus -> /api/menu
- Updated function names: getAllMenus -> getAllMenuItems, etc.
- Updated frontend Redux store: Menus -> menu
- Updated documentation with new naming convention"
git push
```

---

## Troubleshooting During Rename

**Error: Cannot find module '../models/MenuModel'**
→ You forgot to update the require/import statement. Change it to `menuModel`.

**Error: MenuController is not defined**
→ Update the import in menuRoutes.js to import menuController instead.

**Frontend doesn't load menu data**
→ Check that menuSlice is imported in store.js and the reducer name is updated.

**API returns 404 on /api/menu**
→ Make sure index.js has `app.use('/api/menu', menuRoutes)` not MenuRoutes.

---

## Files with Menu References (Found)

These files mention "Menu" and may need updates:

1. ✅ `docs/guides/BACKEND_API_GUIDE.md` - Started
2. ✅ `docs/reference/BACKEND_API_CHECKLIST.md` - Needs complete update
3. ✅ `README.md` - Line 113, 277
4. ✅ `docs/guides/TROUBLESHOOTING.md` - Multiple examples
5. `apps/backend/src/models/MenuModel.js` - **Will rename**
6. `apps/backend/src/controllers/MenuController.js` - **Will rename**
7. `apps/backend/src/routes/MenuRoutes.js` - **Will rename**
8. `apps/web/src/services/MenuService.js` - **Will rename**
9. `apps/web/src/store/slices/MenuSlice.js` - **Will rename**

---

## Summary

This is a **comprehensive refactor** that touches:
- 5 file renames (3 backend, 2 frontend)
- 10+ code files with imports/references
- 5+ documentation files
- 50+ individual function/variable name updates

**Estimated time**: 30-45 minutes following this checklist

**Best approach**:
1. Rename files first (using PowerShell)
2. Fix imports in importing files
3. Update function names in renamed files
4. Test backend and frontend
5. Update documentation
6. Commit to git

Good luck! Let me know if you need help with any specific file.
