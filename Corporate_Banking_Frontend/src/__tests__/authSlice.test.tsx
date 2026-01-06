import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, {
  logout,
  loginUser,
  AuthState,
} from "../features/auth/authSlice";
import axiosInstance from "../api/axiosInstance";

// 🔹 MOCK axios
vi.mock("../api/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("authSlice", () => {
  const initialState: AuthState = {
    token: null,
    username: null,
    role: null,
    active: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should return initial state", () => {
    const state = authReducer(undefined, { type: "unknown" });
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should handle logout", () => {
    const loggedInState: AuthState = {
      token: "token",
      username: "tejashree",
      role: "ADMIN",
      active: true,
      loading: false,
      error: null,
    };

    const state = authReducer(loggedInState, logout());

    expect(state.token).toBeNull();
    expect(state.username).toBeNull();
    expect(state.role).toBeNull();
    expect(state.active).toBe(false);
  });

  it("should handle loginUser.pending", () => {
    const state = authReducer(
      initialState,
      loginUser.pending("", { username: "u", password: "p" })
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should handle loginUser.fulfilled", () => {
    const payload = {
      token: "jwt-token",
      username: "tejashree",
      role: "USER",
      active: true,
    };

    const state = authReducer(
      initialState,
      loginUser.fulfilled(payload, "", { username: "u", password: "p" })
    );

    expect(state.loading).toBe(false);
    expect(state.token).toBe("jwt-token");
    expect(state.username).toBe("tejashree");
    expect(state.role).toBe("USER");
    expect(state.active).toBe(true);
  });

  it("should handle loginUser.rejected", () => {
    const state = authReducer(
      initialState,
      loginUser.rejected(
        null,
        "",
        { username: "u", password: "p" },
        "Invalid username or password"
      )
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Invalid username or password");
  });
});
