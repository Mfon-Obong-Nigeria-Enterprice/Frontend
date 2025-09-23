// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import SessionTimeout from "@/features/dashboard/admin/components/Sessiontimeout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("SUPER_ADMIN" | "MAINTAINER" | "ADMIN" | "STAFF")[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/",
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user.role)) {
  
    switch (user.role) {
      case "SUPER_ADMIN":
        return <Navigate to="/manager/dashboard" replace />;
      case "MAINTAINER":
        return <Navigate to="/maintainer/dashboard" replace />;
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "STAFF":
        return <Navigate to="/staff/dashboard" replace />;
      default:
        return <Navigate to={redirectTo} replace />;
    }
  }

  return (
    <>
      <SessionTimeout />
      {children}
    </>
  );
};

export default ProtectedRoute;