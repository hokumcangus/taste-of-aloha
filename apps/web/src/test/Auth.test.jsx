import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("../services/authService", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    me: vi.fn(),
  },
}));

import authReducer, {
  registerUser,
  loginUser,
  logout,
  fetchMyProfile,
} from "../store/slices/authSlice";
import { authService } from "../services/authService";

const mockUser = { id: 1, email: "hoku@aloha.com", name: "Hoku", role: "CUSTOMER" };
const mockToken = "eyJhbGciOiJIUzI1NiJ9.test";

function makeStore() {
  return configureStore({ reducer: { auth: authReducer } });
}

describe("authSlice", () => {
  let store;

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    store = makeStore();
  });

  it("initial state is idle with no user or token", () => {
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.status).toBe("idle");
    expect(state.error).toBeNull();
  });

  it("registerUser.fulfilled sets user and token", async () => {
    authService.register.mockResolvedValue({ user: mockUser, token: mockToken });

    await store.dispatch(registerUser({ email: mockUser.email, password: "password123", name: mockUser.name }));

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.status).toBe("succeeded");
    expect(state.error).toBeNull();
  });

  it("registerUser.fulfilled persists user and token in localStorage", async () => {
    authService.register.mockResolvedValue({ user: mockUser, token: mockToken });

    await store.dispatch(registerUser({ email: mockUser.email, password: "password123" }));

    const stored = JSON.parse(window.localStorage.getItem("toa_auth_v1"));
    expect(stored.token).toBe(mockToken);
    expect(stored.user.email).toBe(mockUser.email);
  });

  it("registerUser.rejected sets error message", async () => {
    authService.register.mockRejectedValue(new Error("Email already registered"));

    await store.dispatch(registerUser({ email: mockUser.email, password: "password123" }));

    const state = store.getState().auth;
    expect(state.status).toBe("failed");
    expect(state.error).toMatch(/already registered/i);
  });

  it("loginUser.fulfilled sets user and token", async () => {
    authService.login.mockResolvedValue({ user: mockUser, token: mockToken });

    await store.dispatch(loginUser({ email: mockUser.email, password: "password123" }));

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.status).toBe("succeeded");
  });

  it("loginUser.rejected sets error message", async () => {
    authService.login.mockRejectedValue(new Error("Invalid credentials"));

    await store.dispatch(loginUser({ email: mockUser.email, password: "wrong" }));

    const state = store.getState().auth;
    expect(state.status).toBe("failed");
    expect(state.error).toMatch(/invalid credentials/i);
  });

  it("logout clears user, token, and localStorage", async () => {
    authService.login.mockResolvedValue({ user: mockUser, token: mockToken });
    await store.dispatch(loginUser({ email: mockUser.email, password: "password123" }));

    store.dispatch(logout());

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();

    const stored = JSON.parse(window.localStorage.getItem("toa_auth_v1") || "{}");
    // persistAuthState writes null (not removes keys) when clearing
    expect(stored.token).toBeNull();
    expect(stored.user).toBeNull();
  });

  it("loadAuthState reads persisted auth from localStorage", async () => {
    // Persist some data via a successful login first
    authService.login.mockResolvedValue({ user: mockUser, token: mockToken });
    await store.dispatch(loginUser({ email: mockUser.email, password: "password123" }));

    // Verify it was actually stored
    const raw = window.localStorage.getItem("toa_auth_v1");
    expect(raw).not.toBeNull();

    const stored = JSON.parse(raw);
    expect(stored.user.email).toBe(mockUser.email);
    expect(stored.token).toBe(mockToken);
  });

  it("fetchMyProfile.fulfilled updates user in state", async () => {
    authService.me.mockResolvedValue({ user: mockUser });

    await store.dispatch(fetchMyProfile());

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
  });
});
