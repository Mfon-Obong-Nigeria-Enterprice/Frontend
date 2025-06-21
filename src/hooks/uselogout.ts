import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: logoutStore } = useAuthStore();

  const logout = async () => {
    try {
      await logoutStore();
      // Navigate to login page after clearing auth state
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, still navigate to login
      navigate("/", { replace: true });
    }
  };

  return { logout };
};
