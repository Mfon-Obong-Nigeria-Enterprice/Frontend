import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  getAllUsers,
  getUserById,
  updateProfilePicture as updateProfilePictureService,
  updateUserData,
  updateUserPassword,
} from "@/services/userService";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

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
  const { syncUserWithProfile } = useAuthStore();

  // Update user data mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
      updateUserData(userId, userData),

    onSuccess: (data, variables) => {
      // Update auth store
      syncUserWithProfile({
        name: data.fullName || data.name,
        branch: data.location || data.branch,
      });

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast.success("Profile updated successfully");
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        // console.error("Failed to update user:", error);
        toast.error(error.message || "Failed to update profile");
      }
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: ({
      userId,
      passwordData,
    }: {
      userId: string;
      passwordData: { previousPassword: string; newPassword: string };
    }) => updateUserPassword(userId, passwordData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      toast.success("Password updated successfully");
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        console.error("Failed to update password:", error);
        toast.error(error.message || "Failed to update password");
      }
    },
  });

  // Update profile picture mutation
  const updateProfilePictureMutation = useMutation({
    mutationFn: ({ userId, imageFile }: { userId: string; imageFile: File }) =>
      updateProfilePictureService(userId, imageFile),

    onMutate: async ({ userId, imageFile }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.detail(userId));

      // Create preview URL
      const previewUrl = URL.createObjectURL(imageFile);

      // Optimistically update cache
      queryClient.setQueryData(userKeys.detail(userId), (old: any) => ({
        ...old,
        profilePicture: previewUrl,
      }));

      // Update auth store
      syncUserWithProfile({ profilePicture: previewUrl });

      return { previousUser };
    },

    onSuccess: (imageUrl, variables) => {
      // Update with real URL
      syncUserWithProfile({ profilePicture: imageUrl });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });

      toast.success("Profile picture updated successfully");
    },

    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(variables.userId),
          context.previousUser
        );
      }

      if (isAxiosError(error)) {
        console.error("Failed to update profile picture:", error);
        toast.error(error.message || "Failed to update profile picture");
      }
    },
  });

  // Combined profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({
      userId,
      userData,
      imageFile,
    }: {
      userId: string;
      userData?: { fullName?: string; location?: string };
      imageFile?: File;
    }) => {
      const results: { user?: any; profilePicture?: string } = {};

      // Execute both operations in parallel for faster completion
      const promises: Promise<any>[] = [];

      if (imageFile) {
        promises.push(
          updateProfilePictureService(userId, imageFile).then((url) => {
            results.profilePicture = url;
            return url;
          })
        );
      }

      if (userData) {
        promises.push(
          updateUserData(userId, userData).then((user) => {
            results.user = user;
            return user;
          })
        );
      }

      // Wait for all operations to complete
      await Promise.all(promises);
      return results;
    },

    // Optimistic updates for immediate UI feedback
    onMutate: async ({ userId, userData, imageFile }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.detail(userId));

      // Optimistically update cache
      if (userData || imageFile) {
        queryClient.setQueryData(userKeys.detail(userId), (old: any) => ({
          ...old,
          ...userData,
          profilePicture: imageFile
            ? URL.createObjectURL(imageFile)
            : old?.profilePicture,
        }));

        // Immediate auth store update
        const updates: any = {};
        if (userData?.fullName) updates.name = userData.fullName;
        if (userData?.location) updates.branch = userData.location;
        if (imageFile) updates.profilePicture = URL.createObjectURL(imageFile);

        syncUserWithProfile(updates);
      }

      return { previousUser };
    },

    onSuccess: (data, variables) => {
      // Update with real server data
      const updates: any = {};

      if (data.user) {
        updates.name = data.user.fullName || data.user.name;
        updates.branch = data.user.location || data.user.branch;
      }

      if (data.profilePicture) {
        updates.profilePicture = data.profilePicture;
      }

      // Sync auth store with real server data
      if (Object.keys(updates).length > 0) {
        syncUserWithProfile(updates);
      }

      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast.success("Profile updated successfully");
    },

    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(variables.userId),
          context.previousUser
        );
      }

      if (isAxiosError(error)) {
        console.error("Failed to update profile:", error);
        toast.error(error.message || "Failed to update profile");
      }
    },
  });

  return {
    updateUser: updateUserMutation,
    updatePassword: updatePasswordMutation,
    updateProfilePicture: updateProfilePictureMutation,
    updateProfile: updateProfileMutation,
  };
};
