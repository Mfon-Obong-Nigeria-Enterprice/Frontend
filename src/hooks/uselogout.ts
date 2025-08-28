import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// stores
import { useAuthStore } from "@/stores/useAuthStore";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      logout();
      navigate("/");

      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      logout();
      queryClient.clear();
    },
  });
};
