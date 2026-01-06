import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { role, username } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* LEFT: PORTAL + USER */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {role === "ADMIN" ? "Admin Portal" : "User Portal"}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              · {username}
            </Typography>
          </Box>
        </Box>

        {/* RIGHT: NAV LINKS */}
        <Button color="inherit" onClick={() => navigate("/deals")}>
          Deals
        </Button>

        <Button color="inherit" onClick={() => navigate("/pipeline")}>
          Pipeline
        </Button>

        {role === "ADMIN" && (
          <Button
            color="inherit"
            onClick={() => navigate("/admin/users")}
          >
            User Management
          </Button>
        )}

        {/* LOGOUT */}
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{ ml: 2, fontWeight: 500 }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
