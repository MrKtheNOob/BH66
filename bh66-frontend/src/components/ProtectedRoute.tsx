import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  allowedRole: "admin" | "client";
};

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.is_staff ? "admin" : "client";

  if (role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/client"} replace />;
  }

  return <Outlet />;
}
