import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../../services/cartService";

const CART_STORAGE_KEY = "toa_cart_v1";

function getDefaultState() {
  return {
    cartId: null,
    items: [],
    itemCount: 0,
    total: 0,
    syncStatus: "idle",
    error: null,
    syncedAt: null,
  };
}

function computeTotals(items) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = Number(
    items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toFixed(2),
  );

  return { itemCount, total };
}

function persistCartState(state) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    cartId: state.cartId,
    items: state.items,
    itemCount: state.itemCount,
    total: state.total,
    syncedAt: state.syncedAt,
  };

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
}

function loadCartState() {
  if (typeof window === "undefined") {
    return getDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return getDefaultState();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) {
      return getDefaultState();
    }

    const normalizedItems = parsed.items
      .filter((item) => item && item.menuId)
      .map((item) => ({
        menuId: Number(item.menuId),
        name: item.name || "Menu Item",
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));

    const totals = computeTotals(normalizedItems);

    return {
      ...getDefaultState(),
      cartId: parsed.cartId || null,
      items: normalizedItems,
      itemCount: totals.itemCount,
      total: totals.total,
      syncedAt: parsed.syncedAt || null,
    };
  } catch {
    return getDefaultState();
  }
}

function recalculateAndPersist(state) {
  const totals = computeTotals(state.items);
  state.itemCount = totals.itemCount;
  state.total = totals.total;
  persistCartState(state);
}

export const syncCartToBackend = createAsyncThunk(
  "cart/syncCartToBackend",
  async (_, { getState, rejectWithValue }) => {
    const cartState = getState().cart;
    const itemsPayload = cartState.items.map((item) => ({
      menuId: item.menuId,
      quantity: item.quantity,
    }));

    try {
      if (cartState.cartId) {
        const updated = await cartService.updateCart(cartState.cartId, {
          items: itemsPayload,
        });

        return {
          cartId: updated.id,
          syncedAt: new Date().toISOString(),
        };
      }

      const created = await cartService.createCart({
        items: itemsPayload,
      });

      return {
        cartId: created.id,
        syncedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to sync cart");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartState(),
  reducers: {
    addToCart: (state, action) => {
      const menuItem = action.payload;
      const menuId = Number(menuItem.id);

      if (!menuId) {
        return;
      }

      const existing = state.items.find((item) => item.menuId === menuId);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          menuId,
          name: menuItem.name || "Menu Item",
          price: Number(menuItem.price) || 0,
          quantity: 1,
        });
      }

      recalculateAndPersist(state);
    },
    setItemQuantity: (state, action) => {
      const menuId = Number(action.payload.menuId);
      const quantity = Number(action.payload.quantity);

      const existing = state.items.find((item) => item.menuId === menuId);

      if (!existing) {
        return;
      }

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.menuId !== menuId);
      } else {
        existing.quantity = Math.floor(quantity);
      }

      recalculateAndPersist(state);
    },
    removeFromCart: (state, action) => {
      const menuId = Number(action.payload);
      state.items = state.items.filter((item) => item.menuId !== menuId);
      recalculateAndPersist(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      state.error = null;
      state.syncedAt = null;
      persistCartState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartToBackend.pending, (state) => {
        state.syncStatus = "loading";
        state.error = null;
      })
      .addCase(syncCartToBackend.fulfilled, (state, action) => {
        state.syncStatus = "succeeded";
        state.cartId = action.payload.cartId;
        state.syncedAt = action.payload.syncedAt;
        state.error = null;
        persistCartState(state);
      })
      .addCase(syncCartToBackend.rejected, (state, action) => {
        state.syncStatus = "failed";
        state.error = action.payload || "Failed to sync cart";
      });
  },
});

export const { addToCart, setItemQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
