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
## 📸 Screenshots

### Create Snack
<img width="991" height="578" alt="Screenshot 2025-11-22 034546" src="https://github.com/user-attachments/assets/20c569c4-dba5-4d08-9729-d0e3da7317ed" />
*Figure 1: POST /api/snacks request showing 201 Created response*

### Get Snack by ID
<img width="1005" height="526" alt="Screenshot 2025-11-22 034646" src="https://github.com/user-attachments/assets/63b363cc-14eb-40a7-b225-f60e760146a4" />
*Figure 2: GET /api/snacks/1 showing full snack object*

### Update Snack
<img width="1014" height="594" alt="Screenshot 2025-11-22 034717" src="https://github.com/user-attachments/assets/7e16ec65-e1fe-4f91-9acf-bf6d37011c75" />
*Figure 3: PUT /api/snacks/1 updating price field*

### Delete Snack
<img width="1008" height="639" alt="Screenshot 2025-11-22 034758" src="https://github.com/user-attachments/assets/7cb1d8f3-7107-433a-8e38-f39c36afa4cf" />
*Figure 4: DELETE /api/snacks/1 confirming deletion message*

### List Snacks
<img width="1231" height="486" alt="Screenshot 2025-11-22 034223" src="https://github.com/user-attachments/assets/7081f6ea-d5da-4605-83b6-89219411c0be" />
*Figure 5: GET /api/snacks showing empty array after deletion*
---

===

## 🛠️ Notes

- This backend uses an **in‑memory array** (`snacks`) — data resets when the server restarts.
- For production, replace with a database (e.g., MongoDB, PostgreSQL).
- PowerShell users should prefer `Invoke-WebRequest` to avoid JSON escaping issues.
```

---
