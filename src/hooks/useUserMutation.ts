// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useAuthStore } from "@/stores/useAuthStore";
// import {
//   getAllUsers,
//   getUserById,
//   updateProfilePicture as updateProfilePictureService,
//   updateUserData,
//   updateUserPassword,
// } from "@/services/userService";
// import { toast } from "react-toastify";
// import { isAxiosError } from "axios";

// // Query keys
// export const userKeys = {
//   all: ["users"] as const,
//   lists: () => [...userKeys.all, "list"] as const,
//   list: (filters: string) => [...userKeys.lists(), { filters }] as const,
//   details: () => [...userKeys.all, "detail"] as const,
//   detail: (id: string) => [...userKeys.details(), id] as const,
// };

// // Get all users query
// export const useUsers = () => {
//   return useQuery({
//     queryKey: userKeys.lists(),
//     queryFn: getAllUsers,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

// // Get user by ID query
// export const useUser = (userId: string) => {
//   return useQuery({
//     queryKey: userKeys.detail(userId),
//     queryFn: () => getUserById(userId),
//     enabled: !!userId,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

// // User mutation hooks
// export const useUserMutations = () => {
//   const queryClient = useQueryClient();
//   const { syncUserWithProfile } = useAuthStore();

//   // Update user data mutation
//   const updateUserMutation = useMutation({
//     mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
//       updateUserData(userId, userData),

//     onSuccess: (data, variables) => {
//       // Update auth store
//       syncUserWithProfile({
//         name: data.fullName || data.name,
//         branch: data.location || data.branch,
//         ...(data.profilePicture && { profilePicture: data.profilePicture }),
//       });

//       // Invalidate queries
//       queryClient.invalidateQueries({
//         queryKey: userKeys.detail(variables.userId),
//       });
//       queryClient.invalidateQueries({ queryKey: userKeys.lists() });

//       toast.success("Profile updated successfully");
//     },

//     onError: (error) => {
//       if (isAxiosError(error)) {
//         // console.error("Failed to update user:", error);
//         toast.error(error.message || "Failed to update profile");
//       }
//     },
//   });

//   // Update password mutation
//   const updatePasswordMutation = useMutation({
//     mutationFn: ({
//       userId,
//       passwordData,
//     }: {
//       userId: string;
//       passwordData: { previousPassword: string; newPassword: string };
//     }) => updateUserPassword(userId, passwordData),

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: userKeys.detail(variables.userId),
//       });
//       toast.success("Password updated successfully");
//     },

//     onError: (error) => {
//       if (isAxiosError(error)) {
//         console.error("Failed to update password:", error);
//         toast.error(error.message || "Failed to update password");
//       }
//     },
//   });

//   // Update profile picture mutation
//   const updateProfilePictureMutation = useMutation({
//     mutationFn: ({ userId, imageFile }: { userId: string; imageFile: File }) =>
//       updateProfilePictureService(userId, imageFile),

//     onMutate: async ({ userId, imageFile }) => {
//       // Cancel outgoing refetches
//       await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

//       // Snapshot previous value
//       const previousUser = queryClient.getQueryData(userKeys.detail(userId));

//       // Create preview URL
//       const previewUrl = URL.createObjectURL(imageFile);

//       // Optimistically update cache
//       queryClient.setQueryData(userKeys.detail(userId), (old: any) => ({
//         ...old,
//         profilePicture: previewUrl,
//       }));

//       // Update auth store
//       syncUserWithProfile({ profilePicture: previewUrl });

//       return { previousUser };
//     },

//     onSuccess: (imageUrl, variables) => {
//       // Update with real URL
//       syncUserWithProfile({ profilePicture: imageUrl });
//       queryClient.invalidateQueries({
//         queryKey: userKeys.detail(variables.userId),
//       });

//       toast.success("Profile picture updated successfully");
//     },

//     onError: (error, variables, context) => {
//       // Rollback optimistic update
//       if (context?.previousUser) {
//         queryClient.setQueryData(
//           userKeys.detail(variables.userId),
//           context.previousUser
//         );
//       }

//       if (isAxiosError(error)) {
//         console.error("Failed to update profile picture:", error);
//         toast.error(error.message || "Failed to update profile picture");
//       }
//     },
//   });

//   // Combined profile update mutation
//   const updateProfileMutation = useMutation({
//     mutationFn: async ({
//       userId,
//       userData,
//       imageFile,
//     }: {
//       userId: string;
//       userData?: { fullName?: string; location?: string };
//       imageFile?: File;
//     }) => {
//       const results: { user?: any; profilePicture?: string } = {};

//       // Execute both operations in parallel for faster completion
//       const promises: Promise<any>[] = [];

//       if (imageFile) {
//         promises.push(
//           updateProfilePictureService(userId, imageFile).then((url) => {
//             results.profilePicture = url;
//             return url;
//           })
//         );
//       }

//       if (userData) {
//         promises.push(
//           updateUserData(userId, userData).then((user) => {
//             results.user = user;
//             return user;
//           })
//         );
//       }

//       // Wait for all operations to complete
//       await Promise.all(promises);
//       return results;
//     },

//     // Optimistic updates for immediate UI feedback
//     onMutate: async ({ userId, userData, imageFile }) => {
//       // Cancel outgoing refetches
//       await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

//       // Snapshot previous value
//       const previousUser = queryClient.getQueryData(userKeys.detail(userId));

//       // Optimistically update cache
//       if (userData || imageFile) {
//         queryClient.setQueryData(userKeys.detail(userId), (old: any) => ({
//           ...old,
//           ...userData,
//           profilePicture: imageFile
//             ? URL.createObjectURL(imageFile)
//             : old?.profilePicture,
//         }));

//         // Immediate auth store update
//         const updates: any = {};
//         if (userData?.fullName) updates.name = userData.fullName;
//         if (userData?.location) updates.branch = userData.location;
//         if (imageFile) updates.profilePicture = URL.createObjectURL(imageFile);

//         syncUserWithProfile(updates);
//       }

//       return { previousUser };
//     },

//     onSuccess: (data, variables) => {
//       // Update with real server data
//       const updates: any = {};

//       if (data.user) {
//         updates.name = data.user.fullName || data.user.name;
//         updates.branch = data.user.location || data.user.branch;
//       }

//       if (data.profilePicture) {
//         updates.profilePicture = data.profilePicture;
//       }

//       // Sync auth store with real server data
//       if (Object.keys(updates).length > 0) {
//         syncUserWithProfile(updates);
//       }

//       // Invalidate and refetch to ensure consistency
//       queryClient.invalidateQueries({
//         queryKey: userKeys.detail(variables.userId),
//       });
//       queryClient.invalidateQueries({ queryKey: userKeys.lists() });

//       toast.success("Profile updated successfully");
//     },

//     onError: (error, variables, context) => {
//       // Rollback optimistic update
//       if (context?.previousUser) {
//         queryClient.setQueryData(
//           userKeys.detail(variables.userId),
//           context.previousUser
//         );
//       }

//       if (isAxiosError(error)) {
//         console.error("Failed to update profile:", error);
//         toast.error(error.message || "Failed to update profile");
//       }
//     },
//   });

//   return {
//     updateUser: updateUserMutation,
//     updatePassword: updatePasswordMutation,
//     updateProfilePicture: updateProfilePictureMutation,
//     updateProfile: updateProfileMutation,
//   };
// };

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
    staleTime: 1 * 60 * 1000, // Reduced to 1 minute
    gcTime: 5 * 60 * 1000, // Keep cache for 5 minutes
  });
};

// Get user by ID query
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // Reduced to 1 minute
    gcTime: 5 * 60 * 1000, // Keep cache for 5 minutes
    // Add retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 404 (not found) or 403 (forbidden) errors
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 403)) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// User mutation hooks
export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { syncUserWithProfile } = useAuthStore();

  // Update user data mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) => {
      return updateUserData(userId, userData);
    },

    onMutate: async ({ userId, userData }) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.detail(userId));

      // Optimistically update cache
      const optimisticUpdate = {
        ...(previousUser ?? {}),
        ...userData,
        name: userData.fullName || userData.name || (previousUser as any)?.name,
        branch:
          userData.location || userData.branch || (previousUser as any)?.branch,
      };

      queryClient.setQueryData(userKeys.detail(userId), optimisticUpdate);

      return { previousUser };
    },

    onSuccess: (data, variables) => {
      // IMPORTANT: Don't sync here yet, let the combined mutation handle it
      // to avoid double syncing

      // Update cache with server response
      queryClient.setQueryData(
        userKeys.detail(variables.userId),
        (old: any) => {
          const updated = {
            ...old,
            ...data,
            name: data.fullName || data.name,
            branch: data.location || data.branch,
          };
          return updated;
        }
      );
    },

    onError: (error, variables, context) => {
      console.error("User mutation error:", error);

      // Rollback optimistic update
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(variables.userId),
          context.previousUser
        );
      }

      if (isAxiosError(error)) {
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
    }) => {
      return updateUserPassword(userId, passwordData);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      toast.success("Password updated successfully");
    },

    onError: (error) => {
      console.error("❌ Password update error:", error);
      if (isAxiosError(error)) {
        console.error("Failed to update password:", error);
        toast.error(error.message || "Failed to update password");
      }
    },
  });

  // Update profile picture mutation
  const updateProfilePictureMutation = useMutation({
    mutationFn: ({
      userId,
      imageFile,
    }: {
      userId: string;
      imageFile: File;
    }) => {
      return updateProfilePictureService(userId, imageFile);
    },

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

      return { previousUser, previewUrl };
    },

    onSuccess: (imageUrl, variables, context) => {
      // Clean up preview URL
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

      // Update cache with server response
      queryClient.setQueryData(
        userKeys.detail(variables.userId),
        (old: any) => ({
          ...old,
          profilePicture: imageUrl,
        })
      );
    },

    onError: (error, variables, context) => {
      console.error("❌ Profile picture mutation error:", error);

      // Clean up preview URL
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

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

  // Combined profile update mutation - FIXED VERSION
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

      // Execute operations sequentially to avoid conflicts
      if (userData) {
        // Fix: Send 'name' instead of 'fullName' to match API expectations
        const apiPayload = {
          name: userData.fullName, // Convert fullName to name for API
          location: userData.location,
        };
        const userResult = await updateUserData(userId, apiPayload);
        results.user = userResult;
      }

      if (imageFile) {
        const imageResult = await updateProfilePictureService(
          userId,
          imageFile
        );
        results.profilePicture = imageResult;
      }

      return results;
    },

    onMutate: async ({ userId, userData, imageFile }) => {
      // Cancel ALL queries for this user to prevent any interference
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.detail(userId));

      let previewUrl: string | undefined;
      if (imageFile) {
        previewUrl = URL.createObjectURL(imageFile);
      }

      // Build optimistic update
      const optimisticUserData: any = {};
      if (userData?.fullName) optimisticUserData.name = userData.fullName;
      if (userData?.location) optimisticUserData.branch = userData.location;
      if (previewUrl) optimisticUserData.profilePicture = previewUrl;

      // Optimistically update cache
      queryClient.setQueryData(userKeys.detail(userId), (old: any) => ({
        ...old,
        ...(userData && {
          name: userData.fullName || old?.name,
          branch: userData.location || old?.branch,
        }),
        ...(previewUrl && { profilePicture: previewUrl }),
      }));

      // Sync with auth store ONCE during optimistic update
      if (Object.keys(optimisticUserData).length > 0) {
        syncUserWithProfile(optimisticUserData);
      }

      return { previousUser, previewUrl, optimisticUserData };
    },

    onSuccess: (data, variables, context) => {
      // Clean up preview URL
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

      // Prepare final auth store update with server data
      const finalAuthUpdates: any = {};
      if (data.user) {
        // Server returns 'name', use it directly
        if (data.user.name) {
          finalAuthUpdates.name = data.user.name;
        }
        if (data.user.location || data.user.branch) {
          finalAuthUpdates.branch = data.user.location || data.user.branch;
        }
      }
      if (data.profilePicture) {
        finalAuthUpdates.profilePicture = data.profilePicture;
      }

      // CRITICAL: Only sync if we have new data from server
      if (Object.keys(finalAuthUpdates).length > 0) {
        // Add a small delay to ensure this sync happens after any other syncs
        setTimeout(() => {
          syncUserWithProfile(finalAuthUpdates);
        }, 100);
      }

      // Update cache with server response
      queryClient.setQueryData(
        userKeys.detail(variables.userId),
        (old: any) => {
          const finalUpdate = {
            ...old,
            ...(data.user && {
              name: data.user.fullName || data.user.name || old?.name,
              branch: data.user.location || data.user.branch || old?.branch,
            }),
            ...(data.profilePicture && { profilePicture: data.profilePicture }),
          };

          return finalUpdate;
        }
      );

      // Invalidate lists to refresh any list views
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast.success("Profile updated successfully");
    },

    onError: (error, variables, context) => {
      console.error("❌ Combined mutation error:", error);

      // Clean up preview URL
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

      // Rollback optimistic update
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(variables.userId),
          context.previousUser
        );

        // Also rollback the auth store if we had optimistic data
        if (context?.optimisticUserData) {
          // This is tricky - we'd need to restore previous auth state
          // For now, just invalidate the query to refetch
          queryClient.invalidateQueries({
            queryKey: userKeys.detail(variables.userId),
          });
        }
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
