import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { snackService } from '../../services/snackService';

// Initial state
const initialState = {
  menuitems: [],
  selectedSnack: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchSnacks = createAsyncThunk(
  'menuitems/fetchSnacks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await snackService.getAllSnacks();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch menuitems');
    }
  }
);

export const fetchSnackById = createAsyncThunk(
  'menuitems/fetchSnackById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await snackService.getSnackById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch menuitem');
    }
  }
);

export const createSnack = createAsyncThunk(
  'menuitems/createSnack',
  async (snackData, { rejectWithValue }) => {
    try {
      const data = await snackService.createSnack(snackData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create menuitem');
    }
  }
);

export const updateSnack = createAsyncThunk(
  'menuitems/updateSnack',
  async ({ id, snackData }, { rejectWithValue }) => {
    try {
      const data = await snackService.updateSnack(id, snackData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update menuitem');
    }
  }
);

export const deleteSnack = createAsyncThunk(
  'menuitems/deleteSnack',
  async (id, { rejectWithValue }) => {
    try {
      await snackService.deleteSnack(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete menuitem');
    }
  }
);

// Slice
const snackSlice = createSlice({
  name: 'menuitems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSnack: (state) => {
      state.selectedSnack = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all menuitems
    builder
      .addCase(fetchSnacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnacks.fulfilled, (state, action) => {
        state.loading = false;
        state.menuitems = action.payload;
        state.error = null;
      })
      .addCase(fetchSnacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch menuitem by ID
    builder
      .addCase(fetchSnackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnackById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSnack = action.payload;
        state.error = null;
      })
      .addCase(fetchSnackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create menuitem
    builder
      .addCase(createSnack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSnack.fulfilled, (state, action) => {
        state.loading = false;
        state.menuitems.push(action.payload);
        state.error = null;
      })
      .addCase(createSnack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update menuitem
    builder
      .addCase(updateSnack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSnack.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.menuitems.findIndex((menuitem) => menuitem.id === action.payload.id);
        if (index !== -1) {
          state.menuitems[index] = action.payload;
        }
        if (state.selectedSnack?.id === action.payload.id) {
          state.selectedSnack = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSnack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete menuitem
    builder
      .addCase(deleteSnack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSnack.fulfilled, (state, action) => {
        state.loading = false;
        state.menuitems = state.menuitems.filter((menuitem) => menuitem.id !== action.payload);
        if (state.selectedSnack?.id === action.payload) {
          state.selectedSnack = null;
        }
        state.error = null;
      })
      .addCase(deleteSnack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedSnack } = snackSlice.actions;
export default snackSlice.reducer;

