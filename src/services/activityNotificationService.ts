/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./baseApi";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";
import {
  useNotificationStore,
  type Notification,
  type ActionType,
} from "@/stores/useNotificationStore";
import type { Role } from "@/types/types";
import {
  // syncBranchNotifications,
  // syncSupportNotifications,
  syncAllMaintenanceNotifications,
} from "@/services/passwordService";

// Type for notification config entries
type NotificationConfigEntry = {
  recipients: Role[];
  type: "success" | "info" | "error";
  actionType: ActionType;
  priority: string;
  title: string;
  condition?: (log: ActivityLogs) => boolean;
};

// Configuration for which activities should generate notifications
const NOTIFICATION_CONFIG: Record<string, NotificationConfigEntry> = {
  // Transaction-related notifications (for all roles)
  TRANSACTION_CREATED: {
    recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
    type: "success",
    actionType: "transaction_completed" as ActionType,
    priority: "high",
    title: "New Transaction Created",
  },
  CLIENT_TRANSACTION_ADDED: {
    recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
    type: "info",
    actionType: "transaction_completed" as ActionType,
    priority: "medium",
    title: "Client Transaction Updated",
  },

  // User management notifications (for super_admins and maintainers)
  USER_CREATED: {
    recipients: ["MAINTAINER", "SUPER_ADMIN"] as Role[],
    type: "success",
    actionType: "client_added" as ActionType,
    priority: "medium",
    title: "New User Created",
  },
  USER_BLOCKED: {
    recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
    type: "error",
    actionType: "client_added" as ActionType,
    priority: "high",
    title: "User Blocked",
  },
  USER_UNBLOCKED: {
    recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
    type: "info",
    actionType: "client_added" as ActionType,
    priority: "medium",
    title: "User Unblocked",
  },

  // Stock management notifications
  STOCK_UPDATED: {
    recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
    type: "info",
    actionType: "product_added" as ActionType,
    priority: "low",
    title: "Stock Level Changed",
  },

  // Security-related notifications (for maintainer only)
  LOGIN: {
    recipients: ["MAINTAINER"] as Role[],
    type: "info",
    actionType: "client_added" as ActionType,
    priority: "low",
    title: "User Login",
    condition: (log: ActivityLogs) => {
      return (
        log.device.includes("Unknown") ||
        log.device.includes("API Testing") ||
        isUnusualLoginTime(log.timestamp)
      );
    },
  },

  // Support request notifications (for maintainers)
  SUPPORT_REQUEST: {
    recipients: ["MAINTAINER"] as Role[],
    type: "error",
    actionType: "support_request_received" as ActionType,
    priority: "high",
    title: "New Support Request",
  },

  // Password reset notifications (for branch admins)
  PASSWORD_RESET_SENT: {
    recipients: ["ADMIN"] as Role[],
    type: "info",
    actionType: "password_reset_received" as ActionType,
    priority: "high",
    title: "Password Reset Notification",
  },

  // Login assistance request (for maintainers)
  LOGIN_ASSISTANCE_REQUEST: {
    recipients: ["MAINTAINER"] as Role[],
    type: "error",
    actionType: "support_request_received" as ActionType,
    priority: "high",
    title: "Login Assistance Required",
  },
};

// Helper function to detect unusual login times (outside business hours)
function isUnusualLoginTime(timestamp: string): boolean {
  const date = new Date(timestamp);
  const hour = date.getHours();
  return hour < 6 || hour > 22;
}

// Extract meaningful information from activity details
function parseActivityDetails(action: string, details: string) {
  const info: Record<string, any> = {};

  switch (action) {
    case "TRANSACTION_CREATED": {
      const transactionMatch = details.match(
        /Transaction (\w+) created for ([^(]+)\((\w+)\) - Total: (\d+)/
      );
      if (transactionMatch) {
        info.transactionId = transactionMatch[1];
        info.clientName = transactionMatch[2].trim();
        info.transactionType = transactionMatch[3];
        info.amount = parseInt(transactionMatch[4]);
      }
      break;
    }

    case "CLIENT_TRANSACTION_ADDED": {
      const clientMatch = details.match(
        /(\w+) transaction added for ([^:]+): (\d+) - Balance: (-?\d+)/
      );
      if (clientMatch) {
        info.transactionType = clientMatch[1];
        info.clientName = clientMatch[2].trim();
        info.amount = parseInt(clientMatch[3]);
        info.balance = parseInt(clientMatch[4]);
      }
      break;
    }

    case "USER_CREATED": {
      const userMatch = details.match(
        /New user created: ([^(]+)\(([^)]+)\) with role (\w+)/
      );
      if (userMatch) {
        info.userName = userMatch[1].trim();
        info.email = userMatch[2];
        info.userRole = userMatch[3];
      }
      break;
    }

    case "USER_BLOCKED":
    case "USER_UNBLOCKED": {
      const blockMatch = details.match(
        /User (?:blocked|unblocked): ([^(]+)\(([^)]+)\)(?:\s*-\s*Reason:\s*(.+))?/
      );
      if (blockMatch) {
        info.userName = blockMatch[1].trim();
        info.email = blockMatch[2];
        info.reason = blockMatch[3] || "N/A";
      }
      break;
    }

    case "STOCK_UPDATED": {
      const stockMatch = details.match(
        /Stock decreased for ([^:]+): (\d+) ([^(]+)\(New stock: (\d+)\)/
      );
      if (stockMatch) {
        info.productName = stockMatch[1].trim();
        info.quantity = parseInt(stockMatch[2]);
        info.unit = stockMatch[3].trim();
        info.newStock = parseInt(stockMatch[4]);
      }
      break;
    }

    case "SUPPORT_REQUEST": {
      const supportMatch = details.match(
        /Support request from ([^:]+): Issue - ([^,]+), Email - ([^,]+)(?:, Description - (.+))?/
      );
      if (supportMatch) {
        info.userEmail = supportMatch[3];
        info.issueType = supportMatch[2];
        info.description = supportMatch[4] || "";
        info.requestedBy = supportMatch[1];
      }
      break;
    }

    case "PASSWORD_RESET_SENT": {
      const passwordMatch = details.match(
        /Password reset notification sent to ([^(]+)\(([^)]+)\) for user ([^(]+)\(([^)]+)\) - Password: (\w+)/
      );
      if (passwordMatch) {
        info.branchAdminName = passwordMatch[1].trim();
        info.branchAdminEmail = passwordMatch[2];
        info.userName = passwordMatch[3].trim();
        info.userEmail = passwordMatch[4];
        info.temporaryPassword = passwordMatch[5];
      }
      break;
    }
  }

  return info;
}

// Generate notification message based on activity
function generateNotificationMessage(
  log: ActivityLogs,
  parsedInfo: Record<string, any>
): string {
  switch (log.action) {
    case "TRANSACTION_CREATED":
      return parsedInfo.amount
        ? `Transaction ${parsedInfo.transactionId} created for ${
            parsedInfo.clientName
          } - ₦${parsedInfo.amount.toLocaleString()}`
        : log.details;

    case "CLIENT_TRANSACTION_ADDED":
      return parsedInfo.clientName
        ? `${
            parsedInfo.transactionType
          } transaction of ₦${parsedInfo.amount?.toLocaleString()} added for ${
            parsedInfo.clientName
          }`
        : log.details;

    case "USER_CREATED":
      return parsedInfo.userName
        ? `${parsedInfo.userName} (${parsedInfo.userRole}) has been added to the system`
        : log.details;

    case "USER_BLOCKED":
      return parsedInfo.userName
        ? `${parsedInfo.userName} has been blocked. Reason: ${parsedInfo.reason}`
        : log.details;

    case "USER_UNBLOCKED":
      return parsedInfo.userName
        ? `${parsedInfo.userName} has been unblocked and can access the system again`
        : log.details;

    case "STOCK_UPDATED":
      return parsedInfo.productName
        ? `${parsedInfo.productName} stock updated - ${parsedInfo.quantity} ${parsedInfo.unit} used (${parsedInfo.newStock} remaining)`
        : log.details;

    case "LOGIN":
      return `${log.performedBy} logged in from ${log.device}`;

    case "SUPPORT_REQUEST":
      return parsedInfo.issueType
        ? `Support request: "${parsedInfo.issueType}" from ${
            parsedInfo.userEmail
          }. ${
            parsedInfo.description
              ? "Description: " +
                parsedInfo.description.substring(0, 100) +
                "..."
              : ""
          }`
        : log.details;

    case "PASSWORD_RESET_SENT":
      return parsedInfo.userName
        ? `Temporary password sent to ${parsedInfo.branchAdminName} for user ${parsedInfo.userName}. Password: ${parsedInfo.temporaryPassword}`
        : log.details;

    case "LOGIN_ASSISTANCE_REQUEST":
      return parsedInfo.userEmail
        ? `Login assistance requested by ${parsedInfo.userEmail}. Issue: ${parsedInfo.issueType}`
        : log.details;

    default:
      return log.details;
  }
}

// Convert activity log to notification
export function activityLogToNotification(
  log: ActivityLogs,
  userId?: string
): Notification | null {
  const config =
    NOTIFICATION_CONFIG[log.action as keyof typeof NOTIFICATION_CONFIG];

  if (!config) return null;

  // Check if there's a condition that must be met
  if (config.condition && !config.condition(log)) {
    return null;
  }

  const parsedInfo = parseActivityDetails(log.action, log.details);

  return {
    id: log._id,
    title: config.title,
    message: generateNotificationMessage(log, parsedInfo),
    read: false,
    type: config.type,
    action: config.actionType,
    createdAt: new Date(log.timestamp),
    recipients: config.recipients,
    userId: userId,
    meta: {
      adminName: log.performedBy,
      branch: parsedInfo.branch,
      transactionId: parsedInfo.transactionId,
      timestamp: log.timestamp,
      ...parsedInfo,
    },
  };
}

// Enhanced ActivityNotificationService
export class ActivityNotificationService {
  private static instance: ActivityNotificationService;
  private lastProcessedId: string | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private maintenanceSyncInterval: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  private loadLastProcessedId(): string | null {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) return null;

    const key = `notification-last-processed-${currentUser.id}`;
    return localStorage.getItem(key);
  }

  private saveLastProcessedId(id: string) {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) return;

    const key = `notification-last-processed-${currentUser.id}`;
    localStorage.setItem(key, id);
    this.lastProcessedId = id;
  }

  static getInstance(): ActivityNotificationService {
    if (!ActivityNotificationService.instance) {
      ActivityNotificationService.instance = new ActivityNotificationService();
    }
    return ActivityNotificationService.instance;
  }

  private initializeForUser() {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      console.warn(
        "ActivityNotificationService: No user found during initialization"
      );
      return false;
    }

    this.lastProcessedId = this.loadLastProcessedId();
    this.retryCount = 0;
    return true;
  }

  // Enhanced to handle maintenance notifications properly
  async processNewActivities(): Promise<number> {
    if (this.isProcessing) {
      
      return 0;
    }

    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      console.warn("ActivityNotificationService: No authenticated user");
      return 0;
    }

    this.isProcessing = true;

    try {
      // Process regular activity logs
      const response = await api.get("/system-activity-logs");
      const logs: ActivityLogs[] = response.data;

      if (!Array.isArray(logs)) {
        throw new Error("Invalid response format: expected array of logs");
      }

      if (!this.lastProcessedId) {
        this.lastProcessedId = this.loadLastProcessedId();
      }

      const sortedLogs = logs.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      let newLogs: ActivityLogs[] = [];

      if (this.lastProcessedId) {
        const lastIndex = sortedLogs.findIndex(
          (log) => log._id === this.lastProcessedId
        );

        if (lastIndex !== -1) {
          newLogs = sortedLogs.slice(lastIndex + 1);
        } else {
          newLogs = sortedLogs.slice(-5);
        }
      } else {
        newLogs = sortedLogs.slice(-10);
      }

      const { addNotification } = useNotificationStore.getState();
      let processedCount = 0;

      for (const log of newLogs) {
        try {
          const notification = activityLogToNotification(log, currentUser.id);
          if (notification) {
            addNotification(notification);
            processedCount++;
          }
        } catch (error) {
          console.error(
            `ActivityNotificationService: Error processing log ${log._id}:`,
            error
          );
        }
      }

      if (sortedLogs.length > 0) {
        this.saveLastProcessedId(sortedLogs[sortedLogs.length - 1]._id);
      }

      this.retryCount = 0;

      return processedCount;
    } catch (error) {
      this.retryCount++;
      console.error(
        `ActivityNotificationService: Error processing activities (attempt ${this.retryCount}):`,
        error
      );

      if (this.retryCount >= this.maxRetries) {
        console.error(
          "ActivityNotificationService: Max retries reached, stopping polling"
        );
        this.stopPolling();
      }

      return 0;
    } finally {
      this.isProcessing = false;
    }
  }

  // Enhanced maintenance notification sync
  async syncMaintenanceNotifications(): Promise<void> {
    // const currentUser = useAuthStore.getState().user;

    // Check for valid authentication before syncing
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      console.warn(
        "syncMaintenanceNotifications: No authentication token available"
      );
      return;
    }

    try {
      await syncAllMaintenanceNotifications();
    } catch (error: any) {
      console.error("Error syncing maintenance notifications:", error);

      // Handle authentication errors
      if (error?.response?.status === 401) {
        console.warn(
          "Authentication failed during maintenance notification sync"
        );
        // Could trigger token refresh or logout here
      } else if (error?.response?.status === 403) {
        console.warn(
          "Insufficient permissions for maintenance notification sync"
        );
      }

      // Don't rethrow to prevent breaking the polling system
    }
  }

  startPolling(intervalMs: number = 30000) {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      console.warn(
        "ActivityNotificationService: Cannot start polling without authenticated user"
      );
      return;
    }

    if (!this.initializeForUser()) {
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.maintenanceSyncInterval) {
      clearInterval(this.maintenanceSyncInterval);
    }

    // Start activity log polling
    this.intervalId = setInterval(() => {
      this.processNewActivities();
    }, intervalMs);

    // Start maintenance notification sync based on role
    const syncInterval = currentUser.role === "MAINTAINER" ? 45000 : 60000; // More frequent for maintainers

    this.maintenanceSyncInterval = setInterval(() => {
      this.syncMaintenanceNotifications();
    }, syncInterval);

    // Initial processing
    this.processNewActivities();
    this.syncMaintenanceNotifications();
  }

  stopPolling() {
    if (this.intervalId) {
    
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.maintenanceSyncInterval) {
      
      clearInterval(this.maintenanceSyncInterval);
      this.maintenanceSyncInterval = null;
    }

    this.isProcessing = false;
  }

  clearUserData() {
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.id) {
      const { clearUserNotifications } = useNotificationStore.getState();
      clearUserNotifications(currentUser.id);

      const key = `notification-last-processed-${currentUser.id}`;
      localStorage.removeItem(key);
    }

    this.lastProcessedId = null;
    this.retryCount = 0;
    this.stopPolling();
  }

  processSingleActivity(log: ActivityLogs) {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      console.warn(
        "ActivityNotificationService: Cannot process activity without authenticated user"
      );
      return;
    }

    try {
      const notification = activityLogToNotification(log, currentUser.id);
      if (notification) {
        const { addNotification } = useNotificationStore.getState();
        addNotification(notification);
      }
    } catch (error) {
      console.error(
        `ActivityNotificationService: Error processing single activity:`,
        error
      );
    }
  }

  getStatus() {
    return {
      isPolling: !!this.intervalId,
      isProcessing: this.isProcessing,
      lastProcessedId: this.lastProcessedId,
      retryCount: this.retryCount,
      maintenanceSyncActive: !!this.maintenanceSyncInterval,
    };
  }
}

export function useActivityNotifications(
  autoStart: boolean = true,
  pollInterval: number = 30000
) {
  const service = ActivityNotificationService.getInstance();
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (autoStart && user?.id) {
      service.startPolling(pollInterval);

      return () => {
        service.stopPolling();
      };
    } else if (!user?.id) {
      service.stopPolling();
    }
  }, [autoStart, pollInterval, user?.id, user?.role, service]);

  React.useEffect(() => {
    if (!user?.id) {
      service.clearUserData();
    }
  }, [user?.id, service]);

  return {
    processNewActivities: () => service.processNewActivities(),
    syncMaintenanceNotifications: () => service.syncMaintenanceNotifications(),
    startPolling: (interval?: number) => service.startPolling(interval),
    stopPolling: () => service.stopPolling(),
    processSingleActivity: (log: ActivityLogs) =>
      service.processSingleActivity(log),
    clearUserData: () => service.clearUserData(),
    getStatus: () => service.getStatus(),
  };
}
