import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuService } from '../../services/menuService';

// Initial state
const initialState = {
    menuItems: [],
    selectedMenu: null,
    loading: false,
    error: null,
};

// Async thunks for API calls
export const fetchMenuItems = createAsyncThunk(
    'menu/fetchMenuItems',
    async (_, { rejectWithValue }) => {
        try {
            const data = await menuService.getAllMenus();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch menu items');
    }
    }
);

export const fetchMenuById = createAsyncThunk(
    'menu/fetchMenuById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await menuService.getMenuById(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch menu item by ID');
    }
    }
);

export const createMenu = createAsyncThunk(
    'menu/createMenu',
    async (menuItemData, { rejectWithValue }) => {
        try {
            const data = await menuService.createMenu(menuItemData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create menu item');
    }
    }
);

export const updateMenu = createAsyncThunk(
    'menu/updateMenu',
    async ({ id, menuItemData }, { rejectWithValue }) => {
        try {
            const data = await menuService.updateMenu(id, menuItemData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update menu item');
    }
    }
);

export const deleteMenu = createAsyncThunk(
    'menu/deleteMenu',
    async (id, { rejectWithValue }) => {
        try {
            await menuService.deleteMenu(id);
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
        clearSelectedMenu: (state) => {
            state.selectedMenu = null;
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
            .addCase(fetchMenuById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMenu = action.payload;
                state.error = null;
            })
            .addCase(fetchMenuById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.menuItems.push(action.payload);
                state.error = null;
            })
            .addCase(createMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMenu.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.menuItems.findIndex((menuItem) => menuItem.id === action.payload.id);
                if (index !== -1) {
                    state.menuItems[index] = action.payload;
                }
                if (state.selectedMenu?.id === action.payload.id) {
                    state.selectedMenu = action.payload;
                }
                state.error = null;
            })
            .addCase(updateMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.menuItems = state.menuItems.filter((menuItem) => menuItem.id !== action.payload);
                if (state.selectedMenu?.id === action.payload) {
                    state.selectedMenu = null;
                }
                state.error = null;
            })
            .addCase(deleteMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSelectedMenu } = menuSlice.actions;
export default menuSlice.reducer;