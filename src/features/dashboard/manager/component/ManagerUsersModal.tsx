/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import type { DragEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
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
import { ImPencil } from "react-icons/im";
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
  const [isDragging] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData.fullName,
      location: userData.location,
    },
  });

  useEffect(() => {
    if (open) {
      console.log("📂 Manager/Maintainer User Data when modal opens:", userData);
      
      setProfileImage(userData.profilePicture);
      profileForm.reset({
        fullName: userData.fullName,
        location: userData.location,
      });
    }
  }, [open, userData, profileForm]);

  const handleProfileSubmit = async (
    values: z.infer<typeof profileSchema>
  ) => {
    try {
      setIsLoading(true);

      const payload = {
        fullName: values.fullName,
        location: values.location,
      };

      console.log("Sending profile update payload:", payload);


      const response = await api.patch(`/users/${userData._id}/profile`, payload);
      console.log("Profile Update Response:", response);

   
      onProfileUpdate(response.data);

      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Full error object:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(`Profile update failed. Status: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please try again.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("Request error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    
    console.log("Uploading profile picture...");

    try {
      // The browser will automatically set the correct 'Content-Type' header
      const response = await api.patch(
        `/users/${userData._id}/profile-picture`,
        formData
      );

      console.log("Profile picture upload response:", response);

     
      onProfileUpdate(response.data);

      setProfileImage(response.data.profilePicture);
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Profile picture upload failed:', error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.response.data?.message || 'Profile picture upload failed.');
      } else {
        toast.error('Profile picture upload failed.');
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      
      setProfileImage(URL.createObjectURL(file));
      handleProfilePictureUpload(file);
    }
  };

  function handleDragOver(_event: DragEvent<HTMLDivElement>): void {}
  function handleDrop(_event: DragEvent<HTMLDivElement>): void {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] font-inter rounded-lg shadow-lg">
        <div className="p-4 space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div
              className={`relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 ${
                isDragging ? "border-blue-500" : "border-gray-300"
              } transition-colors duration-200`}
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragOver}
              onDrop={handleDrop}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${userData.userRole} Avatar`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center">
                  <span className="text-gray-500 text-xs block mt-1">
                    Choose photo from file{" "}
                    <ImPencil size={30} className="mx-auto" />
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

          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Edit Profile
          </h3>
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
                <p className="text-gray-500 text-xs">This field can't be edited</p>
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
