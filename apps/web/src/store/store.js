import { configureStore } from '@reduxjs/toolkit';
import snackReducer from './slices/snackSlice';

export const store = configureStore({
  reducer: {
    menuitems: snackReducer,
  },
});

