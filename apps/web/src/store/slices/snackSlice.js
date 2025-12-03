import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { snackService } from '../../services/snackService';

// Initial state
const initialState = {
  snacks: [],
  selectedSnack: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchSnacks = createAsyncThunk(
  'snacks/fetchSnacks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await snackService.getAllSnacks();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch snacks');
    }
  }
);

export const fetchSnackById = createAsyncThunk(
  'snacks/fetchSnackById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await snackService.getSnackById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch snack');
    }
  }
);

export const createSnack = createAsyncThunk(
  'snacks/createSnack',
  async (snackData, { rejectWithValue }) => {
    try {
      const data = await snackService.createSnack(snackData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create snack');
    }
  }
);

export const updateSnack = createAsyncThunk(
  'snacks/updateSnack',
  async ({ id, snackData }, { rejectWithValue }) => {
    try {
      const data = await snackService.updateSnack(id, snackData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update snack');
    }
  }
);

export const deleteSnack = createAsyncThunk(
  'snacks/deleteSnack',
  async (id, { rejectWithValue }) => {
    try {
      await snackService.deleteSnack(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete snack');
    }
  }
);

// Slice
const snackSlice = createSlice({
  name: 'snacks',
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
    // Fetch all snacks
    builder
      .addCase(fetchSnacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnacks.fulfilled, (state, action) => {
        state.loading = false;
        state.snacks = action.payload;
        state.error = null;
      })
      .addCase(fetchSnacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch snack by ID
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

    // Create snack
    builder
      .addCase(createSnack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSnack.fulfilled, (state, action) => {
        state.loading = false;
        state.snacks.push(action.payload);
        state.error = null;
      })
      .addCase(createSnack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update snack
    builder
      .addCase(updateSnack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSnack.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.snacks.findIndex((snack) => snack.id === action.payload.id);
        if (index !== -1) {
          state.snacks[index] = action.payload;
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

    // Delete snack
    builder
      .addCase(deleteSnack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSnack.fulfilled, (state, action) => {
        state.loading = false;
        state.snacks = state.snacks.filter((snack) => snack.id !== action.payload);
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

