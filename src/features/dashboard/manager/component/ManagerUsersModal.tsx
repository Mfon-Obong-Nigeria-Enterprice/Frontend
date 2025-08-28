import { useEffect, useState, type ChangeEvent } from "react";
import type { DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Camera } from "lucide-react";
import { toast } from "react-toastify";
// import { useUser, useUserMutations } from "@/hooks/useUserMutations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUser, useUserMutations } from "@/hooks/useUserMutation";

type ManagerData = {
  _id: string;
  email: string;
  lastLogin: string;
  userRole: string;
  name: string;
  location: string;
  profilePicture: string;
  theme?: boolean;
};

interface ManagerUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: ManagerData;
  onProfileUpdate: (updatedData: ManagerData) => void;
}

export function ManagerUsersModal({
  open,
  onOpenChange,
  userData,
  onProfileUpdate,
}: ManagerUsersModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [profileData, setProfileData] = useState({
    userRole: "",
    name: "",
    location: "",
    image: null as File | null,
    profilePicture: "",
  });

  // React Query hooks
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    refetch,
  } = useUser(userData._id);
  const { updateProfile } = useUserMutations();
  const { syncUserWithProfile } = useAuthStore();

  // Load profile data when modal opens or userData changes
  useEffect(() => {
    if (userData?._id && open) {
      if (userProfile) {
        // Use data from React Query
        setProfileData({
          userRole: userProfile.role || userData.userRole,
          name: userProfile.name || userData.name,
          location: userProfile.branch || userData.location,
          image: null,
          profilePicture:
            userProfile.profilePicture || userData.profilePicture || "",
        });
      } else {
        // Fallback to userData while loading
        setProfileData({
          userRole: userData.userRole,
          name: userData.name,
          location: userData.location,
          image: null,
          profilePicture: userData.profilePicture || "",
        });
      }
    }
  }, [userData, userProfile, open]);

  // Sync with auth store when profile data updates
  useEffect(() => {
    if (userProfile) {
      syncUserWithProfile({
        _id: userProfile._id,
        name: userProfile.name,
        role: userProfile.role,
        branch: userProfile.branch,
        profilePicture: userProfile.profilePicture,
      });
    }
  }, [userProfile, syncUserWithProfile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target.files;
    const selectedFile = files && files.length > 0 ? files[0] : null;

    setProfileData({
      ...profileData,
      image: selectedFile,
    });

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview("");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData._id) {
      toast.error("User ID is required");
      return;
    }

    try {
      // Prepare update data
      const updateData = {
        userId: userData._id,
        userData: {
          fullName: profileData.name,
          location: profileData.location,
        },
        imageFile: profileData.image || undefined,
      };

      // Use the combined mutation
      const result = await updateProfile.mutateAsync(updateData);

      toast.success("Profile updated successfully");

      // Prepare updated data for callback
      const updatedData: ManagerData = {
        ...userData,
        name: profileData.name,
        location: profileData.location,
        profilePicture: result.profilePicture || profileData.profilePicture,
      };

      onProfileUpdate(updatedData);

      // Refetch the user data to ensure consistency
      await refetch();

      onOpenChange(false);

      // Clear image preview
      setImagePreview("");
      setProfileData((prev) => ({ ...prev, image: null }));
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
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

    setProfileData({
      ...profileData,
      image: file,
    });

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const displayImage =
    imagePreview || profileData.profilePicture || userData.profilePicture;

  const isLoading = updateProfile.isPending;
  const isUploadingImage =
    updateProfile.isPending && profileData.image !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] font-inter rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 space-y-6">
          <form className="space-y-4" onSubmit={handleFormSubmit}>
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
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={`${userData.userRole} Avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(
                        "Failed to load profile image:",
                        displayImage
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
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploadingImage || isLoading}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {profileData.name || userData.name || ""}
                </h3>
                <p className="text-sm text-gray-600">
                  {profileData.userRole || userData.userRole || "User Role"}
                </p>
                {isLoadingProfile && (
                  <div className="flex items-center mt-1">
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    <span className="text-xs text-gray-500">
                      Loading profile...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isDragging && (
              <div className="text-center p-4 border-2 border-dashed border-blue-500 bg-blue-50 rounded-lg">
                <p className="text-blue-600 font-medium">
                  Drop your image here
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Full name
              </label>
              <input
                name="name"
                onChange={handleProfileChange}
                value={profileData.name}
                placeholder="Enter full name"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                disabled={isLoading || isLoadingProfile}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Location
              </label>
              <input
                name="location"
                onChange={handleProfileChange}
                value={profileData.location}
                placeholder="Enter location"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                disabled={isLoading || isLoadingProfile}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Role
              </label>
              <input
                value={profileData.userRole}
                readOnly
                disabled
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs">
                This field can't be edited
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isUploadingImage || isLoadingProfile}
              className="w-full bg-[#2ECC71] hover:bg-[#28B463] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ease-in-out shadow-md disabled:opacity-50"
            >
              {(isLoading || isUploadingImage) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUploadingImage
                ? "Uploading..."
                : isLoading
                ? "Updating..."
                : "Update Profile"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
