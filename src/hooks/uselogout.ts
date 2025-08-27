import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const { logout: logoutStore } = useAuthStore();
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

  // const logout = async () => {
  //   try {
  //     await logoutStore();
  //     // Navigate to login page after clearing auth state
  //     navigate("/", { replace: true });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     // Even if logout fails, still navigate to login
  //     navigate("/", { replace: true });
  //   }
  // };

  // return { logout };
};

// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "@/stores/useAuthStore";

// export const useLogout = () => {
//   const navigate = useNavigate();
//   const { logout: logoutStore } = useAuthStore();

//   const logout = async () => {
//     try {
//       await logoutStore();
//       // Navigate to login page after clearing auth state
//       navigate("/", { replace: true });
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Even if logout fails, still navigate to login
//       navigate("/", { replace: true });
//     }
//   };

//   return { logout };
// };
