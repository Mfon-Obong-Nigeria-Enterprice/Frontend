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
        set((state) => {
          if (!state.user || !state.userProfile) {
            console.warn("No user or userProfile to update");
            return state;
          }

          // Clean and process the name
          const cleanName = updates.name ? updates.name.trim() : undefined;

          // Update both user and userProfile
          const updatedUser: LoginUser = {
            ...state.user,
            name: cleanName || state.user.name,
            email: updates.email || state.user.email,
            branch: updates.branch || state.user.branch,
          };

          const updatedUserProfile: UserProfile = {
            ...state.userProfile,
            ...updates,
            name: cleanName || state.userProfile.name, // Use cleaned name
          };

          // console.log("Updated user object:", updatedUser);
          // console.log("Updated userProfile object:", updatedUserProfile);

          return {
            user: updatedUser,
            userProfile: updatedUserProfile,
          };
        });
      },

      // Fixed method to sync user data with fresh profile data
      syncUserWithProfile: (profileData) => {
        set((state) => {
          if (!state.user || !state.userProfile) {
            console.warn("No user or userProfile to sync with profile data");
            return state;
          }

          // Clean the name if it exists in profileData
          const cleanName = profileData.name
            ? profileData.name.trim()
            : undefined;

          // Check if there are actual changes to prevent unnecessary updates
          const hasUserChanges =
            cleanName !== state.user.name ||
            profileData.email !== state.user.email ||
            profileData.branch !== state.user.branch;

          const hasProfileChanges = Object.keys(profileData).some((key) => {
            const newValue =
              key === "name"
                ? cleanName
                : profileData[key as keyof typeof profileData];
            const currentValue = state.userProfile![key as keyof UserProfile];
            return newValue !== currentValue && newValue !== undefined;
          });

          // If no changes, don't update the state
          if (!hasUserChanges && !hasProfileChanges) {
            return state;
          }

          // Update user object with fresh profile data
          const updatedUser: LoginUser = {
            ...state.user,
            name: cleanName || state.user.name,
            email: profileData.email || state.user.email,
            branch: profileData.branch || state.user.branch,
          };

          // Ensure all required fields have values by using existing values as fallbacks
          const updatedUserProfile: UserProfile = {
            ...state.userProfile,
            ...profileData,
            // Override with explicit fallbacks for required fields and use cleaned name
            _id: profileData._id || state.userProfile._id,
            name: cleanName || state.userProfile.name,
            email: profileData.email || state.userProfile.email,
            role: profileData.role || state.userProfile.role,
            branch: profileData.branch || state.userProfile.branch,
            branchId: profileData.branchId || state.userProfile.branchId,
            createdAt: profileData.createdAt || state.userProfile.createdAt,
          };

          // console.log("Syncing user with profile data:", {
          //   profileData,
          //   cleanName,
          //   updatedUser,
          //   updatedUserProfile,
          // });

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
