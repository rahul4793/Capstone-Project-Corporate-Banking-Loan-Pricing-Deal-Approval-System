import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Login from "../features/auth/Login";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginUser } from "../features/auth/authSlice";
import { BrowserRouter } from "react-router-dom";

// 🔹 Mock navigation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderLogin = (authState?: any) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        token: null,
        username: null,
        role: null,
        active: false,
        loading: false,
        error: null,
        ...authState,
      },
    },
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  return store;
};

describe("Login component", () => {
  it("renders login form", () => {
    renderLogin();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it("dispatches loginUser on submit", async () => {
    const store = renderLogin();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "user1" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "pass1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const actions = store.getState().auth.loading;
      expect(actions).toBe(true);
    });
  });

  it("shows role mismatch error", async () => {
    renderLogin({
      token: "token",
      role: "ADMIN",
    });

    expect(
      await screen.findByText(/not authorized to login as user/i)
    ).toBeInTheDocument();
  });
});
