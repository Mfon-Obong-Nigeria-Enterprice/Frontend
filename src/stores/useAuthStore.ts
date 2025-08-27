import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { type LoginUser } from "@/types/types";
import * as authService from "@/services/authService";

type AuthState = {
  user: LoginUser | null;
  // accessToken: string | null; // short-lived, in-memory only
  isAuthenticated: boolean;
  loading: boolean;
  // isInitialized: boolean;

  // setAccessToken: (token: string | null) => void;
  setUser: (user: LoginUser | null) => void;
  login: (email: string, password: string) => Promise<LoginUser>;
  logout: () => Promise<void>;
  // initializeAuth: () => Promise<void>;
  updateUser: (updates: Partial<LoginUser>) => void;
};

// let isLoggingOut = false;

export const useAuthStore = create<AuthState>()(
  // persist(
  (set) => ({
    user: null,
    // accessToken: null,
    isAuthenticated: false,
    loading: false,
    // isInitialized: false,

    // setAccessToken: (token) => set({ accessToken: token }),
    setUser: (user) => set({ user, isAuthenticated: !!user }),

    login: async (email, password) => {
      set({ loading: true });
      try {
        const { user } = await authService.login(email, password);

        set({
          user,
          // accessToken,
          isAuthenticated: true,
          loading: false,
        });
        return user;
      } catch (error) {
        console.error("Login failed", error);
        set({ loading: false });
        throw error;
      }
    },

    updateUser: (updates) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }));
    },

    logout: async () => {
      // if (isLoggingOut) return;
      // isLoggingOut = true;

      try {
        await authService.logout();
      } catch {
        console.warn("Logout request failed, clearing store anyway.");
      } finally {
        set({
          user: null,
          // accessToken: null,
          isAuthenticated: false,
        });
        // isLoggingOut = false;
      }
    },

    // initializeAuth: async () => {
    //   try {
    //     const { accessToken, user } = await authService.refreshToken();
    //     // 👆 backend reads refresh cookie, returns new access token + user
    //     set({
    //       user,
    //       accessToken,
    //       isAuthenticated: true,
    //       isInitialized: true,
    //     });
    //   } catch (err) {
    //     console.error("Failed to refresh on init:", err);
    //     set({
    //       user: null,
    //       accessToken: null,
    //       isAuthenticated: false,
    //       isInitialized: true,
    //     });
    //   }
    // },
  })
  // {
  //   name: "auth-store",
  //   partialize: (state) => ({
  //     user: state.user, // persist user ONLY (no refreshToken)
  //   }),
  // }
  // )
);

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { type User } from "@/types/types";
// import * as authService from "@/services/authService";

// type AuthState = {
//   user: User | null;
//   accessToken: string | null; // in-memory only
//   refreshToken: string | null; // persisted
//   isAuthenticated: boolean;
//   loading: boolean;
//   isInitialized: boolean;

//   setAccessToken: (token: string | null) => void;
//   setUser: (user: User | null) => void;
//   login: (email: string, password: string) => Promise<User>;
//   logout: () => Promise<void>;
//   initializeAuth: () => Promise<void>;
//   updateUser: (updates: Partial<User>) => void;
// };

// // global guard to prevent infinite logout loops
// let isLoggingOut = false;

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//       loading: false,
//       isInitialized: false,

//       setAccessToken: (token) => set({ accessToken: token }),
//       setUser: (user) => set({ user, isAuthenticated: !!user }),

//       login: async (email, password) => {
//         set({ loading: true });
//         try {
//           const { accessToken, user } = await authService.login(
//             email,
//             password
//           );

//           set({
//             user,
//             accessToken,
//             isAuthenticated: true,
//             loading: false,
//           });
//           return user;
//         } catch (error) {
//           console.error("Login failed", error);
//           set({ loading: false });
//           throw error;
//         }
//       },
//       updateUser: (updates) => {
//         console.log("Updating user with:", updates);
//         set((state) => {
//           const updatedUser = state.user ? { ...state.user, ...updates } : null;
//           console.log("Updated user object:", updatedUser);
//           return { user: updatedUser };
//         });
//       },

//       logout: async () => {
//         if (isLoggingOut) return; // prevent recursion
//         isLoggingOut = true;

//         try {
//           await authService.logout();
//         } catch {
//           console.warn("Logout request failed, clearing store anyway.");
//         } finally {
//           set({
//             user: null,
//             accessToken: null,
//             refreshToken: null,
//             isAuthenticated: false,
//           });
//           isLoggingOut = false;
//         }
//       },

//       initializeAuth: async () => {
//         const { refreshToken } = get();

//         if (!refreshToken) {
//           set({ isInitialized: true });
//           return;
//         }

//         try {
//           const {
//             accessToken,
//             refreshToken: newRefresh,
//             user,
//           } = await authService.refreshToken(refreshToken);

//           set({
//             user,
//             accessToken,
//             refreshToken: newRefresh,
//             isAuthenticated: true,
//             isInitialized: true,
//           });
//         } catch (err) {
//           console.error("Failed to refresh on init:", err);

//           set({
//             user: null,
//             accessToken: null,
//             refreshToken: null,
//             isAuthenticated: false,
//             isInitialized: true,
//           });
//         }
//       },
//     }),
//     // {
//     //   name: "auth-store",
//     //   partialize: (state) => ({
//     //     user: state.user,
//     //     refreshToken: state.refreshToken, // only persist these
//     //   }),
//     // }
//     {
//       name: "auth-store",
//       partialize: (state) => {
//         console.log("Persisting auth state:", {
//           user: state.user,
//           refreshToken: state.refreshToken,
//         });
//         return {
//           user: state.user,
//           refreshToken: state.refreshToken, // persist user and refresh token
//         };
//       },
//     }
//   )
// );

// // clear volatile tokens on reload, but don’t log out
// // if (typeof window !== "undefined") {
// //   window.addEventListener("beforeunload", () => {
// //     useAuthStore.setState({ accessToken: null });
// //   });
// // }

// // import { create } from "zustand";
// // import { persist } from "zustand/middleware";
// // import { type User } from "@/types/types";
// // import * as authService from "@/services/authService";

// // type AuthState = {
// //   user: User | null;
// //   accessToken: string | null; // in-memory only
// //   refreshToken: string | null; // persisted
// //   isAuthenticated: boolean;
// //   loading: boolean;
// //   isInitialized: boolean;

// //   setAccessToken: (token: string | null) => void;
// //   setUser: (user: User | null) => void;
// //   login: (email: string, password: string) => Promise<User>;
// //   logout: () => Promise<void>;
// //   initializeAuth: () => Promise<void>;
// //   updateUser: (updates: Partial<User>) => void;
// // };

// // // global guard to prevent infinite logout loops
// // let isLoggingOut = false;

// // export const useAuthStore = create<AuthState>()(
// //   persist(
// //     (set, get) => ({
// //       user: null,
// //       accessToken: null,
// //       refreshToken: null,
// //       isAuthenticated: false,
// //       loading: false,
// //       isInitialized: false,

// //       setAccessToken: (token) => set({ accessToken: token }),
// //       setUser: (user) => set({ user, isAuthenticated: !!user }),

// //       login: async (email, password) => {
// //         set({ loading: true });
// //         try {
// //           const { accessToken, refreshToken, user } = await authService.login(
// //             email,
// //             password
// //           );

// //           set({
// //             user,
// //             accessToken,
// //             refreshToken,
// //             isAuthenticated: true,
// //             loading: false,
// //           });
// //           return user;
// //         } catch (error) {
// //           console.error("Login failed", error);
// //           set({ loading: false });
// //           throw error;
// //         }
// //       },
// //       updateUser: (updates) => {
// //         console.log("Updating user with:", updates);
// //         set((state) => {
// //           const updatedUser = state.user ? { ...state.user, ...updates } : null;
// //           console.log("Updated user object:", updatedUser);
// //           return { user: updatedUser };
// //         });
// //       },

// //       logout: async () => {
// //         if (isLoggingOut) return; // prevent recursion
// //         isLoggingOut = true;

// //         try {
// //           await authService.logout();
// //         } catch {
// //           console.warn("Logout request failed, clearing store anyway.");
// //         } finally {
// //           set({
// //             user: null,
// //             accessToken: null,
// //             refreshToken: null,
// //             isAuthenticated: false,
// //           });
// //           isLoggingOut = false;
// //         }
// //       },

// //       initializeAuth: async () => {
// //         const { refreshToken } = get();

// //         if (!refreshToken) {
// //           set({ isInitialized: true });
// //           return;
// //         }

// //         try {
// //           const {
// //             accessToken,
// //             refreshToken: newRefresh,
// //             user,
// //           } = await authService.refreshToken(refreshToken);

// //           set({
// //             user,
// //             accessToken,
// //             refreshToken: newRefresh,
// //             isAuthenticated: true,
// //             isInitialized: true,
// //           });
// //         } catch (err) {
// //           console.error("Failed to refresh on init:", err);

// //           set({
// //             user: null,
// //             accessToken: null,
// //             refreshToken: null,
// //             isAuthenticated: false,
// //             isInitialized: true,
// //           });
// //         }
// //       },
// //     }),
// //     // {
// //     //   name: "auth-store",
// //     //   partialize: (state) => ({
// //     //     user: state.user,
// //     //     refreshToken: state.refreshToken, // only persist these
// //     //   }),
// //     // }
// //     {
// //       name: "auth-store",
// //       partialize: (state) => {
// //         console.log("Persisting auth state:", {
// //           user: state.user,
// //           refreshToken: state.refreshToken,
// //         });
// //         return {
// //           user: state.user,
// //           refreshToken: state.refreshToken, // persist user and refresh token
// //         };
// //       },
// //     }
// //   )
// // );

// // // clear volatile tokens on reload, but don’t log out
// // if (typeof window !== "undefined") {
// //   window.addEventListener("beforeunload", () => {
// //     useAuthStore.setState({ accessToken: null });
// //   });
// // }
