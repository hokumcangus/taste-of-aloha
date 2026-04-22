import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("../services/cartService", () => ({
  cartService: {
    createCart: vi.fn(),
    updateCart: vi.fn(),
  },
}));

import cartReducer, {
  addToCart,
  clearCart,
  removeFromCart,
  setItemQuantity,
  syncCartToBackend,
} from "../store/slices/cartSlice";
import { cartService } from "../services/cartService";

describe("Cart Slice", () => {
  let store;

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  it("adds items and computes totals", () => {
    store.dispatch(addToCart({ id: 1, name: "Spam Musubi", price: 4.5 }));
    store.dispatch(addToCart({ id: 1, name: "Spam Musubi", price: 4.5 }));

    const state = store.getState().cart;

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.itemCount).toBe(2);
    expect(state.total).toBe(9);
  });

  it("updates item quantity and removes item", () => {
    store.dispatch(addToCart({ id: 2, name: "Poke Bowl", price: 12 }));
    store.dispatch(setItemQuantity({ menuId: 2, quantity: 3 }));

    let state = store.getState().cart;
    expect(state.itemCount).toBe(3);
    expect(state.total).toBe(36);

    store.dispatch(removeFromCart(2));
    state = store.getState().cart;
    expect(state.items).toHaveLength(0);
    expect(state.itemCount).toBe(0);
    expect(state.total).toBe(0);
  });

  it("clears cart", () => {
    store.dispatch(addToCart({ id: 3, name: "Loco Moco", price: 14 }));
    store.dispatch(clearCart());

    const state = store.getState().cart;
    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.itemCount).toBe(0);
  });

  it("syncs cart to backend and stores cartId", async () => {
    store.dispatch(addToCart({ id: 7, name: "Shave Ice", price: 6 }));

    cartService.createCart.mockResolvedValue({ id: 101 });

    await store.dispatch(syncCartToBackend());

    const state = store.getState().cart;
    expect(cartService.createCart).toHaveBeenCalledWith({
      items: [{ menuId: 7, quantity: 1 }],
    });
    expect(state.cartId).toBe(101);
    expect(state.syncStatus).toBe("succeeded");
  });
});
