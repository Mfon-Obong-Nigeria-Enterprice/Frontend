import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuthInit = () => {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return isInitialized;
};
