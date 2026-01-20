import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export interface AuthState {
  token: string | null;
  username: string | null;
  role: "USER" | "ADMIN" | null;
  active: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  role: localStorage.getItem("role") as AuthState["role"],
  active: localStorage.getItem("active") === "true",
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    data: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
            // const res = await axiosInstance.post("/auth/login", data);

      return res.data; // must contain token, username, role
    } catch {
      return rejectWithValue("Invalid username or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      state.role = null;
      state.active = false;

      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("active");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.active = action.payload.active;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem("role", action.payload.role);
        localStorage.setItem("active", String(action.payload.active));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
