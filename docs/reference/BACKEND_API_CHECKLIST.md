# Quick Build Checklist

Print this out or keep it in a tab while you build!

---

## Phase 1: Menu API (CRUD for menu items)

### Create Files

```
apps/backend/src/models/menuModel.js
apps/backend/src/controllers/menuController.js
apps/backend/src/routes/menuRoutes.js
```

### menuModel.js Functions
- [ ] getAllMenuItems()
- [ ] getMenuItemById(id)
- [ ] createMenuItem(data)
- [ ] updateMenuItem(id, data)
- [ ] deleteMenuItem(id)

### menuController.js Functions
- [ ] getAllMenuItems(req, res)
- [ ] getMenuItemById(req, res)
- [ ] createMenuItem(req, res)
- [ ] updateMenuItem(req, res)
- [ ] deleteMenuItem(req, res)

### menuRoutes.js
- [ ] GET / → getAllMenuItems
- [ ] GET /:id → getMenuItemById
- [ ] POST / → createMenuItem
- [ ] PUT /:id → updateMenuItem
- [ ] DELETE /:id → deleteMenuItem

### Update index.js
```javascript
const menuRoutes = require('./src/routes/menuRoutes');
app.use('/api/menu', menuRoutes);
```
- [ ] Import menuRoutes
- [ ] Add app.use line

### Test Each Endpoint

```powershell
# Start server
cd apps/backend
npm run dev
```

In another terminal:

- [ ] Test GET all: `curl http://localhost:5001/api/menu`
- [ ] Test GET one: `curl http://localhost:5001/api/menu/1`
- [ ] Test CREATE: `curl -X POST http://localhost:5001/api/menu -H "Content-Type: application/json" -d '{"name":"Spam Musubi","description":"Spam and rice","price":5.99,"category":"main"}'`
- [ ] Test UPDATE: `curl -X PUT http://localhost:5001/api/menu/1 -H "Content-Type: application/json" -d '{"price":6.99}'`
- [ ] Test DELETE: `curl -X DELETE http://localhost:5001/api/menu/1`

### Commit to Git

```powershell
cd C:\Users\mcang\projects\taste-of-aloha
git add apps/backend/src
git commit -m "feat: add menu CRUD endpoints"
git push
```

- [ ] Stage files
- [ ] Commit with message
- [ ] Push to GitHub

---

## Phase 2: Order API (Optional - do after Phase 1 works)

### Update Database Schema

**File: `apps/backend/prisma/schema.prisma`**

Add models:
- [ ] User model (id, email, name, phone, address)
- [ ] Order model (id, userId, total, status, createdAt, updatedAt)
- [ ] OrderItem model (id, orderId, menuId, quantity, price)
- [ ] Add relations between them

### Create Migration

```powershell
cd apps/backend
npx prisma migrate dev --name add_user_and_order_tables
```

- [ ] Schema updated with 3 new models
- [ ] Migration created
- [ ] Tables created in database

### Create Files

```
apps/backend/src/models/orderModel.js
apps/backend/src/controllers/orderController.js
apps/backend/src/routes/orderRoutes.js
```

### orderModel.js Functions
- [ ] createOrder(userId, items)
- [ ] getAllOrders()
- [ ] getOrderById(id)
- [ ] updateOrderStatus(id, status)

### orderController.js Functions
- [ ] createOrder(req, res)
- [ ] getAllOrders(req, res)
- [ ] getOrderById(req, res)
- [ ] updateOrderStatus(req, res)

### orderRoutes.js
- [ ] GET / → getAllOrders
- [ ] GET /:id → getOrderById
- [ ] POST / → createOrder
- [ ] PUT /:id → updateOrderStatus

### Update index.js
```javascript
const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api/orders', orderRoutes);
```
- [ ] Import orderRoutes
- [ ] Add app.use line

### Test Endpoints

- [ ] Test GET all orders
- [ ] Test CREATE order with items
- [ ] Test GET single order
- [ ] Test UPDATE order status

### Commit to Git

```powershell
git add apps/backend/
git commit -m "feat: add order endpoints with user and item models"
git push
```

- [ ] Stage files
- [ ] Commit
- [ ] Push

---

## API Endpoints Reference

Once complete, you'll have:

### Menu Endpoints
```
GET    http://localhost:5001/api/menu          Get all items
GET    http://localhost:5001/api/menu/1        Get item #1
POST   http://localhost:5001/api/menu          Create item
PUT    http://localhost:5001/api/menu/1        Update item #1
DELETE http://localhost:5001/api/menu/1        Delete item #1
```

### Order Endpoints (Phase 2)
```
GET    http://localhost:5001/api/orders          Get all orders
GET    http://localhost:5001/api/orders/1        Get order #1
POST   http://localhost:5001/api/orders          Create order
PUT    http://localhost:5001/api/orders/1        Update order status
```

---

## File Structure When Complete

```
apps/backend/
├── index.js
├── .env
├── package.json
├── src/
│   ├── models/
│   │   ├── menuModel.js      ✅
│   │   └── orderModel.js      (Phase 2)
│   ├── controllers/
│   │   ├── menuController.js ✅
│   │   └── orderController.js (Phase 2)
│   ├── routes/
│   │   ├── menuRoutes.js     ✅
│   │   └── orderRoutes.js     (Phase 2)
│   └── utils/
│       └── logger.js
└── prisma/
    ├── schema.prisma
    └── migrations/
```

---

## Tips

1. **Start with Models** - Write database queries first
2. **Then Controllers** - Add business logic
3. **Then Routes** - Connect URLs to controllers
4. **Then Test** - Use curl to test each endpoint
5. **Then Commit** - Stage, commit, push to GitHub

6. **Copy & Paste** - The BACKEND_API_GUIDE.md has complete code examples. Copy the entire function.

7. **Check Errors** - If endpoint fails:
   - Check browser console
   - Check terminal for error messages
   - Use `npm run dev` to see server logs

8. **Use Postman** - Download Postman for easier testing than curl

---

## Current Status

- [x] Database setup (Prisma + PostgreSQL)
- [x] Menu model created
- [ ] Menu endpoints (IN PROGRESS - START HERE!)
- [ ] Order model
- [ ] Order endpoints

**You are here: Building Menu Endpoints ↑**

---

**Last Updated:** December 14, 2025
**Current Branch:** feat/backend-api-endpoints
