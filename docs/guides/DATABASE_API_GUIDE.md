# Database & API Connection Guide 🌺

## Overview
This guide explains how the Taste of Aloha application connects the database, backend, and frontend, and how to work with the API endpoints.

---

## Architecture Overview

```
Frontend (React + Redux)
    ↓ HTTP Requests
Backend (Express API)
    ↓ SQL Queries
Database (PostgreSQL)
```

---

## Database Setup

### 1. Database Schema

The database is automatically initialized when you start Docker Compose. The schema is located in:
```
infra/init-db/01-init.sql
```

**Main Table: `snacks`**
- `id` - Serial primary key (auto-incrementing)
- `name` - Snack name (required)
- `description` - Snack description
- `price` - Price in dollars (required)
- `image_url` - URL to snack image
- `category` - Category (e.g., 'snack', 'meal', 'dessert')
- `available` - Boolean availability flag
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated (auto-updated)

### 2. Database Connection

The database connection is configured in `apps/backend/src/config/database.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

**Environment Variables** (in `.env`):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taste_of_aloha
```

For Docker, the connection string uses the container name:
```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taste_of_aloha
```

---

## Backend API Structure

### File Organization

```
apps/backend/
├── src/
│   ├── config/
│   │   └── database.js         # Database connection pool
│   ├── models/
│   │   └── snackModel.js       # Database queries
│   ├── controllers/
│   │   └── snackController.js  # Business logic
│   └── routes/
│       └── snackRoutes.js      # API endpoints
├── tests/
│   └── snackApi.test.js        # API tests
└── index.js                     # Server entry point
```

### API Endpoints

Base URL: `http://localhost:3000`

#### 1. Get All Snacks
```
GET /api/snacks
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Spam Musubi",
    "description": "Hawaiian classic with grilled spam on rice",
    "price": 4.99,
    "category": "snack",
    "available": true
  }
]
```

#### 2. Get Snack by ID
```
GET /api/snacks/:id
```

**Example:**
```bash
curl http://localhost:3000/api/snacks/1
```

#### 3. Create New Snack
```
POST /api/snacks
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Malasada",
  "description": "Portuguese-style fried dough",
  "price": 3.50,
  "category": "dessert"
}
```

**Example with curl:**
```bash
curl -X POST http://localhost:3000/api/snacks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Malasada",
    "description": "Portuguese-style fried dough",
    "price": 3.50,
    "category": "dessert"
  }'
```

**Example Response:**
```json
{
  "id": 6,
  "name": "Malasada",
  "description": "Portuguese-style fried dough",
  "price": 3.50,
  "category": "dessert",
  "available": true,
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

#### 4. Update Snack
```
PUT /api/snacks/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "price": 5.99
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/snacks/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 5.99}'
```

#### 5. Delete Snack
```
DELETE /api/snacks/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/snacks/1
```

---

## Frontend Connection

### File Organization

```
apps/web/
├── src/
│   ├── config/
│   │   └── api.js              # API base URL config
│   ├── services/
│   │   ├── api.js              # HTTP client
│   │   └── snackService.js     # Snack API methods
│   ├── store/
│   │   ├── store.js            # Redux store
│   │   └── slices/
│   │       └── snackSlice.js   # Snack state management
│   ├── pages/
│   │   └── Menu.jsx            # Menu component
│   └── test/
│       └── Menu.test.jsx       # Frontend tests
```

### How Frontend Calls Backend

**1. Configuration** (`src/config/api.js`):
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**2. API Client** (`src/services/api.js`):
```javascript
class ApiClient {
  get(endpoint) {
    return fetch(`${this.baseURL}${endpoint}`);
  }
  post(endpoint, data) {
    return fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}
```

**3. Service Layer** (`src/services/snackService.js`):
```javascript
export const snackService = {
  getAllSnacks: () => apiClient.get('/api/snacks'),
  createSnack: (data) => apiClient.post('/api/snacks', data),
};
```

**4. Redux State Management** (`src/store/slices/snackSlice.js`):
```javascript
export const fetchSnacks = createAsyncThunk(
  'snacks/fetchSnacks',
  async () => await snackService.getAllSnacks()
);

export const createSnack = createAsyncThunk(
  'snacks/createSnack',
  async (snackData) => await snackService.createSnack(snackData)
);
```

**5. React Component** (`src/pages/Menu.jsx`):
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchSnacks, createSnack } from '../store/slices/snackSlice';

const Menu = () => {
  const dispatch = useDispatch();
  const { snacks, loading, error } = useSelector((state) => state.snacks);

  useEffect(() => {
    dispatch(fetchSnacks());  // Fetch snacks on component mount
  }, [dispatch]);

  const handleAddSnack = async () => {
    await dispatch(createSnack({
      name: 'New Snack',
      price: 5.99,
      description: 'Delicious!'
    }));
  };
};
```

---

## How It All Works Together

### Flow: Adding a New Item

1. **User clicks "Add Item" button in Frontend**
   ```javascript
   dispatch(createSnack({ name: 'Haupia', price: 5.99 }))
   ```

2. **Redux dispatches async thunk**
   - Sets `loading: true`
   - Calls `snackService.createSnack()`

3. **Service makes HTTP request**
   ```javascript
   POST http://localhost:3000/api/snacks
   Body: { name: 'Haupia', price: 5.99 }
   ```

4. **Backend receives request**
   - Route: `/api/snacks` → `snackController.createSnack()`
   - Controller calls `Snack.create(req.body)`

5. **Model executes SQL**
   ```sql
   INSERT INTO snacks (name, price) VALUES ('Haupia', 5.99) RETURNING *
   ```

6. **Database returns new record**
   ```json
   { id: 6, name: 'Haupia', price: 5.99, created_at: '...' }
   ```

7. **Backend sends response**
   ```
   Status: 201 Created
   Body: { id: 6, name: 'Haupia', ... }
   ```

8. **Frontend receives response**
   - Redux updates state with new snack
   - Component re-renders
   - New item appears in the list!

---

## Running the Application

### Option 1: Docker (Recommended - Full Stack)

```bash
# Start all services (database, backend, frontend)
docker-compose up --build

# Access:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3000
# - Database: localhost:5432
```

**What this does:**
- Creates PostgreSQL database with schema
- Starts backend connected to database
- Starts frontend connected to backend
- All changes sync with hot reload

**Stop services:**
```bash
docker-compose down
```

### Option 2: Local Development

**Terminal 1 - Start Database:**
```bash
docker-compose up postgres
```

**Terminal 2 - Start Backend:**
```bash
cd apps/backend
npm install
npm run dev
```

**Terminal 3 - Start Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

---

## Testing

### Backend Tests

```bash
cd apps/backend

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode (re-run on changes)
npm run test:watch
```

**Test File:** `apps/backend/tests/snackApi.test.js`

Tests cover:
- ✅ GET all snacks
- ✅ GET snack by ID
- ✅ POST create snack
- ✅ PUT update snack
- ✅ DELETE snack
- ✅ Error handling

### Frontend Tests

```bash
cd apps/web

# Install dependencies
npm install

# Run tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

**Test File:** `apps/web/src/test/Menu.test.jsx`

Tests cover:
- ✅ Component renders loading state
- ✅ Displays snacks when loaded
- ✅ Shows error messages
- ✅ Redux state updates
- ✅ Create snack action

---

## Common Issues & Solutions

### Issue 1: "Cannot connect to database"

**Solution:**
```bash
# Check if database is running
docker ps

# If not, start it
docker-compose up postgres

# Verify connection string in .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taste_of_aloha
```

### Issue 2: "CORS error in browser"

**Solution:**
Backend needs to allow frontend origin in `index.js`:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
```

### Issue 3: "Frontend can't reach backend"

**Solution:**
Check `apps/web/.env.example` or environment:
```
VITE_API_URL=http://localhost:3000
```

For Docker:
```
VITE_API_URL=http://backend:3000
```

### Issue 4: Database doesn't have data

**Solution:**
```bash
# Rebuild database with init script
docker-compose down -v  # Remove volumes
docker-compose up --build
```

---

## Adding New Features

### Example: Adding Items (Menu Items)

**1. Create database migration:**
```sql
-- infra/init-db/02-items.sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

**2. Create model:**
```javascript
// apps/backend/src/models/itemModel.js
const db = require('../config/database');

exports.getAll = async () => {
  const result = await db.query('SELECT * FROM items');
  return result.rows;
};

exports.create = async (item) => {
  const { name, price } = item;
  const result = await db.query(
    'INSERT INTO items (name, price) VALUES ($1, $2) RETURNING *',
    [name, price]
  );
  return result.rows[0];
};
```

**3. Create controller:**
```javascript
// apps/backend/src/controllers/itemController.js
const Item = require('../models/itemModel');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**4. Create routes:**
```javascript
// apps/backend/src/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.post('/', itemController.createItem);

module.exports = router;
```

**5. Register routes in index.js:**
```javascript
// apps/backend/index.js
const itemRoutes = require('./src/routes/itemRoutes');
app.use('/api/items', itemRoutes);
```

**6. Create frontend service:**
```javascript
// apps/web/src/services/itemService.js
import apiClient from './api.js';

export const itemService = {
  getAllItems: async () => apiClient.get('/api/items'),
  createItem: async (data) => apiClient.post('/api/items', data),
};
```

**7. Create Redux slice:**
```javascript
// apps/web/src/store/slices/itemSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemService } from '../../services/itemService';

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async () => await itemService.getAllItems()
);

const itemSlice = createSlice({
  name: 'items',
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  },
});

export default itemSlice.reducer;
```

**8. Add to store:**
```javascript
// apps/web/src/store/store.js
import itemReducer from './slices/itemSlice';

export const store = configureStore({
  reducer: {
    items: itemReducer,
    // ... other reducers
  },
});
```

---

## Quick Reference Commands

### Start Development
```bash
docker-compose up              # Start all services
docker-compose up --build      # Rebuild and start
```

### Stop Development
```bash
docker-compose down            # Stop all services
docker-compose down -v         # Stop and remove volumes (fresh DB)
```

### Testing
```bash
# Backend
cd apps/backend && npm test

# Frontend
cd apps/web && npm test
```

### Database Access
```bash
# Connect to database
docker exec -it taste-of-aloha-db psql -U postgres -d taste_of_aloha

# View snacks
SELECT * FROM snacks;

# Exit
\q
```

### Debugging
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check running containers
docker ps

# Restart a service
docker-compose restart backend
```

---

## Understanding What You're Doing

### Key Concepts

**1. Backend (Express.js)**
- **Routes**: Define URL endpoints (e.g., `/api/snacks`)
- **Controllers**: Handle business logic
- **Models**: Interact with database
- **Middleware**: Process requests (CORS, JSON parsing)

**2. Frontend (React)**
- **Components**: UI building blocks
- **Redux**: State management (global data)
- **Services**: API communication layer
- **Hooks**: React lifecycle (useEffect, useState)

**3. Database (PostgreSQL)**
- **Tables**: Store structured data
- **Queries**: Retrieve/modify data (SQL)
- **Migrations**: Version control for schema

### Data Flow

```
User Action (Click)
    ↓
React Component
    ↓
Redux Action (dispatch)
    ↓
Service Layer
    ↓
HTTP Request (fetch)
    ↓
Backend Route
    ↓
Controller
    ↓
Model (SQL)
    ↓
Database
    ↓
Response (JSON)
    ↓
Redux State Update
    ↓
Component Re-render
```

---

## Next Steps

1. ✅ Start the application with Docker
2. ✅ Test the API with curl or Postman
3. ✅ Add a snack through the frontend
4. ✅ Run the test suites
5. 🔄 Modify a component and see hot reload
6. 🔄 Add validation to prevent empty snacks
7. 🔄 Add image upload capability
8. 🔄 Create a full order system

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Testing Library](https://testing-library.com/)

---

**Need Help?** Check the README.md or open an issue on GitHub!

Made with 🌺 Aloha Spirit
