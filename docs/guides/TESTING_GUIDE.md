# Testing Guide 🧪

Complete testing guide for Taste of Aloha application covering backend API tests and frontend component tests.

---

## Overview

This project uses:
- **Backend**: Jest + Supertest for API testing
- **Frontend**: Vitest + React Testing Library for component testing

All tests are fully integrated and ready to run!

---

## Running Tests

### From Repo Root
```bash
# Run backend tests once
npm --workspace apps/backend run test

# Run frontend tests once
npm --workspace apps/web run test

# Run both coverage suites
npm run test:coverage
```

### Backend Tests Only
```bash
cd apps/backend

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (re-run on file changes)
npm run test:watch
```

### Frontend Tests Only
```bash
cd apps/web

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI (interactive)
npm run test:ui
```

---

## Test Coverage

### Backend Test Coverage

**Latest verified run:** 10 passing tests

```bash
cd apps/backend
npm run test:coverage
```

**What's Tested:**
- ✅ GET all menu items
- ✅ GET menu item by ID
- ✅ POST create new menu item
- ✅ PUT update menu item
- ✅ DELETE menu item
- ✅ 404 error handling
- ✅ 500 error handling
- ✅ Database error scenarios

**Test File:** `apps/backend/tests/menuApi.test.js`

### Frontend Test Coverage

**Latest verified run:** 7 passing tests

```bash
cd apps/web
npm run test:coverage
```

**What's Tested:**
- ✅ Component renders loading state
- ✅ Component displays menu items from API
- ✅ Component handles empty state
- ✅ Component handles error state
- ✅ Redux state management (pending/fulfilled)
- ✅ Create menu item action
- ✅ Update Redux store correctly

**Test File:** `apps/web/src/test/Menu.test.jsx`

---

## Writing Tests

### Backend API Test Example

```javascript
// apps/backend/tests/myApi.test.js
const request = require('supertest');
const express = require('express');
const myRoutes = require('../src/routes/myRoutes');

// Mock the database
jest.mock('../src/config/database');
const db = require('../src/config/database');

const app = express();
app.use(express.json());
app.use('/api/my-endpoint', myRoutes);

describe('My API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return data', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    db.query.mockResolvedValue({ rows: mockData });

    const response = await request(app).get('/api/my-endpoint');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });
});
```

### Frontend Component Test Example

```javascript
// apps/web/src/test/MyComponent.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import myReducer from '../store/slices/mySlice';
import MyComponent from '../pages/MyComponent';

// Mock the service
vi.mock('../services/myService', () => ({
  myService: {
    getData: vi.fn(),
  },
}));

import { myService } from '../services/myService';

describe('MyComponent', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { myData: myReducer },
    });
    vi.clearAllMocks();
  });

  it('should display data when loaded', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }];
    myService.getData.mockResolvedValue(mockData);

    render(
      <Provider store={store}>
        <MyComponent />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });
});
```

---

## Test File Structure

```
apps/
├── backend/
│   ├── tests/
│   │   ├── menuApi.test.js      # API endpoint tests
│   │   └── ...                    # Add more test files here
│   ├── jest.config.js             # Jest configuration
│   └── package.json               # Test scripts defined here
│
└── web/
    ├── src/
    │   └── test/
    │       ├── setup.js           # Test setup file
    │       ├── Menu.test.jsx      # Component tests
    │       └── ...                 # Add more test files here
    ├── vitest.config.js           # Vitest configuration
    └── package.json               # Test scripts defined here
```

---

## Test Best Practices

### Backend Tests
1. **Mock the database** - Never hit the real database in tests
2. **Test happy paths AND error cases** - Both success and failure scenarios
3. **Use descriptive test names** - "should return 404 when menuitem not found"
4. **Clear mocks between tests** - Use `beforeEach(() => jest.clearAllMocks())`
5. **Test status codes AND response bodies** - Verify complete response

### Frontend Tests
1. **Test user-visible behavior** - Not implementation details
2. **Use Testing Library queries** - `getByText`, `getByRole`, etc.
3. **Wait for async operations** - Use `waitFor` for API calls
4. **Mock external dependencies** - Services, APIs, etc.
5. **Test error states** - Loading, error, empty states

---

## Continuous Integration

Tests run automatically on every push/PR via GitHub Actions (if configured).

To set up CI:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm --workspace apps/backend run test
      - run: npm --workspace apps/web run test
```

---

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm --workspace apps/backend run test` | Run backend tests once |
| `npm --workspace apps/web run test` | Run frontend tests once |
| `npm run test:coverage` | Run coverage for both apps |
| `npm run test:watch` | Run watch mode inside the current app |
| `npm run test:ui` | Run Vitest UI in `apps/web` |

---

## Debugging Tests

### Backend Tests
```bash
# Run with verbose output
npm test -- --verbose

# Run single test
npm test -- --testNamePattern="should return all menu items"

# Debug with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend Tests
```bash
# Run with UI for debugging
npm run test:ui

# Debug in browser
# Tests will open in browser with interactive interface

# Run single test
npm run test:watch -- --grep="should display menu items"
```

---

## Common Issues

### "Cannot find module" in tests
```bash
# Clear Jest cache
cd apps/backend && npx jest --clearCache

# Reinstall dependencies
npm install
```

### Frontend tests timeout
```javascript
// Increase timeout in test file
it('should load data', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Mock not working
```javascript
// Ensure mock is at the top of file
jest.mock('../path/to/module');

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

---

## Next Steps

1. Add more test coverage for new features
2. Set up pre-commit hooks to run tests
3. Add integration tests
4. Add E2E tests with Playwright/Cypress

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

---

**Happy Testing! 🧪**

## Connectivity Verification Commands (PowerShell)

```powershell
# From repo root
npm run dev

# In a separate terminal
(Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing).StatusCode

$menuResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/menu" -UseBasicParsing
$menuItems = $menuResponse.Content | ConvertFrom-Json
"menu-status=$($menuResponse.StatusCode) menu-count=$($menuItems.Count)"

$cartResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/cart" -UseBasicParsing
$cartItems = $cartResponse.Content | ConvertFrom-Json
"cart-status=$($cartResponse.StatusCode) cart-count=$($cartItems.Count)"

(Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing).StatusCode
```
