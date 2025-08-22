import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import type { DragEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { Loader2, Camera } from "lucide-react";
import api from "@/services/baseApi";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  location: z.string().min(1, "Location is required"),
});

type ManagerData = {
  _id: string;
  email: string;
  lastLogin: string;
  userRole: string;
  fullName: string;
  location: string;
  profilePicture?: string;
  theme?: boolean;
};

type ManagerUsersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: ManagerData;
  onProfileUpdate: (updatedData: ManagerData) => void;
};

export function ManagerUsersModal({
  open,
  onOpenChange,
  userData,
  onProfileUpdate,
}: ManagerUsersModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    userData.profilePicture
  );
  const [isDragging, setIsDragging] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData.fullName,
      location: userData.location,
    },
  });

  useEffect(() => {
    if (open) {
      setProfileImage(userData.profilePicture);
      profileForm.reset({
        fullName: userData.fullName,
        location: userData.location,
      });
    }
  }, [open, userData, profileForm]);

  const handleProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setIsLoading(true);

      const payload = {
        fullName: values.fullName,
        location: values.location,
      };

      const response = await api.patch(`/users/${userData._id}`, payload);

      // Create the updated user data object
      const updatedUserData = {
        ...userData,
        fullName: values.fullName,
        location: values.location,
        name: values.fullName, // Also update 'name' field for consistency
        branch: values.location, // Also update 'branch' field for consistency
        // Include any data from the response
        ...response.data,
      };

      // Call the onProfileUpdate callback with the updated data
      onProfileUpdate(updatedUserData);

      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Profile update error:", error);

      // Enhanced error handling with specific 403 guidance
      if (error.response?.status === 403) {
        const errorMsg = error.response.data?.message || "Access denied";
        toast.error(`Permission Error: ${errorMsg}`);
      } else if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Update failed with status ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Request error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateImage = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF, or WebP)";
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }

    return null;
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      const validationError = validateImage(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setIsUploadingImage(true);

      // Ensure auth token is set
      const token = localStorage.getItem("authToken");
      if (token && !api.defaults.headers.common["Authorization"]) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.patch(
        `/users/${userData._id}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Try multiple possible response formats
      let profilePictureUrl = null;
      let updatedUserData = null;

      if (response.data) {
        profilePictureUrl =
          response.data.url || // { url: "..." }
          response.data.profilePicture || // { profilePicture: "..." }
          response.data.data?.url || // { data: { url: "..." } }
          response.data.data?.profilePicture || // { data: { profilePicture: "..." } }
          null;

        updatedUserData =
          response.data.user || // { user: {...} }
          response.data.data || // { data: {...} }
          response.data; // {...} direct user object
      }

      if (profilePictureUrl) {
        setProfileImage(profilePictureUrl);

        const newUserData = {
          ...userData,
          ...updatedUserData,
          profilePicture: profilePictureUrl,
        };

        onProfileUpdate(newUserData);
        toast.success("Profile picture updated successfully!");
      } else {
        // Still update if we got user data back
        if (updatedUserData && Object.keys(updatedUserData).length > 0) {
          onProfileUpdate({ ...userData, ...updatedUserData });
          toast.success("Upload completed!");
        } else {
          toast.warning("Upload completed but no data returned");
        }
      }
    } catch (error: any) {
      console.error("Profile picture upload error:", error);

      if (error.response?.status === 403) {
        const errorMsg = error.response.data?.message || "Access denied";
        toast.error(`Permission Error: ${errorMsg}`);
      } else if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Upload failed with status ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Upload error. Please check your connection.");
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    handleProfilePictureUpload(file);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
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

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    handleProfilePictureUpload(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] font-inter rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-semibold">Edit Profile</h2>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } transition-all duration-200 cursor-pointer`}
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${userData.userRole} Avatar`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      "Failed to load profile image:",
                      profileImage
                    );
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
                  isUploadingImage
                    ? "opacity-100"
                    : "opacity-0 hover:opacity-100"
                } transition-opacity duration-300 rounded-full`}
              >
                {isUploadingImage ? (
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
                disabled={isUploadingImage}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">
                {userData.fullName || "User Name"}
              </h3>
              <p className="text-sm text-gray-600">
                {userData.userRole || "User Role"}
              </p>
            </div>
          </div>

          {isDragging && (
            <div className="text-center p-4 border-2 border-dashed border-blue-500 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">Drop your image here</p>
            </div>
          )}

          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
              className="space-y-4"
            >
              <FormField
                control={profileForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-normal">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter full name"
                        {...field}
                        className="rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-normal">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter location (e.g., Main Office)"
                        {...field}
                        className="rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-gray-700 text-sm font-normal">
                  Role
                </FormLabel>
                <FormControl>
                  <Input
                    value={userData.userRole}
                    readOnly
                    disabled
                    className="pr-10 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
                <p className="text-gray-500 text-xs">
                  This field can't be edited
                </p>
              </FormItem>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2ECC71] hover:bg-[#28B463] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ease-in-out shadow-md"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
