import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setupInterceptors } from "@/services/baseApi";

export default function RootInterceptorLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return <Outlet />; // renders nested routes
}
