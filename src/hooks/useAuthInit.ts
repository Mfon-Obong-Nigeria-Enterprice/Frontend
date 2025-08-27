// import { useAuthStore } from "@/stores/useAuthStore";
// import { useQuery } from "@tanstack/react-query";

// // Query to fetch current user (useful for app initialization)
// export const useUser = () => {
//   const { user, logout, loading, login } = useAuthStore();

//   return useQuery({
//     queryKey: ["user"],
//     queryFn: async () => {
//       await login();
//       return useAuthStore.getState().user;
//     },
//     enabled: !user && !loading, // Only fetch if we don't have user data
//     retry: false,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     onError: () => {
//       logout();
//     },
//   });
// };

// // import { useEffect } from "react";
// // import { useAuthStore } from "@/stores/useAuthStore";

// // export const useAuthInit = () => {
// //   const { initializeAuth, isInitialized } = useAuthStore();

// //   useEffect(() => {
// //     initializeAuth();
// //   }, [initializeAuth]);

// //   return isInitialized;
// // };
