import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import menuReducer, {
  fetchMenuItems,
  createMenu,
} from "../store/slices/menuSlice";
import cartReducer from "../store/slices/cartSlice";
import Menu from "../pages/Menu";

// Mock the menuService
vi.mock("../services/menuService", () => ({
  menuService: {
    getAllMenus: vi.fn(),
    createMenu: vi.fn(),
  },
}));

import { menuService } from "../services/menuService";

describe("Menu Component", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        menu: menuReducer,
        cart: cartReducer,
      },
    });
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    menuService.getAllMenus.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Menu />
        </Provider>
      </MemoryRouter>,
      <Provider store={store}>
        <Menu />
      </Provider>,
    );

    expect(screen.getByText(/Loading menu items/i)).toBeInTheDocument();
  });

  it("should display menu items when loaded", async () => {
    const mockMenuItems = [
      {
        id: 1,
        name: "Spam Musubi",
        price: 4.99,
        description: "Hawaiian classic",
      },
      { id: 2, name: "Poke Bowl", price: 12.99, description: "Fresh ahi tuna" },
    ];

    menuService.getAllMenus.mockResolvedValue(mockMenuItems);

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Menu />
        </Provider>
      </MemoryRouter>,
      <Provider store={store}>
        <Menu />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Spam Musubi")).toBeInTheDocument();
      expect(screen.getByText("Poke Bowl")).toBeInTheDocument();
    });
  });

  it("should display error message when fetch fails", async () => {
    menuService.getAllMenus.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Menu />
        </Provider>
      </MemoryRouter>,
      <Provider store={store}>
        <Menu />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it("should display message when no menu items are available", async () => {
    menuService.getAllMenus.mockResolvedValue([]);

render(
      <MemoryRouter>
        <Provider store={store}>
          <Menu />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No menu items available/i)).toBeInTheDocument();
    });
  });
});

describe("Menu Slice Redux", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        menu: menuReducer,
        cart: cartReducer,
      },
    });
    vi.clearAllMocks();
  });

  it("should handle fetchMenuItems pending state", () => {
    store.dispatch(fetchMenuItems.pending());
    const state = store.getState().menu;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle fetchMenuItems fulfilled state", () => {
    const mockMenuItems = [{ id: 1, name: "Spam Musubi", price: 4.99 }];
    store.dispatch(fetchMenuItems.fulfilled(mockMenuItems));
    const state = store.getState().menu;
    expect(state.loading).toBe(false);
    expect(state.menuItems).toEqual(mockMenuItems);
  });

  it("should handle createMenu and add to state", async () => {
    const newMenuItem = {
      name: "Malasada",
      price: 3.5,
      description: "Portuguese-style fried dough",
    };

    const createdMenuItem = { id: 3, ...newMenuItem };
    menuService.createMenu.mockResolvedValue(createdMenuItem);

    await store.dispatch(createMenu(newMenuItem));
    const state = store.getState().menu;

    expect(state.menuItems).toContainEqual(createdMenuItem);
  });
});
