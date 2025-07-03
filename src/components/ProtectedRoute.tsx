// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("SUPER_ADMIN" | "ADMIN" | "STAFF")[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case "SUPER_ADMIN":
        return <Navigate to="/manager/dashboard" replace />;
      case "ADMIN":
        return (
          <Navigate
            to={user.isSetupComplete ? "/admin/dashboard" : "/admin/setup"}
            replace
          />
        );
      case "STAFF":
        return <Navigate to="/staff/dashboard" replace />;
      default:
        return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
