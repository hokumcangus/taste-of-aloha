```markdown
# 🌺 Taste of Aloha Backend

This is the backend service for **Taste of Aloha**, built with **Node.js + Express**.  
It provides a simple in‑memory CRUD API for managing snacks.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the server
```bash
npm run dev
```

The server will start at:  
**http://localhost:3000**

---

## 📂 Project Structure

```
apps/backend/
├── index.js
└── src/
    ├── routes/
    │   └── snackRoutes.js
    ├── controllers/
    │   └── snackController.js
    └── models/
        └── snackModel.js
```

---

## 🔍 API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/snacks`         | List all snacks      |
| GET    | `/api/snacks/:id`     | Get snack by ID      |
| POST   | `/api/snacks`         | Create new snack     |
| PUT    | `/api/snacks/:id`     | Update snack by ID   |
| DELETE | `/api/snacks/:id`     | Delete snack by ID   |

---

## ⚡ Verification Commands

### 🖥️ PowerShell (Windows)

Use `Invoke-WebRequest` (simpler than curl.exe):

```powershell
# List snacks (empty at start)
Invoke-WebRequest -Uri http://localhost:3000/api/snacks -Method GET

# Create a snack
Invoke-WebRequest -Uri http://localhost:3000/api/snacks `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Mochi Crunch","price":3.5}'

# Get snack by ID
Invoke-WebRequest -Uri http://localhost:3000/api/snacks/1 -Method GET

# Update snack by ID
Invoke-WebRequest -Uri http://localhost:3000/api/snacks/1 `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"price":3.75}'

# Delete snack by ID
Invoke-WebRequest -Uri http://localhost:3000/api/snacks/1 -Method DELETE
```

---

### 🐧 Bash / macOS / Linux / Git Bash

```bash
# List snacks (empty at start)
curl -i http://localhost:3000/api/snacks

# Create a snack
curl -i -X POST http://localhost:3000/api/snacks \
  -H "Content-Type: application/json" \
  -d '{"name":"Mochi Crunch","price":3.5}'

# Get snack by ID
curl -i http://localhost:3000/api/snacks/1

# Update snack by ID
curl -i -X PUT http://localhost:3000/api/snacks/1 \
  -H "Content-Type: application/json" \
  -d '{"price":3.75}'

# Delete snack by ID
curl -i -X DELETE http://localhost:3000/api/snacks/1
```

---

## ✅ Expected Responses

- **POST /api/snacks**
  ```json
  { "id": 1, "name": "Mochi Crunch", "price": 3.5 }
  ```

- **GET /api/snacks/1**
  ```json
  { "id": 1, "name": "Mochi Crunch", "price": 3.5 }
  ```

- **PUT /api/snacks/1**
  ```json
  { "id": 1, "name": "Mochi Crunch", "price": 3.75 }
  ```

- **DELETE /api/snacks/1**
  ```json
  { "message": "Snack deleted" }
  ```

- **GET /api/snacks** (after delete)
  ```json
  []
  ```

---

## 🛠️ Notes

- This backend uses an **in‑memory array** (`snacks`) — data resets when the server restarts.
- For production, replace with a database (e.g., MongoDB, PostgreSQL).
- PowerShell users should prefer `Invoke-WebRequest` to avoid JSON escaping issues.
```

---
