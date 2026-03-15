import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuService } from '../../services/menuService';

// Initial state
const initialState = {
    menuItems: [],
    selectedMenuItem: null,
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
            return rejectWithValue(error.message || 'Failed to fetch menu item by ID');
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

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedMenuItem: (state) => {
            state.selectedMenuItem = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.loading = false;
                state.menuItems = action.payload;
                state.error = null;
            })
            .addCase(fetchMenuItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMenuItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMenuItem = action.payload;
                state.error = null;
            })
            .addCase(fetchMenuItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMenuItem.fulfilled, (state, action) => {
                state.loading = false;
                state.menuItems.push(action.payload);
                state.error = null;
            })
            .addCase(createMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMenuItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.menuItems.findIndex((menuItem) => menuItem.id === action.payload.id);
                if (index !== -1) {
                    state.menuItems[index] = action.payload;
                }
                if (state.selectedMenuItem?.id === action.payload.id) {
                    state.selectedMenuItem = action.payload;
                }
                state.error = null;
            })
            .addCase(updateMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMenuItem.fulfilled, (state, action) => {
                state.loading = false;
                state.menuItems = state.menuItems.filter((menuItem) => menuItem.id !== action.payload);
                if (state.selectedMenuItem?.id === action.payload) {
                    state.selectedMenuItem = null;
                }
                state.error = null;
            })
            .addCase(deleteMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSelectedMenuItem } = menuSlice.actions;
export default menuSlice.reducer;