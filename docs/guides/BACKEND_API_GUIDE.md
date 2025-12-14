# Building Backend API Endpoints: Complete Guide

This guide teaches you how to build REST API endpoints for your backend. Follow it step-by-step to understand the architecture and create your own endpoints.

**Updated Naming Convention:** All references to "snacks" have been changed to "menu" items for better clarity. API endpoints use `/api/menu` instead of `/api/snacks`.

---

## Table of Contents
1. [API Concepts](#api-concepts)
2. [File Structure](#file-structure)
3. [Building Menu Endpoints (Tutorial)](#building-menu-endpoints-tutorial)
4. [Building Order Endpoints (Tutorial)](#building-order-endpoints-tutorial)
5. [Testing Your Endpoints](#testing-your-endpoints)
6. [Build Checklist](#build-checklist)

---

## API Concepts

### What is a REST API?

A REST API lets your frontend communicate with your backend using HTTP requests:

```
Frontend Request                Backend Process              Database
    ↓                               ↓                           ↓
GET /api/menu           →    Controller processes     →    Query Menu table
                             Returns JSON response    ←    Return data
```

### HTTP Methods (CRUD Operations)

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Read data | `GET /api/Menus` - Get all menu items |
| **POST** | Create data | `POST /api/Menus` - Create new item |
| **PUT** | Update data | `PUT /api/Menus/1` - Update item #1 |
| **DELETE** | Delete data | `DELETE /api/Menus/1` - Delete item #1 |

### URL Structure

```
GET /api/Menus
    ↑   ↑     ↑
    |   |     └─ Resource (what you're accessing)
    |   └─────── API version marker
    └─────────── HTTP method
```

### Response Format (JSON)

Success Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Spam Musubi",
    "price": 5.99
  }
}
```

Error Response:
```json
{
  "success": false,
  "message": "Menu item not found"
}
```

---

## File Structure

Your backend is organized into layers:

```
apps/backend/
├── index.js                    ← Main server file (starts Express)
├── src/
│   ├── controllers/            ← Business logic (handles requests)
│   │   ├── MenuController.js
│   │   └── orderController.js
│   ├── models/                 ← Database queries (Prisma)
│   │   ├── MenuModel.js
│   │   └── orderModel.js
│   ├── routes/                 ← URL endpoints (maps URLs to controllers)
│   │   ├── MenuRoutes.js
│   │   └── orderRoutes.js
│   └── utils/
│       └── logger.js
└── prisma/
    ├── schema.prisma
    └── migrations/
```

### How They Work Together

```
User makes request to /api/Menus
         ↓
    Route handler (MenuRoutes.js)
    "OK, this request is for Menus"
         ↓
    Controller (MenuController.js)
    "User wants all Menus, let me get them from database"
         ↓
    Model (MenuModel.js)
    "Query the Menu table using Prisma"
         ↓
    Database (PostgreSQL)
    Returns data
         ↓
    Controller formats response
         ↓
    Route sends JSON to user
```

---

## Building Menu Endpoints (Tutorial)

We'll create endpoints to manage menu items. Follow each step carefully.

### Step 1: Create the Menu Model (Database Queries)

**File: `apps/backend/src/models/MenuModel.js`**

This file contains functions to query the Menu table using Prisma:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all menu items
const getAllMenus = async () => {
  return await prisma.menu.findMany({
    orderBy: { createdAt: 'desc' }  // Newest first
  });
};

// GET one menu item by ID
const getMenuById = async (id) => {
  return await prisma.menu.findUnique({
    where: { id: parseInt(id) }
  });
};

// CREATE a new menu item
const createMenu = async (data) => {
  return await prisma.menu.create({
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      image: data.image || null,
      isAvailable: data.isAvailable !== false  // Default to true
    }
  });
};

// UPDATE a menu item
const updateMenu = async (id, data) => {
  return await prisma.menu.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name || undefined,
      description: data.description || undefined,
      price: data.price ? parseFloat(data.price) : undefined,
      category: data.category || undefined,
      image: data.image || undefined,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : undefined
    }
  });
};

// DELETE a menu item
const deleteMenu = async (id) => {
  return await prisma.menu.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
};
```

**What's happening:**
- Import PrismaClient (allows database queries)
- Create functions for each CRUD operation
- Use `prisma.menu.findMany()`, `create()`, `update()`, `delete()`
- Handle data types (parseInt for ID, parseFloat for price)
- Export functions so controllers can use them

---

### Step 2: Create the Menu Controller (Business Logic)

**File: `apps/backend/src/controllers/MenuController.js`**

This file handles requests and uses the Model to get data:

```javascript
const MenuModel = require('../models/MenuModel');
const logger = require('../utils/logger');

// GET all Menus
const getAllMenus = async (req, res) => {
  try {
    const Menus = await MenuModel.getAllMenus();
    
    res.json({
      success: true,
      count: Menus.length,
      data: Menus
    });
  } catch (error) {
    logger.error('Error fetching Menus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Menus',
      error: error.message
    });
  }
};

// GET one Menu by ID
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const Menu = await MenuModel.getMenuById(id);
    
    if (!Menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }
    
    res.json({
      success: true,
      data: Menu
    });
  } catch (error) {
    logger.error('Error fetching Menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Menu',
      error: error.message
    });
  }
};

// CREATE a new Menu
const createMenu = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, price, category'
      });
    }
    
    const newMenu = await MenuModel.createMenu({
      name,
      description,
      price,
      category,
      image,
      isAvailable
    });
    
    res.status(201).json({
      success: true,
      message: 'Menu created successfully',
      data: newMenu
    });
  } catch (error) {
    logger.error('Error creating Menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Menu',
      error: error.message
    });
  }
};

// UPDATE a Menu
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if Menu exists
    const Menu = await MenuModel.getMenuById(id);
    if (!Menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }
    
    const updatedMenu = await MenuModel.updateMenu(id, updateData);
    
    res.json({
      success: true,
      message: 'Menu updated successfully',
      data: updatedMenu
    });
  } catch (error) {
    logger.error('Error updating Menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating Menu',
      error: error.message
    });
  }
};

// DELETE a Menu
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if Menu exists
    const Menu = await MenuModel.getMenuById(id);
    if (!Menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }
    
    await MenuModel.deleteMenu(id);
    
    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting Menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting Menu',
      error: error.message
    });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
};
```

**What's happening:**
- Import model functions
- Create controller functions that receive `req` (request) and `res` (response)
- Handle errors with try/catch
- Validate data before saving
- Return JSON responses with success/error messages
- Use HTTP status codes (200 OK, 201 Created, 404 Not Found, 500 Error)

---

### Step 3: Create the Menu Routes (URL Endpoints)

**File: `apps/backend/src/routes/MenuRoutes.js`**

This file maps URLs to controller functions:

```javascript
const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');

// GET all Menus
// http://localhost:5001/api/Menus
router.get('/', MenuController.getAllMenus);

// GET one Menu by ID
// http://localhost:5001/api/Menus/1
router.get('/:id', MenuController.getMenuById);

// CREATE a new Menu
// http://localhost:5001/api/Menus
router.post('/', MenuController.createMenu);

// UPDATE a Menu
// http://localhost:5001/api/Menus/1
router.put('/:id', MenuController.updateMenu);

// DELETE a Menu
// http://localhost:5001/api/Menus/1
router.delete('/:id', MenuController.deleteMenu);

module.exports = router;
```

**What's happening:**
- Import Express router
- Import controller functions
- Define routes using `router.get()`, `router.post()`, etc.
- `:id` is a URL parameter (captured from the URL)
- Export router to use in main server file

---

### Step 4: Connect Routes to Main Server

**File: `apps/backend/index.js`**

Add the Menu routes to your Express server:

```javascript
const express = require('express');
const cors = require('cors');
const MenuRoutes = require('./src/routes/MenuRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/Menus', MenuRoutes);  // ← Add this line

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**What's happening:**
- Import Menu routes
- Register routes with `app.use('/api/Menus', MenuRoutes)`
- Now all Menu requests are handled by MenuRoutes

---

## Building Order Endpoints (Tutorial)

Orders are more complex because they relate to Menus and Users. Follow the same pattern:

### Step 1: Update Schema (Add Order & OrderItem Models)

**File: `apps/backend/prisma/schema.prisma`**

Add these models to your existing schema:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
  phone String?
  address String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders  Order[]    // Relation: user can have many orders
}

model Order {
  id        Int     @id @default(autoincrement())
  userId    Int
  user      User    @relation(fields: [userId], references: [id])  // Foreign key
  items     OrderItem[]  // Relation: order can have many items
  total     Float
  status    String  @default("pending")  // pending, confirmed, delivered
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id])  // Foreign key
  menuId    Int
  menu      Menu    @relation(fields: [menuId], references: [id])   // Foreign key
  quantity  Int
  price     Float   // Price at time of order
  createdAt DateTime @default(now())
}

model Menu {
  id          Int     @id @default(autoincrement())
  name        String
  description String
  price       Float
  image       String?
  category    String
  isAvailable Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]  // Relation: menu item in many orders
}
```

Create migration:
```powershell
cd apps/backend
npx prisma migrate dev --name add_user_and_order_tables
```

### Step 2: Create Order Model

**File: `apps/backend/src/models/orderModel.js`**

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE an order with items
const createOrder = async (userId, items) => {
  // items = [{ menuId: 1, quantity: 2 }, { menuId: 3, quantity: 1 }]
  
  let total = 0;
  const orderItems = [];
  
  // Calculate total and prepare items
  for (const item of items) {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(item.menuId) }
    });
    
    if (!menu) throw new Error(`Menu item ${item.menuId} not found`);
    
    const itemTotal = menu.price * item.quantity;
    total += itemTotal;
    
    orderItems.push({
      menuId: parseInt(item.menuId),
      quantity: item.quantity,
      price: menu.price
    });
  }
  
  // Create order with all items in one transaction
  return await prisma.order.create({
    data: {
      userId: parseInt(userId),
      total: total,
      items: {
        create: orderItems
      }
    },
    include: {
      items: {
        include: {
          menu: true  // Include menu details
        }
      },
      user: true
    }
  });
};

// GET all orders
const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          menu: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// GET order by ID
const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      items: {
        include: {
          menu: true
        }
      }
    }
  });
};

// UPDATE order status
const updateOrderStatus = async (id, status) => {
  return await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status },
    include: {
      user: true,
      items: {
        include: {
          menu: true
        }
      }
    }
  });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};
```

### Step 3: Create Order Controller

**File: `apps/backend/src/controllers/orderController.js`**

```javascript
const orderModel = require('../models/orderModel');
const logger = require('../utils/logger');

// CREATE order
const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, items (array)'
      });
    }
    
    const newOrder = await orderModel.createOrder(userId, items);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// GET order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// UPDATE order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const updatedOrder = await orderModel.updateOrderStatus(id, status);
    
    res.json({
      success: true,
      message: 'Order status updated',
      data: updatedOrder
    });
  } catch (error) {
    logger.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};
```

### Step 4: Create Order Routes

**File: `apps/backend/src/routes/orderRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET order by ID
router.get('/:id', orderController.getOrderById);

// CREATE order
router.post('/', orderController.createOrder);

// UPDATE order status
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;
```

### Step 5: Add Order Routes to Server

**Update `apps/backend/index.js`:**

```javascript
const orderRoutes = require('./src/routes/orderRoutes');

// ... existing code ...

app.use('/api/Menus', MenuRoutes);
app.use('/api/orders', orderRoutes);  // ← Add this line
```

---

## Testing Your Endpoints

### Using curl (Command Line)

```powershell
# GET all Menus
curl http://localhost:5001/api/Menus

# GET one Menu
curl http://localhost:5001/api/Menus/1

# CREATE Menu
curl -X POST http://localhost:5001/api/Menus `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Kalua Pork Taco",
    "description": "Tender kalua pork with cabbage",
    "price": 6.99,
    "category": "main",
    "image": "kalua-pork.jpg"
  }'

# UPDATE Menu
curl -X PUT http://localhost:5001/api/Menus/1 `
  -H "Content-Type: application/json" `
  -d '{"price": 7.99}'

# DELETE Menu
curl -X DELETE http://localhost:5001/api/Menus/1
```

### Using Postman (Visual Tool)

1. Open Postman (or download from postman.com)
2. Create new request
3. Set method: GET, POST, PUT, DELETE
4. Enter URL: `http://localhost:5001/api/Menus`
5. For POST/PUT: Go to Body tab → JSON → paste data
6. Click Send

---

## Build Checklist

Use this checklist to track your progress:

### Phase 1: Menu Endpoints

- ⬜ Create `src/models/MenuModel.js`
  - ⬜ getAllMenus function
  - ⬜ getMenuById function
  - ⬜ createMenu function
  - ⬜ updateMenu function
  - ⬜ deleteMenu function

- ⬜ Create `src/controllers/MenuController.js`
  - ⬜ getAllMenus controller
  - ⬜ getMenuById controller
  - ⬜ createMenu controller with validation
  - ⬜ updateMenu controller with validation
  - ⬜ deleteMenu controller with validation

- ⬜ Create `src/routes/MenuRoutes.js`
  - ⬜ GET / route
  - ⬜ GET /:id route
  - ⬜ POST / route
  - ⬜ PUT /:id route
  - ⬜ DELETE /:id route

- ⬜ Update `index.js`
  - ⬜ Import MenuRoutes
  - ⬜ Add `app.use('/api/Menus', MenuRoutes)`

- ⬜ Test all endpoints with curl or Postman
  - ⬜ GET all Menus
  - ⬜ GET single Menu
  - ⬜ CREATE Menu
  - ⬜ UPDATE Menu
  - ⬜ DELETE Menu

- ⬜ Commit to git
  - ⬜ Stage changes: `git add src/`
  - ⬜ Commit: `git commit -m "feat: add menu endpoints (CRUD)"`
  - ⬜ Push: `git push`

---

### Phase 2: Order Endpoints (Optional - after Phase 1 works)

- ⬜ Update `prisma/schema.prisma`
  - ⬜ Add User model
  - ⬜ Add Order model
  - ⬜ Add OrderItem model
  - ⬜ Update Menu model with relations

- ⬜ Create migration
  - ⬜ Run `npx prisma migrate dev --name add_user_and_order_tables`

- ⬜ Create `src/models/orderModel.js`
  - ⬜ createOrder function
  - ⬜ getAllOrders function
  - ⬜ getOrderById function
  - ⬜ updateOrderStatus function

- ⬜ Create `src/controllers/orderController.js`
  - ⬜ createOrder controller
  - ⬜ getAllOrders controller
  - ⬜ getOrderById controller
  - ⬜ updateOrderStatus controller

- ⬜ Create `src/routes/orderRoutes.js`
  - ⬜ GET / route
  - ⬜ GET /:id route
  - ⬜ POST / route
  - ⬜ PUT /:id route

- ⬜ Update `index.js`
  - ⬜ Import orderRoutes
  - ⬜ Add `app.use('/api/orders', orderRoutes)`

- ⬜ Test order endpoints
  - ⬜ GET all orders
  - ⬜ CREATE order with items
  - ⬜ GET single order
  - ⬜ UPDATE order status

- ⬜ Commit to git
  - ⬜ Stage changes: `git add .`
  - ⬜ Commit: `git commit -m "feat: add order endpoints with relations"`
  - ⬜ Push: `git push`

---

## Key Concepts to Remember

| Concept | What It Is | Example |
|---------|-----------|---------|
| **Route** | Maps URL to function | GET `/api/Menus` → getAllMenus() |
| **Controller** | Handles request logic | Validate data, call model, return response |
| **Model** | Database queries | `prisma.menu.findMany()` |
| **Middleware** | Processes requests | `express.json()` parses JSON |
| **Status Code** | HTTP response code | 200=OK, 201=Created, 404=NotFound, 500=Error |
| **try/catch** | Error handling | Catches errors, returns error response |
| **Validation** | Check data is correct | Name is string, price is number, etc. |

---

## Next Steps After Completing Checklist

1. ✅ Backend API endpoints working
2. Connect frontend to API (fetch data from React)
3. Add authentication (login/register)
4. Add payment processing (Stripe)
5. Deploy to production

**Start with Phase 1 (Menu Endpoints) first!**
