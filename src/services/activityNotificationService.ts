import React from "react";
import {
  useNotificationStore,
  type Notification,
  type ActionType,
} from "@/stores/useNotificationStore";
import type { Role } from "@/types/types";
import api from "./baseApi";

// Activity log types based on your data
export interface ActivityLog {
  _id: string;
  action: string;
  details: string;
  performedBy: string;
  role: string;
  device: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Type for notification config entries
type NotificationConfigEntry = {
  recipients: Role[];
  type: "success" | "info" | "error";
  actionType: ActionType;
  priority: string;
  title: string;
  condition?: (log: ActivityLog) => boolean;
};

// Configuration for which activities should generate notifications
const NOTIFICATION_CONFIG: Record<string, NotificationConfigEntry> = {
  // Transaction-related notifications (for all admin roles)
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

  // User management notifications (for admins and maintainers)
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

  // Security-related notifications (for admins only)
  LOGIN: {
    recipients: ["MAINTAINER"] as Role[],
    type: "info",
    actionType: "client_added" as ActionType,
    priority: "low",
    title: "User Login",
    // Only notify for suspicious logins (new devices, unusual times)
    condition: (log: ActivityLog) => {
      return (
        log.device.includes("Unknown") ||
        log.device.includes("API Testing") ||
        isUnusualLoginTime(log.timestamp)
      );
    },
  },
};

// Helper function to detect unusual login times (outside business hours)
function isUnusualLoginTime(timestamp: string): boolean {
  const date = new Date(timestamp);
  const hour = date.getHours();
  // Flag logins outside 6 AM - 10 PM as unusual
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
  }

  return info;
}

// Generate notification message based on activity
function generateNotificationMessage(
  log: ActivityLog,
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

    default:
      return log.details;
  }
}

// Convert activity log to notification
export function activityLogToNotification(
  log: ActivityLog
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
    meta: {
      adminName: log.performedBy,
      branch: parsedInfo.branch,
      transactionId: parsedInfo.transactionId,
      timestamp: log.timestamp,
      ...parsedInfo,
    },
  };
}

// Service class to handle activity log notifications
export class ActivityNotificationService {
  private static instance: ActivityNotificationService;
  private lastProcessedId: string | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): ActivityNotificationService {
    if (!ActivityNotificationService.instance) {
      ActivityNotificationService.instance = new ActivityNotificationService();
    }
    return ActivityNotificationService.instance;
  }

  // Fetch and process new activity logs
  async processNewActivities() {
    try {
      const response = await api.get("/system-activity-logs");
      const logs: ActivityLog[] = response.data;
      // Sort by timestamp to process in chronological order
      const sortedLogs = logs.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Find new logs since last processed
      const newLogs = this.lastProcessedId
        ? sortedLogs.slice(
            sortedLogs.findIndex((log) => log._id === this.lastProcessedId) + 1
          )
        : sortedLogs.slice(-10); // Get last 10 if first time

      // Process each new log
      const { addNotification } = useNotificationStore.getState();

      for (const log of newLogs) {
        const notification = activityLogToNotification(log);
        if (notification) {
          addNotification(notification);
        }
      }

      // Update last processed ID
      if (sortedLogs.length > 0) {
        this.lastProcessedId = sortedLogs[sortedLogs.length - 1]._id;
      }

      return newLogs.length;
    } catch (error) {
      console.error("Error processing activity logs:", error);
      return 0;
    }
  }

  // Start automatic polling for new activities// Start automatic polling for new activities
  startPolling(intervalMs: number = 30000) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.processNewActivities();
    }, intervalMs);

    // Process immediately on start
    this.processNewActivities();
  }

  // Stop polling
  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Manually process a single activity log
  processSingleActivity(log: ActivityLog) {
    const notification = activityLogToNotification(log);
    if (notification) {
      const { addNotification } = useNotificationStore.getState();
      addNotification(notification);
    }
  }
}

// Hook for easy integration in React components
export function useActivityNotifications(
  autoStart: boolean = true,
  pollInterval: number = 30000
) {
  const service = ActivityNotificationService.getInstance();

  React.useEffect(() => {
    if (autoStart) {
      service.startPolling(pollInterval);

      return () => {
        service.stopPolling();
      };
    }
  }, [autoStart, pollInterval]);

  return {
    processNewActivities: () => service.processNewActivities(),
    startPolling: (interval?: number) => service.startPolling(interval),
    stopPolling: () => service.stopPolling(),
    processSingleActivity: (log: ActivityLog) =>
      service.processSingleActivity(log),
  };
}
