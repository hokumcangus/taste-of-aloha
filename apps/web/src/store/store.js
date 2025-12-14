import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './slices/MenuSlice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

