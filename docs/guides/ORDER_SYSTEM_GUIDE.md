# Order System Implementation Guide

## Overview
This guide walks you through building a complete food ordering system with delivery and pickup options for Taste of Aloha.

## Architecture

### User Flow
1. **Browse Menu** → Customer views available snacks/meals
2. **Add to Cart** → Items are added with quantity
3. **Checkout** → Customer chooses delivery/pickup, enters details
4. **Order Confirmation** → Order is placed and customer receives confirmation
5. **Order Tracking** → Customer can view order status

### Tech Stack
- **Frontend**: React + Redux Toolkit (cart state), Tailwind CSS (styling)
- **Backend**: Express + Node.js (order API)
- **Database**: PostgreSQL (orders storage)
- **State Management**: Redux (cart, orders)

---

## Step 1: Backend - Order Model & Routes

### 1.1 Create Order Model
**File**: `apps/backend/src/models/orderModel.js`

```javascript
// Order Model - Define the structure of an order
export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const OrderType = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
};

// In-memory storage (replace with PostgreSQL later)
let orders = [];
let nextOrderId = 1;

export const createOrder = (orderData) => {
  const order = {
    id: nextOrderId++,
    orderNumber: `TA${Date.now()}`,
    items: orderData.items, // Array of {snackId, name, price, quantity}
    subtotal: orderData.subtotal,
    tax: orderData.tax,
    deliveryFee: orderData.deliveryFee || 0,
    total: orderData.total,
    orderType: orderData.orderType, // 'delivery' or 'pickup'
    status: OrderStatus.PENDING,
    customerInfo: {
      name: orderData.customerName,
      email: orderData.customerEmail,
      phone: orderData.customerPhone,
      address: orderData.address || null, // Only for delivery
      notes: orderData.notes || ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(order);
  return order;
};

export const getOrderById = (id) => {
  return orders.find(order => order.id === parseInt(id));
};

export const getAllOrders = () => {
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const updateOrderStatus = (id, status) => {
  const order = getOrderById(id);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
  return null;
};
```

### 1.2 Create Order Controller
**File**: `apps/backend/src/controllers/orderController.js`

```javascript
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from '../models/orderModel.js';
import { logger } from '../utils/logger.js';

// POST /api/orders - Create new order
export const placeOrder = (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    
    if (!orderData.customerName || !orderData.customerEmail || !orderData.customerPhone) {
      return res.status(400).json({ error: 'Customer information is required' });
    }
    
    if (orderData.orderType === 'delivery' && !orderData.address) {
      return res.status(400).json({ error: 'Delivery address is required for delivery orders' });
    }
    
    const order = createOrder(orderData);
    logger.info(`New order placed: ${order.orderNumber}`);
    
    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    logger.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// GET /api/orders/:id - Get order by ID
export const getOrder = (req, res) => {
  try {
    const order = getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// GET /api/orders - Get all orders
export const getOrders = (req, res) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// PATCH /api/orders/:id/status - Update order status
export const updateStatus = (req, res) => {
  try {
    const { status } = req.body;
    const order = updateOrderStatus(req.params.id, status);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    logger.info(`Order ${order.orderNumber} status updated to ${status}`);
    res.json(order);
  } catch (error) {
    logger.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
```

### 1.3 Create Order Routes
**File**: `apps/backend/src/routes/orderRoutes.js`

```javascript
import express from 'express';
import { placeOrder, getOrder, getOrders, updateStatus } from '../controllers/orderController.js';

const router = express.Router();

// POST /api/orders - Create new order
router.post('/', placeOrder);

// GET /api/orders - Get all orders
router.get('/', getOrders);

// GET /api/orders/:id - Get specific order
router.get('/:id', getOrder);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', updateStatus);

export default router;
```

### 1.4 Register Order Routes
**File**: `apps/backend/index.js` (update)

Add this import at the top:
```javascript
import orderRoutes from './src/routes/orderRoutes.js';
```

Add this route registration after the snack routes:
```javascript
app.use('/api/orders', orderRoutes);
```

### 1.5 Test Backend
```powershell
cd apps/backend
npm run dev
```

Test with curl or Postman:
```powershell
# Create an order
curl -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d '{
  "items": [{"snackId": 1, "name": "Spam Musubi", "price": 3.99, "quantity": 2}],
  "subtotal": 7.98,
  "tax": 0.80,
  "deliveryFee": 5.00,
  "total": 13.78,
  "orderType": "delivery",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "808-555-1234",
  "address": "123 Aloha St, Honolulu, HI 96815"
}'

# Get all orders
curl http://localhost:3000/api/orders
```

---

## Step 2: Frontend - Cart & Order Components

### 2.1 Create Cart Slice
**File**: `apps/web/src/store/slices/cartSlice.js`

```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { snack, quantity }
  totalItems: 0,
  subtotal: 0
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.snack.price * item.quantity), 0);
  return { totalItems, subtotal };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const snack = action.payload;
      const existingItem = state.items.find(item => item.snack.id === snack.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ snack, quantity: 1 });
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
    },
    
    removeFromCart: (state, action) => {
      const snackId = action.payload;
      state.items = state.items.filter(item => item.snack.id !== snackId);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
    },
    
    updateQuantity: (state, action) => {
      const { snackId, quantity } = action.payload;
      const item = state.items.find(item => item.snack.id === snackId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.snack.id !== snackId);
        } else {
          item.quantity = quantity;
        }
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### 2.2 Create Order Slice
**File**: `apps/web/src/store/slices/orderSlice.js`

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

// Async thunks
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
```

### 2.3 Update Store Configuration
**File**: `apps/web/src/store/store.js` (update)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import snackReducer from './slices/snackSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    snacks: snackReducer,
    cart: cartReducer,
    orders: orderReducer
  }
});
```

### 2.4 Create Order Service
**File**: `apps/web/src/services/orderService.js`

```javascript
import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },
  
  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },
  
  getAllOrders: async () => {
    return await api.get('/orders');
  },
  
  updateOrderStatus: async (id, status) => {
    return await api.patch(`/orders/${id}/status`, { status });
  }
};

export default orderService;
```

### 2.5 Create Cart Component
**File**: `apps/web/src/components/Cart.jsx`

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

export default function Cart({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { items, totalItems, subtotal } = useSelector((state) => state.cart);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Cart ({totalItems})</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.snack.id} className="flex gap-4 border-b pb-4">
                  <img 
                    src={item.snack.image || 'https://via.placeholder.com/80'} 
                    alt={item.snack.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.snack.name}</h3>
                    <p className="text-sm text-gray-600">${item.snack.price.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ 
                          snackId: item.snack.id, 
                          quantity: item.quantity - 1 
                        }))}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ 
                          snackId: item.snack.id, 
                          quantity: item.quantity + 1 
                        }))}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(item.snack.id))}
                        className="ml-auto text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full mt-4 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

### 2.6 Update Menu Page to Add Cart Functionality
**File**: `apps/web/src/pages/Menu.jsx` (update)

Add cart dispatch:
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchSnacks } from '../store/slices/snackSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useState } from 'react';
import Cart from '../components/Cart';

export default function Menu() {
  const dispatch = useDispatch();
  const { snacks, loading, error } = useSelector((state) => state.snacks);
  const [cartOpen, setCartOpen] = useState(false);
  
  // ... existing code ...
  
  const handleAddToCart = (snack) => {
    dispatch(addToCart(snack));
    setCartOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Menu</h1>
      
      <button
        onClick={() => setCartOpen(true)}
        className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Cart ({useSelector((state) => state.cart.totalItems)})
      </button>
      
      {/* Existing loading/error/snacks display code */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {snacks.map((snack) => (
          <div key={snack.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold">{snack.name}</h2>
            <p className="text-gray-600">{snack.description}</p>
            <p className="text-lg font-bold mt-2">${snack.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(snack)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
```

### 2.7 Create Checkout Page
**File**: `apps/web/src/pages/Checkout.jsx` (update with full implementation)

```jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  
  const [orderType, setOrderType] = useState('delivery');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    notes: ''
  });
  
  const TAX_RATE = 0.10; // 10% tax
  const DELIVERY_FEE = 5.00;
  
  const tax = subtotal * TAX_RATE;
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      items: items.map(item => ({
        snackId: item.snack.id,
        name: item.snack.name,
        price: item.snack.price,
        quantity: item.quantity
      })),
      subtotal,
      tax,
      deliveryFee,
      total,
      orderType,
      ...formData
    };
    
    try {
      const result = await dispatch(placeOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/order-confirmation/${result.order.id}`);
    } catch (error) {
      alert('Failed to place order: ' + error);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/menu')}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Go to Menu
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Type */}
            <div>
              <label className="block font-semibold mb-2">Order Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="delivery"
                    checked={orderType === 'delivery'}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="mr-2"
                  />
                  Delivery
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="pickup"
                    checked={orderType === 'pickup'}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="mr-2"
                  />
                  Pickup
                </label>
              </div>
            </div>
            
            {/* Customer Info */}
            <div>
              <label className="block font-semibold mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                className="w-full border rounded px-3 py-2"
                placeholder="808-555-1234"
              />
            </div>
            
            {orderType === 'delivery' && (
              <div>
                <label className="block font-semibold mb-1">Delivery Address *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                  placeholder="123 Aloha St, Honolulu, HI 96815"
                />
              </div>
            )}
            
            <div>
              <label className="block font-semibold mb-1">Special Instructions</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full border rounded px-3 py-2"
                rows="2"
                placeholder="Any special requests?"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.snack.id} className="flex justify-between text-sm">
                  <span>{item.snack.name} × {item.quantity}</span>
                  <span>${(item.snack.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2.8 Create Order Confirmation Page
**File**: `apps/web/src/pages/OrderConfirmation.jsx`

```jsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrder } from '../store/slices/orderSlice';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((state) => state.orders);
  
  useEffect(() => {
    dispatch(fetchOrder(orderId));
  }, [dispatch, orderId]);
  
  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }
  
  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link to="/menu" className="text-blue-600 hover:underline">Return to Menu</Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center mb-8">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
        <p className="text-gray-700">
          Thank you for your order. We'll {currentOrder.orderType === 'delivery' ? 'deliver it' : 'have it ready'} soon!
        </p>
      </div>
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">Order #{currentOrder.orderNumber}</h2>
            <p className="text-sm text-gray-600">
              {new Date(currentOrder.createdAt).toLocaleString()}
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {currentOrder.status.toUpperCase()}
          </span>
        </div>
        
        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-2">Order Type</h3>
          <p className="capitalize">{currentOrder.orderType}</p>
        </div>
        
        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <p>{currentOrder.customerInfo.name}</p>
          <p>{currentOrder.customerInfo.email}</p>
          <p>{currentOrder.customerInfo.phone}</p>
          {currentOrder.customerInfo.address && (
            <p className="mt-2">{currentOrder.customerInfo.address}</p>
          )}
        </div>
        
        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <div className="space-y-2">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>${currentOrder.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tax:</span>
            <span>${currentOrder.tax.toFixed(2)}</span>
          </div>
          {currentOrder.deliveryFee > 0 && (
            <div className="flex justify-between mb-1">
              <span>Delivery Fee:</span>
              <span>${currentOrder.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${currentOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link
          to="/menu"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
```

### 2.9 Update App Routes
**File**: `apps/web/src/App.jsx` (add routes)

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex gap-6">
            <a href="/" className="font-bold text-xl">🌺 Taste of Aloha</a>
            <a href="/menu" className="hover:text-blue-600">Menu</a>
            <a href="/about" className="hover:text-blue-600">About</a>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

---

## Step 3: Testing the Complete Flow

### 3.1 Start Backend
```powershell
cd apps/backend
npm run dev
```

### 3.2 Start Frontend
```powershell
cd apps/web
npm run dev
```

### 3.3 Test Order Flow
1. Open `http://localhost:5173`
2. Navigate to Menu
3. Click "Add to Cart" on items
4. Open cart and adjust quantities
5. Click "Proceed to Checkout"
6. Fill in customer info
7. Select delivery or pickup
8. Submit order
9. View confirmation page

---

## Step 4: Docker Deployment

### 4.1 Build and Run with Docker
```powershell
# From project root
docker-compose up --build
```

### 4.2 Test Production Build
- Frontend: `http://localhost`
- Backend API: `http://localhost/api/snacks`
- Place test order: Use the web interface

---

## Next Steps

1. **Database Integration**: Replace in-memory storage with PostgreSQL
2. **Payment Processing**: Add Stripe integration
3. **Real-time Updates**: Add WebSocket for order status updates
4. **Order History**: Create customer dashboard
5. **Admin Panel**: Build interface for restaurant staff
6. **Email Notifications**: Send order confirmations via SendGrid
7. **SMS Notifications**: Send updates via Twilio

---

## Common Commands

```powershell
# Install dependencies
npm install

# Start backend dev server
cd apps/backend; npm run dev

# Start frontend dev server
cd apps/web; npm run dev

# Build for production
cd apps/web; npm run build

# Run Docker
docker-compose up --build

# Stop Docker
docker-compose down
```

---

## Troubleshooting

**Cart not updating?**
- Check Redux DevTools extension
- Verify store configuration includes cartSlice

**API calls failing?**
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify Vite proxy settings in vite.config.js

**Order not submitting?**
- Check browser console for errors
- Verify all required fields are filled
- Check backend logs for validation errors

**Docker issues?**
- See DOCKER_SETUP_GUIDE.md
- Check TROUBLESHOOTING.md

---

## Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
