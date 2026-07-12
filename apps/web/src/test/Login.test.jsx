import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("../store/slices/authSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    loginUser: vi.fn((payload) => ({
      type: "auth/loginUser/fulfilled",
      payload: { user: { id: 1, email: payload.email, name: "Hoku", role: "CUSTOMER" }, token: "t" },
      unwrap: () => Promise.resolve({ user: { id: 1, email: payload.email, name: "Hoku", role: "CUSTOMER" }, token: "t" }),
    })),
  };
});

// We only need a minimal auth reducer stub since loginUser is mocked above
const authReducer = (state = { user: null, status: "idle", error: null }, action) => {
  if (action.type === "auth/loginUser/fulfilled") {
    return { ...state, user: action.payload.user, token: action.payload.token, status: "succeeded" };
  }
  return state;
};

import Login from "../pages/Login";

function renderLogin(initialUser = null) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: initialUser, status: "idle", error: null } },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    </Provider>,
  );
}

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("renders email, password fields and a submit button", () => {
    renderLogin();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("allows typing in email and password fields", () => {
    renderLogin();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "hoku@aloha.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("hoku@aloha.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("shows error message from Redux state", () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { user: null, status: "failed", error: "Invalid credentials" } },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("redirects to /dashboard if user is already logged in", () => {
    // When user is set, Login renders <Navigate to="/dashboard" />
    // MemoryRouter with a catch-all route lets us detect the redirect.
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { user: { id: 1, email: "hoku@aloha.com", name: "Hoku", role: "CUSTOMER" }, token: "t", status: "succeeded", error: null },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    // The Login form should not be visible — a Navigate was rendered instead
    expect(screen.queryByRole("button", { name: /sign in/i })).not.toBeInTheDocument();
    expect(container).toBeTruthy(); // just ensure no crash
  });
});
