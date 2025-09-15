import api from "./baseApi";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Role } from "@/types/types";

// Types
interface GeneratePasswordResponse {
  temporaryPassword: string;
  expiresAt: string;
  message: string;
}

interface SendToBranchAdminRequest {
  userId: string;
  branchAdminId: string;
  branchAdminEmail: string; // Add email field
  branchId: string; // Add branch ID field
  message: string;
  temporaryPassword: string;
}

interface SupportRequestData {
  issueType: string;
  email: string;
  description?: string;
}

interface BranchNotification {
  _id: string;
  branch: string;
  message: string;
  temporaryPassword: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Generate temporary password for user - backend handles generation of password
export const generateTemporaryPassword = async (
  userId: string
): Promise<GeneratePasswordResponse> => {
  try {
    const response = await api.patch(`/users/${userId}/forgot-password`);

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
    // Use the correct API payload structure
    const response = await api.post("/maintenance-mode/notify-branch-admin", {
      email: request.branchAdminEmail,
      branch: request.branchId,
      temporaryPassword: request.temporaryPassword,
    });

    // Create local notification for immediate feedback
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      const { addNotification } = useNotificationStore.getState();

      addNotification({
        id: `password-sent-${Date.now()}`,
        title: "Password Reset Notification Sent",
        message: `Temporary password has been sent to the branch admin ${currentUser.name} successfully`,
        type: "success",
        read: false,
        createdAt: new Date(),
        recipients: [currentUser.role as Role],
        userId: currentUser.id,
        action: "password_reset_sent",
        meta: {
          adminName: currentUser.name,
          branchAdminEmail: request.branchAdminEmail,
          temporaryPassword: request.temporaryPassword,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return response.data;
  } catch (error) {
    console.error("Error sending password to branch admin:", error);
    throw error;
  }
};

// Send support request to maintainer
export const sendSupportRequest = async (
  supportData: SupportRequestData
): Promise<void> => {
  try {
    const response = await api.post("/maintenance-mode/contact-support", {
      email: supportData.email,
      message:
        supportData.description || `Support request: ${supportData.issueType}`,
    });

    // Create notification for the user who sent the request
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      const { addNotification } = useNotificationStore.getState();

      addNotification({
        id: `support-request-${Date.now()}`,
        title: "Support Request Sent",
        message: `Your support request has been sent to the maintainer`,
        type: "info",
        read: false,
        createdAt: new Date(),
        recipients: [currentUser.role as Role],
        userId: currentUser.id,
        action: "support_request_sent",
        meta: {
          issueType: supportData.issueType,
          userEmail: supportData.email,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Create a notification for maintainers about the support request
    // This simulates what the backend should do - create notifications for maintainers
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      id: `support-request-maintainer-${Date.now()}`,
      title: "New Support Request",
      message: `Support request from ${supportData.email}: ${supportData.issueType}`,
      type: "error",
      read: false,
      createdAt: new Date(),
      recipients: ["MAINTAINER"],
      userId: "maintainer", // This should ideally come from the actual maintainer user ID
      action: "support_request_received",
      meta: {
        issueType: supportData.issueType,
        userEmail: supportData.email,
        description: supportData.description,
        timestamp: new Date().toISOString(),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error sending support request:", error);
    throw error;
  }
};

// Get all temporary password notifications (for branch admins)
export const getBranchNotifications = async (): Promise<
  BranchNotification[]
> => {
  try {
    const response = await api.get("/branch-notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching branch notifications:", error);
    throw error;
  }
};

// Service to sync branch notifications with local notification store
export const syncBranchNotifications = async (): Promise<void> => {
  try {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.role !== "ADMIN") {
      return; // Only branch admins should sync these notifications
    }

    const branchNotifications = await getBranchNotifications();
    const { notifications, addNotification } = useNotificationStore.getState();

    // Get existing notification IDs to avoid duplicates
    const existingIds = new Set(notifications.map((n) => n.id));

    // Convert branch notifications to local notifications (avoid duplicates)
    branchNotifications.forEach((notification) => {
      if (!existingIds.has(notification._id)) {
        addNotification({
          id: notification._id,
          title: "Password Reset Notification",
          message: `${notification.message} Password: ${notification.temporaryPassword}`,
          type: "info",
          read: false,
          createdAt: new Date(notification.createdAt),
          recipients: ["ADMIN"],
          userId: currentUser.id,
          action: "password_reset_received",
          meta: {
            temporaryPassword: notification.temporaryPassword,
            branchId: notification.branch,
            createdBy: notification.createdBy,
            timestamp: notification.createdAt,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error syncing branch notifications:", error);
  }
};

// Mark branch notification as read (remove this if endpoint doesn't exist)
export const markBranchNotificationRead = async (
  notificationId: string
): Promise<void> => {
  try {
    // Since this endpoint doesn't exist yet, we'll handle marking as read locally
    const { markAsRead } = useNotificationStore.getState();
    markAsRead(notificationId);
    console.log(`Marked notification ${notificationId} as read locally`);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};
