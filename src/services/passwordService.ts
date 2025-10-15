import api from "./baseApi";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Role } from "@/types/types";
import { WebSocketNotificationService } from "./webSocketNotificationService";
import publicApi from "./unAuthorizeApi";

// Types
interface GeneratePasswordResponse {
  temporaryPassword: string;
  expiresAt: string;
  message: string;
}

interface SendToBranchAdminRequest {
  userId: string;
  branchAdminId: string;
  branchAdminEmail: string;
  branchId: string;
  message: string;
  temporaryPassword: string;
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

interface SupportNotification {
  _id: string;
  userEmail: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Generate temporary password for user
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
        id: `password-sent-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        title: "Password Reset Notification Sent",
        message: `Temporary password has been sent to branch admin ${request.branchAdminEmail} successfully`,
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

      // Also emit via WebSocket if available
      const wsService = WebSocketNotificationService.getInstance();
      if (wsService.isConnected()) {
        wsService.emitPasswordReset({
          branchAdminEmail: request.branchAdminEmail,
          temporaryPassword: request.temporaryPassword,
          userName: currentUser.name || "Unknown User",
        });
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error sending password to branch admin:", error);
    throw error;
  }
};

// Updated sendSupportRequest to use correct API endpoint
// Send support request (no auth required)
export const sendSupportRequest = async (supportData: {
  email: string;
  message: string;
}) => {
  try {
    // Call public endpoint with only email + message
    const response = await publicApi.post("/maintenance-mode/contact-support", {
      email: supportData.email,
      message: supportData.message,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending support request:", error);
    throw error;
  }
};

// Get all support notifications for maintainers (using correct endpoint)
export const getSupportNotifications = async (): Promise<
  SupportNotification[]
> => {
  try {
    const currentUser = useAuthStore.getState().user;

    // Only maintainers should access support notifications
    if (!currentUser || currentUser.role !== "MAINTAINER") {
      return [];
    }

    // No need to check for tokens in localStorage - cookies are sent automatically
    // The baseApi already has withCredentials: true configured
    const response = await api.get("/maintenance-mode/notifications");

    return response.data || [];
  } catch (error) {
    console.error("Error fetching support notifications:", error);

    return [];
  }
};

// Get all temporary password notifications (for branch admins)
export const getBranchNotifications = async (): Promise<
  BranchNotification[]
> => {
  try {
    const response = await api.get("/branch-notifications");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching branch notifications:", error);
    // Don't throw error if endpoint doesn't exist, just return empty array
    return [];
  }
};

// Enhanced sync function for maintainers to get support notifications
export const syncSupportNotifications = async (): Promise<void> => {
  try {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || currentUser.role !== "MAINTAINER") {
      return; // Only maintainers should sync these notifications
    }

    // No need to check for tokens in localStorage - cookies are sent automatically
    // The baseApi already has withCredentials: true configured
    const supportNotifications = await getSupportNotifications();

    if (!supportNotifications || supportNotifications.length === 0) {
      return;
    }

    const { notifications, addNotification } = useNotificationStore.getState();

    // Get existing notification IDs to avoid duplicates
    const existingIds = new Set(notifications.map((n) => n.id));

    let syncedCount = 0;

    // Convert support notifications to local notifications
    supportNotifications.forEach((notification) => {
      const notificationId = `support-${notification._id}`;

      if (!existingIds.has(notificationId)) {
        addNotification({
          id: notificationId,
          title: "🚨 New Support Request",
          message: `Urgent: Support request from ${
            notification.userEmail
          } - "${notification.message.substring(0, 100)}${
            notification.message.length > 100 ? "..." : ""
          }"`,
          type: "error",
          read: false,
          createdAt: new Date(notification.createdAt),
          recipients: ["MAINTAINER"],
          userId: undefined, // Global for all maintainers
          action: "support_request_received",
          meta: {
            userEmail: notification.userEmail,
            issueType: "Support Request", // Default since API doesn't provide specific issue type
            description: notification.message,
            timestamp: notification.createdAt,
            urgent: true,
          },
        });
        syncedCount++;
      }
    });

    console.log(
      `Successfully synced ${syncedCount} new support notifications for maintainer`
    );
  } catch (error) {
    console.error("Error syncing support notifications:", error);
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

// Enhanced sync function that handles both support and branch notifications
export const syncAllMaintenanceNotifications = async (): Promise<void> => {
  const currentUser = useAuthStore.getState().user;

  if (!currentUser?.role) {
    console.warn("No authenticated user found for notification sync");
    return;
  }

  try {
    // Sync support notifications for maintainers
    if (currentUser.role === "MAINTAINER") {
      await syncSupportNotifications();
    }

    // Sync branch notifications for admins
    if (currentUser.role === "ADMIN") {
      await syncBranchNotifications();
    }
  } catch (error) {
    console.error("Error in syncAllMaintenanceNotifications:", error);
  }
};

// Mark notification as read locally
export const markNotificationRead = async (
  notificationId: string
): Promise<void> => {
  try {
    const { markAsRead } = useNotificationStore.getState();
    markAsRead(notificationId);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};
