/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ImPencil } from "react-icons/im";
import { Loader2, Eye, EyeOff, Camera } from "lucide-react";
import api from "@/services/baseApi";

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
};

export default function AdminUserModal({
  open,
  onOpenChange,
  adminData,
}: AdminUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage] = useState(false);
  const [profileImage] = useState<string | null>(
    adminData.profilePicture || null
  );
  const [isDragging] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (open) {
      console.log("📂 Admin Data when modal opens:", adminData);
    }
  }, [open, adminData]);

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
    try {
      setIsLoading(true);

      const payload = {
        previousPassword: values.previousPassword,
        newPassword: values.newPassword,
      };

      // Add request logging
      console.log("Sending payload:", payload);

      const response = await api.patch(
        `/users/${adminData._id}/update-password`,
        payload
      );
      console.log("Response:", response);
      // return response.data

      toast.success("Password updated successfully");
      passwordForm.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Full error object:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        if (error.response.status === 401) {
          toast.error("Unauthorized: Invalid credentials or session expired");
        } else if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            `Password update failed. Status: ${error.response.status}`
          );
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

  function handleDragOver(_event: DragEvent<HTMLDivElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleDrop(_event: DragEvent<HTMLDivElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleFileInputChange(_event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

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
                  src={`/images/${adminData.userRole}-avatar.png`}
                  alt=""
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
                {adminData.adminName || "Admin User"}
              </h3>
              <p className="text-sm text-gray-600">
                ID: {adminData._id || adminData.id}
              </p>
              <p className="text-sm text-gray-600">
                Last Login: {new Date(adminData.lastLogin).toLocaleString()}
              </p>
            </div>
          </div>

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
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
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
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() => setShowNewPassword((prev) => !prev)}
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
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
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
                disabled={isLoading}
                className="w-full bg-[#2ECC71] hover:bg-[#28B463] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ease-in-out shadow-md"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
