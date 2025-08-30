import type { UserProfile } from "@/types/types";
import api from "./baseApi";
import { isAxiosError } from "axios";
import type { CompanyUser } from "@/stores/useUserStore";
import type { Role } from "@/types/types";
import type { CreateUserPayload } from "@/schemas/userSchema";

// create user API response
interface createUserResponse {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: Role;
  isActive: boolean;
  branchId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
// API Response interfaces
interface UpdateUserResponse {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  role: string;
  branch?: string;
  location?: string;
  branchId?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfilePictureResponse {
  profilePicture?: string;
  image?: string;
  url?: string;
  message?: string;
}

interface UpdateUserPayload {
  fullName?: string;
  name?: string;
  location?: string;
  branch?: string;
}

interface UpdatePasswordPayload {
  previousPassword: string;
  newPassword: string;
}

interface UpdatePasswordResponse {
  message: string;
  success: boolean;
}

// create a new user
export const createNewUser = async (
  payload: CreateUserPayload
): Promise<createUserResponse> => {
  const response = await api.post("/users", payload);
  return response.data;
};

// delete user
export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// block user
export const suspendUser = async (userId: string) => {
  const response = await api.patch(`/users/${userId}/block`);
  return response.data;
};

// unblock user
export const enableUser = async (userId: string) => {
  const response = await api.patch(`/users/${userId}/unblock`);
  return response.data;
};

// Get all users
export const getAllUsers = async (): Promise<CompanyUser[]> => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }

    let errorMessage = "Failed to fetch users";
    if (typeof error === "object" && error !== null) {
      const err = error as { response?: { data?: { message?: string } } };
      errorMessage = err.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserProfile> => {
  try {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
    let errorMessage = "Failed to fetch user";
    if (typeof error === "object" && error !== null) {
      const err = error as { response?: { data?: { message?: string } } };
      errorMessage = err.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

// Update user profile (name, location, etc.)
export const updateUser = async (
  userId: string,
  userData: UpdateUserPayload
): Promise<UpdateUserResponse> => {
  try {
    const response = await api.patch(`/users/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error updating users:",
        error.response?.data || error.message
      );
    }
    let errorMessage = "Failed to update user";
    if (typeof error === "object" && error !== null) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        errorMessage;
    }
    throw new Error(errorMessage);
  }
};

// Update user password
export const updateUserPassword = async (
  userId: string,
  passwordData: UpdatePasswordPayload
): Promise<UpdatePasswordResponse> => {
  try {
    console.log("Sending password update request:", { userId, passwordData });

    const response = await api.patch(
      `/users/${userId}/update-password`,
      passwordData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Password update response:", response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error updating password:",
        error.response?.data || error.message
      );
    }

    let errorMessage = "Failed to update password";
    if (typeof error === "object" && error !== null) {
      const err = error as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
        message?: string;
      };

      // Handle specific error cases
      if (err.response?.status === 401) {
        errorMessage = "Invalid current password";
      } else if (err.response?.status === 403) {
        errorMessage = "Unauthorized to update password";
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          errorMessage;
      }
    }
    throw new Error(errorMessage);
  }
};

// Update profile picture - optimized version
export const updateProfilePicture = async (
  userId: string,
  imageFile: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile); // Use "file" since it's the working field name

    console.log("Uploading profile picture with field name: file");

    const response = await api.patch(
      `/users/${userId}/profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data: ProfilePictureResponse = response.data;
    const imageUrl = data.profilePicture || data.image || data.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from server");
    }

    console.log("Profile picture upload successful");
    return imageUrl;
  } catch (error: unknown) {
    console.error("Failed to upload profile picture:", error);

    let errorMessage = "Failed to upload profile picture";
    if (typeof error === "object" && error !== null) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        errorMessage;
    }

    throw new Error(errorMessage);
  }
};

// Alternative: Keep the fallback mechanism but prioritize "file"
// export const updateProfilePictureWithFallback = async (
//   userId: string,
//   imageFile: File
// ): Promise<string> => {
//   try {
//     // Try "file" first since we know it works
//     const fieldNames = [
//       "file", // This is the one that works
//       "image", // Keep as fallback
//       "profilePicture",
//       "profile_picture",
//       "photo",
//     ];

//     for (const fieldName of fieldNames) {
//       try {
//         const formData = new FormData();
//         formData.append(fieldName, imageFile);

//         console.log(`Attempting upload with field name: ${fieldName}`);

//         const response = await api.patch(
//           `/users/${userId}/profile-picture/`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         const data: ProfilePictureResponse = response.data;
//         const imageUrl = data.profilePicture || data.image || data.url;

//         if (imageUrl) {
//           console.log(`Upload successful with field: ${fieldName}`);
//           return imageUrl;
//         }

//         throw new Error("No image URL in response");
//       } catch (error: unknown) {
//         if (isAxiosError(error)) {
//           console.error(
//             `Failed with field name ${fieldName}:`,
//             error.response?.status || error.message
//           );
//         }

//         // If it's the last field name and still failing, throw the error
//         if (fieldName === fieldNames[fieldNames.length - 1]) {
//           throw error;
//         }

//         // Continue to next field name if it's a 400/403 error
//         // continue;
//       }
//     }

//     throw new Error(
//       "All field name attempts failed for profile picture upload"
//     );
//   } catch (error: unknown) {
//     console.error("Failed to upload profile picture:", error);

//     let errorMessage = "Failed to upload profile picture";
//     if (typeof error === "object" && error !== null) {
//       const err = error as {
//         response?: { data?: { message?: string; error?: string } };
//         message?: string;
//       };
//       errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         errorMessage;
//     }

//     throw new Error(errorMessage);
//   }
// };
