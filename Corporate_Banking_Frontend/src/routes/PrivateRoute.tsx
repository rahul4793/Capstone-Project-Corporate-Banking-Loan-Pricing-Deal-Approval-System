import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function PrivateRoute() {
  const token = useAppSelector((state) => state.auth.token);
  const active = useAppSelector((state) => state.auth.active);

  // not logged in OR deactivated
  if (!token || !active) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
