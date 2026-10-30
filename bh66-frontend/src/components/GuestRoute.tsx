import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function GuestRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={user?.is_staff ? "/admin" : "/client"} replace />;
  }

  return <Outlet />;
}
