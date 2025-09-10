import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import type { DragEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, Camera } from "lucide-react";
import { useUser, useUserMutations } from "@/hooks/useUserMutation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";

const passwordSchema = z
  .object({
    previousPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AdminData = {
  _id?: string;
  id?: string;
  email: string;
  lastLogin: string;
  userRole: string;
  adminName: string;
  profilePicture?: string;
};

type AdminUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminData: AdminData;
  onProfileUpdate: (updatedData: AdminData) => void;
};

export default function AdminUserModal({
  open,
  onOpenChange,
  adminData,
  onProfileUpdate,
}: AdminUserModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get the user ID and handle undefined case
  const userId = adminData._id || adminData.id;

  // Use the user mutations hook - consistent naming
  const { updatePassword, updateProfilePicture } = useUserMutations();

  // Only call useUser if userId exists
  const { data: userProfile } = useUser(userId || "");

  // Add auth store hook
  const { syncUserWithProfile } = useAuthStore();

  // Sync with auth store when userProfile is loaded
  const handleSyncUserWithProfile = useCallback(() => {
    if (userProfile && userId) {
      syncUserWithProfile({
        _id: userId,
        name: userProfile.name || adminData.adminName,
        email: userProfile.email || adminData.email,
        role: userProfile.role || adminData.userRole,
        profilePicture: userProfile.profilePicture,
      });
    }
  }, [
    userProfile,
    userId,
    adminData.adminName,
    adminData.email,
    adminData.userRole,
    syncUserWithProfile,
  ]);

  useEffect(() => {
    handleSyncUserWithProfile();
  }, [handleSyncUserWithProfile]);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      previousPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordSubmit = async (
    values: z.infer<typeof passwordSchema>
  ) => {
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    try {
      await updatePassword.mutateAsync({
        userId,
        passwordData: {
          previousPassword: values.previousPassword,
          newPassword: values.newPassword,
        },
      });

      onProfileUpdate(adminData);
      passwordForm.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Password update failed:" + error);
    }
  };

  // File handling with proper error handling and success callback
  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event?.target.files;
    const selectedFile = files && files.length > 0 ? files[0] : null;

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    // Use the mutation with proper success handling
    updateProfilePicture.mutate(
      { userId, imageFile: selectedFile },
      {
        onSuccess: (imageUrl) => {
          const updatedAdminData: AdminData = {
            ...adminData,
            profilePicture: imageUrl,
          };
          onProfileUpdate(updatedAdminData);
        },
      }
    );
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    const file = files?.[0];

    if (!file) {
      toast.error("No file was dropped");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file");
      return;
    }

    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    // Use the mutation with proper success handling
    updateProfilePicture.mutate(
      { userId, imageFile: file },
      {
        onSuccess: (imageUrl) => {
          const updatedAdminData: AdminData = {
            ...adminData,
            profilePicture: imageUrl,
          };
          onProfileUpdate(updatedAdminData);
        },
      }
    );
  };

  // Current profile picture comes from userProfile or fallback to adminData
  const currentProfilePicture =
    userProfile?.profilePicture || adminData.profilePicture;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] font-inter rounded-lg shadow-lg">
        <div className="p-4 space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } transition-colors duration-200 cursor-pointer`}
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {currentProfilePicture ? (
                <img
                  src={currentProfilePicture}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    toast.error("Failed to load profile image");
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                  <span className="text-gray-500 text-xs block">
                    Choose photo
                  </span>
                </div>
              )}
              <label
                htmlFor="profile-upload"
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white cursor-pointer ${
                  updateProfilePicture.isPending
                    ? "opacity-100"
                    : "opacity-0 hover:opacity-100"
                } transition-opacity duration-300 rounded-full`}
              >
                {updateProfilePicture.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Camera className="w-6 h-6" />
                )}
                <span className="sr-only">Choose photo from file</span>
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={updateProfilePicture.isPending}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">
                {adminData.adminName || "Admin User"}
              </h3>
              {/* <p className="text-sm text-gray-600">ID: {userId || "No ID"}</p> */}
              <p className="hidden md:block text-sm text-gray-600">
                Last Login: {new Date(adminData.lastLogin).toLocaleString()}
              </p>
            </div>
          </div>

          {isDragging && (
            <div className="text-center p-4 border-2 border-dashed border-blue-500 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">Drop your image here</p>
            </div>
          )}

          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Change Password
          </h3>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="previousPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-normal">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          {...field}
                          className="pr-10 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                          disabled={updatePassword.isPending}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
                          disabled={updatePassword.isPending}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-normal">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password (min 8 characters)"
                          {...field}
                          className="pr-10 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                          disabled={updatePassword.isPending}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          disabled={updatePassword.isPending}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-normal">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                          className="pr-10 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                          disabled={updatePassword.isPending}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          disabled={updatePassword.isPending}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={updatePassword.isPending || !userId}
                className="w-full bg-[#2ECC71] hover:bg-[#28B463] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatePassword.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Password
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
