import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateProfilePicture,
  updateUserPassword,
} from "@/services/userService";
import { toast } from "react-toastify";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Get all users query
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID query
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User mutation hooks
export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { updateUser: updateAuthUser } = useAuthStore();

  // Update user profile mutation
  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: {
        fullName?: string;
        name?: string;
        location?: string;
        branch?: string;
      };
    }) => updateUser(userId, userData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Update auth store with new data
      updateAuthUser({
        name: data.fullName || data.name,
        branch: data.location || data.branch,
        // Add other fields as needed
      });

      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      toast.error(error.message || "Failed to update profile");
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: ({
      userId,
      passwordData,
    }: {
      userId: string;
      passwordData: {
        previousPassword: string;
        newPassword: string;
      };
    }) => updateUserPassword(userId, passwordData),
    onSuccess: (data) => {
      console.log("Password update successful:", data);
      toast.success(data.message || "Password updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update password:", error);
      toast.error(error.message || "Failed to update password");
    },
  });

  // Update profile picture mutation
  const updateProfilePictureMutation = useMutation({
    mutationFn: ({ userId, imageFile }: { userId: string; imageFile: File }) =>
      updateProfilePicture(userId, imageFile),
    onSuccess: (imageUrl, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Update auth store with new profile picture
      updateAuthUser({
        profilePicture: imageUrl,
      });

      toast.success("Profile picture updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update profile picture:", error);
      toast.error(error.message || "Failed to update profile picture");
    },
  });

  // Combined profile update mutation (for updating both profile data and picture)
  const updateProfileMutation = useMutation({
    mutationFn: async ({
      userId,
      userData,
      imageFile,
    }: {
      userId: string;
      userData?: {
        fullName?: string;
        name?: string;
        location?: string;
        branch?: string;
      };
      imageFile?: File;
    }) => {
      const results: {
        user?: any;
        profilePicture?: string;
      } = {};

      // Update profile picture first if provided
      if (imageFile) {
        results.profilePicture = await updateProfilePicture(userId, imageFile);
      }

      // Update user data if provided
      if (userData) {
        results.user = await updateUser(userId, userData);
      }

      return results;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Update auth store with new data
      const updates: Partial<{
        name?: string;
        branch?: string;
        profilePicture?: string;
      }> = {};

      if (data.user) {
        updates.name = data.user.fullName || data.user.name;
        updates.branch = data.user.location || data.user.branch;
      }

      if (data.profilePicture) {
        updates.profilePicture = data.profilePicture;
      }

      if (Object.keys(updates).length > 0) {
        updateAuthUser(updates);
      }

      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    },
  });

  return {
    updateUser: updateUserMutation,
    updatePassword: updatePasswordMutation,
    updateProfilePicture: updateProfilePictureMutation,
    updateProfile: updateProfileMutation,
  };
};
