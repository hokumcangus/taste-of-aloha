import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

const AUTH_STORAGE_KEY = "toa_auth_v1";

function getDefaultState() {
  return {
    user: null,
    token: null,
    status: "idle",
    error: null,
  };
}

function persistAuthState(state) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    user: state.user,
    token: state.token,
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

function loadAuthState() {
  if (typeof window === "undefined") {
    return getDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return getDefaultState();
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) {
      return getDefaultState();
    }

    return {
      ...getDefaultState(),
      user: parsed.user,
      token: parsed.token,
    };
  } catch {
    return getDefaultState();
  }
}

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.register(payload);
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  },
);

export const fetchMyProfile = createAsyncThunk(
  "auth/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.me();
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      persistAuthState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        persistAuthState(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        persistAuthState(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        persistAuthState(state);
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch profile";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
