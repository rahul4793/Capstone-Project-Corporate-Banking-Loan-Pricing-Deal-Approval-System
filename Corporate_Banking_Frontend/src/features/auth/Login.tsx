import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser, logout } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

/* ================= VALIDATION SCHEMA ================= */
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, role, loading, error } = useAppSelector(
    (state) => state.auth
  );

  // 🔹 UI-selected login type
  const [loginType, setLoginType] = useState<"USER" | "ADMIN">("USER");
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setLocalError(null);
    dispatch(loginUser(data));
  };

  // ✅ ROLE VALIDATION AFTER LOGIN
  useEffect(() => {
    if (token && role) {
      if (role !== loginType) {
        // ❌ Role mismatch → force logout
        dispatch(logout());
        setLocalError(
          loginType === "ADMIN"
            ? "You are not authorized to login as Admin"
            : "You are not authorized to login as User"
        );
        return;
      }

      // ✅ Role matches → allow login
      navigate("/deals", { replace: true });
    }
  }, [token, role, loginType, dispatch, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F6F8",
      }}
    >
      <Paper elevation={4} sx={{ width: 400, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Rahul Deal Pipeline Portal
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mb={2}
        >
          {loginType === "ADMIN" ? "Admin Login" : "User Login"}
        </Typography>

        {/* 🔹 LOGIN TYPE TOGGLE */}
        <ToggleButtonGroup
          fullWidth
          exclusive
          value={loginType}
          onChange={(_, value) => value && setLoginType(value)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="USER">User</ToggleButton>
          <ToggleButton value="ADMIN">Admin</ToggleButton>
        </ToggleButtonGroup>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError || error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
