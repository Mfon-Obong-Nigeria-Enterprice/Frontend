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

// Generate temporary password for user -backend handle generation of password
export const generateTemporaryPassword = async (
  userId: string
): Promise<GeneratePasswordResponse> => {
  try {
    const response = await api.patch(`/users/${userId}/forgot-password`);

    // Backend returns: { message, temporaryPassword, expiresAt }
    return {
      temporaryPassword: response.data.temporaryPassword,
      expiresAt: response.data.expiresAt,
      message: response.data.message,
    };
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
