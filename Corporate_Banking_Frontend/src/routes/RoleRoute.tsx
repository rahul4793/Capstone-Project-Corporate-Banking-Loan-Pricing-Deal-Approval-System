import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

type Props = {
  allowedRoles: string[];
};

export default function RoleRoute({ allowedRoles }: Props) {
  const role = useAppSelector((state) => state.auth.role);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/deals" replace />;
  }

  return <Outlet />;
}
