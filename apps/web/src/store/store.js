import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./slices/menuSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    cart: cartReducer,
  },
});
