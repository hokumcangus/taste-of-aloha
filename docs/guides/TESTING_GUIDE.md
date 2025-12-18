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

### All Tests (Root)
```bash
# From project root (runs all tests)
npm test
```

### Backend Tests Only
```bash
cd apps/backend

# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run in watch mode (re-run on file changes)
npm run test:watch

# Run specific test file
npm test -- snackApi.test.js
```

### Frontend Tests Only
```bash
cd apps/web

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run with UI (interactive)
npm run test:ui

# Run in watch mode
npm test -- --watch
```

---

## Test Coverage

### Backend Test Coverage

**Current Coverage**: 83%+ overall

```bash
cd apps/backend
npm test -- --coverage
```

**What's Tested:**
- ✅ GET all snacks
- ✅ GET snack by ID
- ✅ POST create new snack
- ✅ PUT update snack
- ✅ DELETE snack
- ✅ 404 error handling
- ✅ 500 error handling
- ✅ Database error scenarios

**Test File:** `apps/backend/tests/snackApi.test.js`

### Frontend Test Coverage

**Current Tests**: 7 passing tests

```bash
cd apps/web
npm run test:coverage
```

**What's Tested:**
- ✅ Component renders loading state
- ✅ Component displays snacks from API
- ✅ Component handles empty state
- ✅ Component handles error state
- ✅ Redux state management (pending/fulfilled)
- ✅ Create snack action
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
│   │   ├── snackApi.test.js      # API endpoint tests
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
3. **Use descriptive test names** - "should return 404 when snack not found"
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
      - run: npm install
      - run: cd apps/backend && npm test
      - run: cd apps/web && npm test
```

---

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm test -- --coverage` | Run with coverage report |
| `npm test -- --watch` | Run in watch mode |
| `npm test -- myfile.test.js` | Run specific test file |
| `npm run test:ui` | Run with interactive UI (frontend only) |

---

## Debugging Tests

### Backend Tests
```bash
# Run with verbose output
npm test -- --verbose

# Run single test
npm test -- --testNamePattern="should return all snacks"

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
npm test -- --grep="should display snacks"
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
