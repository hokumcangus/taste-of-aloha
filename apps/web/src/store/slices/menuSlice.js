import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuService } from '../../services/menuService';

// Initial state
const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, { rejectWithValue }) => {
    try {
      const data = await menuService.getAllMenuItems();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch menu items');
    }
  }
);

export const fetchMenuItemById = createAsyncThunk(
  'menu/fetchMenuItemById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await menuService.getMenuItemById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch menu item');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async (menuItemData, { rejectWithValue }) => {
    try {
      const data = await menuService.createMenuItem(menuItemData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create menu item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, menuItemData }, { rejectWithValue }) => {
    try {
      const data = await menuService.updateMenuItem(id, menuItemData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update menu item');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      await menuService.deleteMenuItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete menu item');
    }
  }
);

// Slice
const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all menu items
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch menu item by ID
    builder
      .addCase(fetchMenuItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create menu item
    builder
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update menu item
    builder
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?.id === action.payload.id) {
          state.selectedItem = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete menu item
    builder
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
        state.error = null;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedItem } = menuSlice.actions;
export default menuSlice.reducer;

