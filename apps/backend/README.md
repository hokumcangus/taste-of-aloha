# 🌺 Taste of Aloha Backend

This is the backend service for **Taste of Aloha**, built with **Node.js + Express**.  
It provides a REST API for managing menu items and orders.

## ✅ Foundation Complete

- Backend scaffold complete and verified
- Dev server runs successfully at http://localhost:5001
- Health endpoint `/health` returns 200 status
- API endpoints `/api/menu` working with CRUD operations
- CORS configured for frontend communication

See [LEARNING_GUIDE.md](../../docs/guides/LEARNING_GUIDE.md) for comprehensive documentation.

---

## 🚀 Getting Started

### Option 1: Local Development

#### 1. Install dependencies
```bash
npm install
```

#### 2. Run the server
```bash
npm run dev
```

The server will start at:  
**http://localhost:3000**

---

### Option 2: Docker

The backend can run in a Docker container, which includes:
- Automatic hot reload in development mode
- PostgreSQL database connection
- Production-optimized builds

#### Development Mode
```bash
# From project root
docker-compose up backend
```

**What happens:**
- Backend runs with nodemon for auto-restart on code changes
- Your local `apps/backend` folder is mounted as a volume
- Connected to PostgreSQL container via internal Docker network
- Accessible at `http://localhost:3000`

#### Production Mode
```bash
# From project root
docker-compose -f docker-compose.prod.yml up backend
```

**What happens:**
- Optimized Node.js image (smaller size)
- Runs as non-root user for security
- Only production dependencies installed
- Health checks monitor API availability
- Not exposed externally (only accessible via Nginx proxy)

#### Build Backend Image Only
```bash
# From apps/backend
docker build -t taste-of-aloha-backend --target development .
# Or for production
docker build -t taste-of-aloha-backend --target production .
```

---

## 🔧 CORS Configuration

### Do I need to import CORS?

**Yes!** You need to import and configure CORS to allow your frontend (running on a different port) to make requests to the backend.

The `cors` package is already in your `package.json` dependencies, but you need to configure it in `index.js`.

### Setup Instructions

1. **Import cors** at the top of `apps/backend/index.js`:
   ```javascript
   const cors = require('cors');
   ```

2. **Add CORS middleware** before your routes:
   ```javascript
   app.use(cors());
   ```

Your `index.js` should look like this:
```javascript
const express = require('express');
const cors = require('cors');
const MenuRoutes = require('./src/routes/MenuRoutes');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());  // Enable CORS for all routes
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/Menus', MenuRoutes);
// ... rest of your code
```

### Why CORS is needed

- Your frontend runs on `http://localhost:5173` (Vite default)
- Your backend runs on `http://localhost:3000`
- Browsers block cross-origin requests by default
- CORS allows the frontend to communicate with the backend

---

## 🧪 Testing Your Backend

### Quick Browser Test

1. **Test root endpoint:**
   - Open `http://localhost:3000/` in your browser
   - You should see: "Taste of Aloha backend is running 🌺"

2. **Test API endpoint:**
   - Open `http://localhost:3000/api/Menus` in your browser
   - You should see an empty array `[]` (or Menus if any exist)

### Using Browser Console (JavaScript)

Open your browser's developer console (F12) and run:

```javascript
// Test root endpoint
fetch('http://localhost:3000/')
  .then(res => res.text())
  .then(data => console.log(data));

// Test get all Menus
fetch('http://localhost:3000/api/Menus')
  .then(res => res.json())
  .then(data => console.log(data));

// Test get Menu by ID
fetch('http://localhost:3000/api/Menus/1')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Using Postman or Thunder Client (VS Code Extension)

1. **Install Thunder Client** (VS Code extension) or use Postman
2. Create a new request:
   - Method: `GET`
   - URL: `http://localhost:3000/api/Menus`
3. Click "Send" and check the response

### Using curl (Terminal)

See the "Verification Commands" section below for detailed curl examples.

---

## 📂 Project Structure

```
apps/backend/
├── index.js
└── src/
    ├── routes/
    │   └── MenuRoutes.js
    ├── controllers/
    │   └── MenuController.js
    └── models/
        └── MenuModel.js
```

---

## 🔍 API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/Menus`         | List all Menus      |
| GET    | `/api/Menus/:id`     | Get Menu by ID      |
| POST   | `/api/Menus`         | Create new Menu     |
| PUT    | `/api/Menus/:id`     | Update Menu by ID   |
| DELETE | `/api/Menus/:id`     | Delete Menu by ID   |

---

## ⚡ Verification Commands

### 🖥️ PowerShell (Windows)

Use `Invoke-WebRequest` (simpler than curl.exe):

```powershell
# List Menus (empty at start)
Invoke-WebRequest -Uri http://localhost:3000/api/Menus -Method GET

# Create a Menu
Invoke-WebRequest -Uri http://localhost:3000/api/Menus `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Mochi Crunch","price":3.5}'

# Get Menu by ID
Invoke-WebRequest -Uri http://localhost:3000/api/Menus/1 -Method GET

# Update Menu by ID
Invoke-WebRequest -Uri http://localhost:3000/api/Menus/1 `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"price":3.75}'

# Delete Menu by ID
Invoke-WebRequest -Uri http://localhost:3000/api/Menus/1 -Method DELETE
```

---

### 🐧 Bash / macOS / Linux / Git Bash

```bash
# List Menus (empty at start)
curl -i http://localhost:3000/api/Menus

# Create a Menu
curl -i -X POST http://localhost:3000/api/Menus \
  -H "Content-Type: application/json" \
  -d '{"name":"Mochi Crunch","price":3.5}'

# Get Menu by ID
curl -i http://localhost:3000/api/Menus/1

# Update Menu by ID
curl -i -X PUT http://localhost:3000/api/Menus/1 \
  -H "Content-Type: application/json" \
  -d '{"price":3.75}'

# Delete Menu by ID
curl -i -X DELETE http://localhost:3000/api/Menus/1
```

## ✅ Expected Responses

- **POST /api/Menus**
  ```json
  { "id": 1, "name": "Mochi Crunch", "price": 3.5 }
  ```

- **GET /api/Menus/1**
  ```json
  { "id": 1, "name": "Mochi Crunch", "price": 3.5 }
  ```

- **PUT /api/Menus/1**
  ```json
  { "id": 1, "name": "Mochi Crunch", "price": 3.75 }
  ```

- **DELETE /api/Menus/1**
  ```json
  { "message": "Menu deleted" }
  ```

- **GET /api/Menus** (after delete)
  ```json
  []
  ```

---
## 📸 Screenshots

### Create Menu
<img width="991" height="578" alt="Screenshot 2025-11-22 034546" src="https://github.com/user-attachments/assets/20c569c4-dba5-4d08-9729-d0e3da7317ed" />
*Figure 1: POST /api/Menus request showing 201 Created response*

### Get Menu by ID
<img width="1005" height="526" alt="Screenshot 2025-11-22 034646" src="https://github.com/user-attachments/assets/63b363cc-14eb-40a7-b225-f60e760146a4" />
*Figure 2: GET /api/Menus/1 showing full Menu object*

### Update Menu
<img width="1014" height="594" alt="Screenshot 2025-11-22 034717" src="https://github.com/user-attachments/assets/7e16ec65-e1fe-4f91-9acf-bf6d37011c75" />
*Figure 3: PUT /api/Menus/1 updating price field*

### Delete Menu
<img width="1008" height="639" alt="Screenshot 2025-11-22 034758" src="https://github.com/user-attachments/assets/7cb1d8f3-7107-433a-8e38-f39c36afa4cf" />
*Figure 4: DELETE /api/Menus/1 confirming deletion message*

### List Menus
<img width="1231" height="486" alt="Screenshot 2025-11-22 034223" src="https://github.com/user-attachments/assets/7081f6ea-d5da-4605-83b6-89219411c0be" />
*Figure 5: GET /api/Menus showing empty array after deletion*
---

===

## 🛠️ Notes

- This backend uses an **in‑memory array** (`Menus`) — data resets when the server restarts.
- For production, replace with a database (e.g., MongoDB, PostgreSQL).
- PowerShell users should prefer `Invoke-WebRequest` to avoid JSON escaping issues.
```

---
