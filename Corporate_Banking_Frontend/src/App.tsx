import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/Login";
import DealList from "./features/deals/DealList";
import DealKanban from "./features/deals/DealKanban";
import AdminUsers from "./features/admin/AdminUsers";
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= AUTHENTICATED ================= */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* USER + ADMIN */}
          <Route path="/deals" element={<DealList />} />
          <Route path="/pipeline" element={<DealKanban />} />

          {/* ADMIN ONLY */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      {/* ================= DEFAULT ================= */}
      <Route path="/" element={<Navigate to="/deals" replace />} />
      <Route path="*" element={<Navigate to="/deals" replace />} />
    </Routes>
  );
}
