# Known Issues and Future Improvements

This document tracks known issues in the consolidated codebase that should be addressed in future PRs.

## Issues Identified in Code Review

### 1. Inconsistent Logging (Low Priority)
**File:** `apps/backend/src/controllers/menuController.js:13`
**Issue:** Using `console.error` directly instead of structured logger
**Impact:** Low - logging still works
**Recommendation:** Create a proper error logging utility and use consistently across the app
```javascript
// Current:
console.error('Error fetching menus:', error);

// Recommended:
// Create src/utils/errorLogger.js and use:
errorLogger.error('Error fetching menus:', error);
```

### 2. Price Update Bug (Medium Priority)
**File:** `apps/backend/src/models/snackModel.js:33`
**Issue:** Cannot update snack price to $0.00 due to truthy check
**Impact:** Medium - prevents setting free items
**Fix:**
```javascript
// Current:
price: updatedSnack.price ? Number(updatedSnack.price) : undefined

// Should be:
price: updatedSnack.price !== undefined ? Number(updatedSnack.price) : undefined
```

### 3. SQL Schema Mismatch (Medium Priority)
**File:** `infra/init-db/01-init.sql`
**Issue:** SQL creates `snacks` table but Prisma uses `menu` table
**Impact:** Medium - potential confusion, but Prisma manages schema
**Recommendation:** Align SQL init script with Prisma schema or remove if Prisma handles all migrations

### 4. Test Mock Path Mismatch (Low Priority)
**File:** `apps/web/src/test/Menu.test.jsx:9-10`
**Issue:** Mock path doesn't match actual service file location
**Impact:** Low - tests may not mock correctly
**Fix:** Ensure mock paths match actual import paths

## Recommendations for Future PRs

1. **Logging Infrastructure** (Priority: Medium)
   - Create unified error logging utility
   - Add log levels (debug, info, warn, error)
   - Consider using Winston or Pino

2. **Schema Alignment** (Priority: Medium)
   - Choose either SQL migrations or Prisma migrations
   - Remove redundant schema definitions
   - Document migration strategy

3. **Test Infrastructure** (Priority: High)
   - Fix test mocks to match actual file structure
   - Add integration tests for API endpoints
   - Add E2E tests for critical user flows

4. **Bug Fixes** (Priority: High)
   - Fix price update issue to allow $0.00 values
   - Add validation for price ranges
   - Add unit tests for edge cases

## Notes

These issues were present in the tested working branch (`copilot/connect-frontend-backend-db`) and don't prevent the application from functioning. They should be addressed incrementally in future PRs to improve code quality and maintainability.

**Created:** January 3, 2026  
**Status:** Tracked for future resolution
