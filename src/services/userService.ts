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

export const getUserById = async (id: string): Promise<UserProfile | null> => {
  if (!id) {
    if (process.env.NODE_ENV === "development") {
      console.warn("getUserById called with empty id");
    }
    return null;
  }

  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || error.message;

      if (status === 404) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`User ${id} not found (404)`, error.response?.data);
        }
        return null; // gracefully handle not found
      }

      if (process.env.NODE_ENV === "development") {
        console.error(
          "Error fetching user:",
          error.response?.data ?? error.message
        );
      }
      throw new Error(serverMessage);
    }

    // Non-Axios unexpected error
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error fetching user:", error);
    }
    throw new Error("Failed to fetch user");
  }
};

// Update user profile (name, location, etc.)
export const updateUserData = async (
  userId: string,
  userData: UpdateUserPayload
): Promise<UpdateUserResponse> => {
  try {
    const response = await api.patch(`/users/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
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
  

    const response = await api.patch(
      `/users/${userId}/update-password`,
      passwordData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
