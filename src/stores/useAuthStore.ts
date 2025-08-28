import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type LoginUser, type UserProfile } from "@/types/types";
import * as authService from "@/services/authService";

type AuthState = {
  user: LoginUser | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: LoginUser | null) => void;
  login: (email: string, password: string) => Promise<LoginUser>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  syncUserWithProfile: (profileData: Partial<UserProfile>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userProfile: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          // Initialize userProfile from user data
          userProfile: user
            ? {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                branchId: user.branchId,
                createdAt: user.createdAt,
                profilePicture: undefined, // Will be set separately
              }
            : null,
        });
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { user } = await authService.login(email, password);
          console.log("Login successful, user data:", user);

          set({
            user,
            userProfile: {
              _id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              branch: user.branch,
              branchId: user.branchId,
              createdAt: user.createdAt,
              profilePicture: undefined, // Will be set when profile is loaded
            },
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
        console.log("Updating user with:", updates);
        set((state) => {
          if (!state.user || !state.userProfile) {
            console.warn("No user or userProfile to update");
            return state;
          }

          // Update both user and userProfile
          const updatedUser: LoginUser = {
            ...state.user,
            name: updates.name || state.user.name,
            email: updates.email || state.user.email,
            branch: updates.branch || state.user.branch,
          };

          const updatedUserProfile: UserProfile = {
            ...state.userProfile,
            ...updates,
          };

          console.log("Updated user object:", updatedUser);
          console.log("Updated userProfile object:", updatedUserProfile);

          return {
            user: updatedUser,
            userProfile: updatedUserProfile,
          };
        });
      },

      // Fixed method to sync user data with fresh profile data
      syncUserWithProfile: (profileData) => {
        set((state) => {
          if (!state.user) {
            console.warn("No user to sync with profile data");
            return state;
          }

          // If no existing userProfile, we can't sync
          if (!state.userProfile) {
            console.warn("No userProfile to sync with profile data");
            return state;
          }

          // Update user object with fresh profile data
          const updatedUser: LoginUser = {
            ...state.user,
            name: profileData.name || state.user.name,
            email: profileData.email || state.user.email,
            branch: profileData.branch || state.user.branch,
          };

          // Ensure all required fields have values by using existing values as fallbacks
          const updatedUserProfile: UserProfile = {
            ...state.userProfile,
            ...profileData,
            // Override with explicit fallbacks for required fields
            _id: profileData._id || state.userProfile._id,
            name: profileData.name || state.userProfile.name,
            email: profileData.email || state.userProfile.email,
            role: profileData.role || state.userProfile.role,
            branch: profileData.branch || state.userProfile.branch,
            branchId: profileData.branchId || state.userProfile.branchId,
            createdAt: profileData.createdAt || state.userProfile.createdAt,
          };

          console.log("Syncing user with profile data:", {
            profileData,
            updatedUser,
            updatedUserProfile,
          });

          return {
            user: updatedUser,
            userProfile: updatedUserProfile,
          };
        });
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          console.warn("Logout request failed, clearing store anyway.");
        } finally {
          set({
            user: null,
            userProfile: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "auth-storage", // Persist key
      // Only persist essential data
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
