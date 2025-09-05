import api from "./baseApi";

// Types
interface GeneratePasswordResponse {
  temporaryPassword: string;
  expiresAt: string;
  message: string;
}

interface SendToBranchAdminRequest {
  userId: string;
  branchAdminId: string;
  message: string;
  temporaryPassword: string;
}

// Generate a secure temporary password
const generateSecurePassword = (): string => {
  const length = 12;
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = "";

  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

// Generate temporary password for user using PATCH method
export const generateTemporaryPassword = async (
  userId: string
): Promise<GeneratePasswordResponse> => {
  try {
    const temporaryPassword = generateSecurePassword();

    const response = await api.patch(`/users/${userId}/forgot-password`, {
      newPassword: temporaryPassword,
    });

    // Return the password along with any backend response data
    return {
      temporaryPassword,
      expiresAt:
        response.data.expiresAt ||
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default 24 hours
      message:
        response.data.message || "Temporary password generated successfully",
    };
  } catch (error) {
    console.error("Error generating temporary password:", error);
    throw error;
  }
};

// Alternative approach if backend generates the password and returns it
export const generateTemporaryPasswordFromBackend = async (
  userId: string
): Promise<GeneratePasswordResponse> => {
  try {
    // If your backend generates the password internally, you might send a flag instead
    const response = await api.patch(`/users/${userId}/forgot-password`, {
      newPassword: generateSecurePassword(), // Or use a flag like generateTemporary: true
    });

    return response.data;
  } catch (error) {
    console.error("Error generating temporary password:", error);
    throw error;
  }
};

// Send temporary password to branch admin via notification
export const sendPasswordToBranchAdmin = async (
  request: SendToBranchAdminRequest
): Promise<void> => {
  try {
    const response = await api.post("/notifications/send-password", {
      userId: request.userId,
      recipientId: request.branchAdminId,
      message: request.message,
      temporaryPassword: request.temporaryPassword,
      type: "PASSWORD_RESET",
      priority: "HIGH",
    });
    return response.data;
  } catch (error) {
    console.error("Error sending password to branch admin:", error);
    throw error;
  }
};

// Alternative: If notifications endpoint doesn't exist, use a general notification endpoint
export const sendNotificationToBranchAdmin = async (
  request: SendToBranchAdminRequest
): Promise<void> => {
  try {
    const response = await api.post("/notifications", {
      recipientId: request.branchAdminId,
      title: "Password Reset Request",
      message: request.message,
      type: "PASSWORD_RESET",
      metadata: {
        userId: request.userId,
        temporaryPassword: request.temporaryPassword,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending notification to branch admin:", error);
    throw error;
  }
};
