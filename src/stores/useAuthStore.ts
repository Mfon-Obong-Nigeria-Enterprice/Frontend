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
          const cleanName = profileData.name?.trim();

          // Create updated user object
          const updatedUser: LoginUser = {
            ...state.user,
            ...(cleanName && { name: cleanName }),
            ...(profileData.email && { email: profileData.email }),
            ...(profileData.branch && { branch: profileData.branch }),
          };

          // Create updated user profile object
          const updatedUserProfile: UserProfile = {
            ...state.userProfile,
            ...profileData,
            // Ensure required fields have values using existing values as fallbacks
            _id: profileData._id || state.userProfile._id,
            name: cleanName || state.userProfile.name,
            email: profileData.email || state.userProfile.email,
            role: profileData.role || state.userProfile.role,
            branch: profileData.branch || state.userProfile.branch,
            branchId: profileData.branchId || state.userProfile.branchId,
            createdAt: profileData.createdAt || state.userProfile.createdAt,
          };

          // Detect what actually changed
          const userChanges: string[] = [];
          const profileChanges: string[] = [];

          if (updatedUser.name !== state.user.name)
            userChanges.push(`name: ${state.user.name} → ${updatedUser.name}`);
          if (updatedUser.email !== state.user.email)
            userChanges.push(
              `email: ${state.user.email} → ${updatedUser.email}`
            );
          if (updatedUser.branch !== state.user.branch)
            userChanges.push(
              `branch: ${state.user.branch} → ${updatedUser.branch}`
            );

          if (updatedUserProfile.name !== state.userProfile.name)
            profileChanges.push(
              `name: ${state.userProfile.name} → ${updatedUserProfile.name}`
            );
          if (updatedUserProfile.branch !== state.userProfile.branch)
            profileChanges.push(
              `branch: ${state.userProfile.branch} → ${updatedUserProfile.branch}`
            );
          if (
            updatedUserProfile.profilePicture !==
            state.userProfile.profilePicture
          )
            profileChanges.push(`profilePicture: changed`);

          // Only update if there are actual changes
          if (userChanges.length === 0 && profileChanges.length === 0) {
            return state;
          }

          return {
            ...state,
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
      // Only persist essential NON-SENSITIVE data
      partialize: (state) => ({
        user: state.user ? {
          id: state.user.id,
          name: state.user.name,
          email: state.user.email,
          role: state.user.role,
          branch: state.user.branch,
          branchId: state.user.branchId,
          createdAt: state.user.createdAt,
          // NEVER persist tokens or sensitive data
        } : null,
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
