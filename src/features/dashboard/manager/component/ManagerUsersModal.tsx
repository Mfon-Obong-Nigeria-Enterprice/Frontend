import { useEffect, useState, type ChangeEvent } from "react";
import type { DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Camera } from "lucide-react";
import api from "@/services/baseApi";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    userRole: "",
    name: "",
    location: "",
    image: null as File | null,
    profilePicture: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const getProfile = async (user_id: string): Promise<void> => {
    try {
      setIsLoading(true);

      const res = await api.get(`users/${user_id}/`);
      setProfileData({
        ...res.data,
        image: null,
        profilePicture: res.data.profilePicture || res.data.image || "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData._id) {
      getProfile(userData._id);
    }
  }, [userData]);

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

  const uploadProfilePicture = async (
    userId: string,
    imageFile: File
  ): Promise<string | null> => {
    try {
      setIsUploadingImage(true);

      // List of possible field names the backend might expect
      const fieldNames = [
        "image",
        "profilePicture",
        "profile_picture",
        "file",
        "photo",
      ];

      for (const fieldName of fieldNames) {
        try {
          const formData = new FormData();
          formData.append(fieldName, imageFile);

          console.log(`Trying upload with field name: ${fieldName}`);
          console.log("Uploading to:", `users/${userId}/profile-picture`);

          const res = await api.patch(
            `users/${userId}/profile-picture`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Upload successful with field:", fieldName, res.data);
          return res.data.profilePicture || res.data.image || res.data.url;
        } catch (error: any) {
          console.log(
            `Failed with field name ${fieldName}:`,
            error.response?.status
          );

          // If it's not a 400 error, throw it (might be a different issue)
          if (error.response?.status !== 400) {
            throw error;
          }

          // Continue to next field name if it's a 400 error
          continue;
        }
      }

      // If all field names failed, throw an error
      throw new Error("All field name attempts failed");
    } catch (error: any) {
      console.error("Failed to upload profile picture:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        toast.error(
          `Upload failed: ${
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Unknown error"
          }`
        );
      } else {
        toast.error("Failed to upload profile picture");
      }
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData._id) {
      toast.error("User ID is required");
      return;
    }

    try {
      setIsLoading(true);

      let updatedProfilePicture = profileData.profilePicture;

      // Handle profile picture upload separately if a new image is selected
      if (profileData.image) {
        const uploadedImageUrl = await uploadProfilePicture(
          userData._id,
          profileData.image
        );
        if (uploadedImageUrl) {
          updatedProfilePicture = uploadedImageUrl;
        } else {
          // If image upload failed, don't proceed with the rest of the update
          toast.error("Profile picture upload failed. Please try again.");
          return;
        }
      }

      // Update other profile data using the main user endpoint
      const updateData = {
        fullName: profileData.name,
        location: profileData.location,
      };

      const res = await api.patch(`users/${userData._id}/`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Profile updated successfully");

      // Prepare updated data for callback
      const updatedData: ManagerData = {
        ...userData,
        ...res.data,
        profilePicture: updatedProfilePicture,
        name: res.data.name || profileData.name,
        location: res.data.location || profileData.location,
      };

      onProfileUpdate(updatedData);
      onOpenChange(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
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
                name="fullName"
                onChange={handleProfileChange}
                value={profileData.name}
                placeholder="Enter full name"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 ease-in-out"
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading || isUploadingImage}
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
