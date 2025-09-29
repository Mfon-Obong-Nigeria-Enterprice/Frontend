import React, { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  ActivityNotificationService,
  useActivityNotifications,
} from "@/services/activityNotificationService";
import { useWebSocketNotifications } from "@/services/webSocketNotificationService";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";

interface NotificationProviderProps {
  children: React.ReactNode;
}

// Enhanced hook with better error handling and debugging
export const useActivityNotification = () => {
  const service = ActivityNotificationService.getInstance();

  const createNotificationFromActivity = useCallback(
    (log: ActivityLogs) => {
      try {
        service.processSingleActivity(log);
      } catch (error) {
        console.error("Error creating notification from activity:", error);
      }
    },
    [service]
  );

  const processNewActivities = useCallback(async () => {
    try {
      const count = await service.processNewActivities();
      return count;
    } catch (error) {
      console.error("Error processing new activities:", error);
      return 0;
    }
  }, [service]);

  const startPolling = useCallback(
    (interval?: number) => {
      try {
        service.startPolling(interval);
      } catch (error) {
        console.error("Error starting polling:", error);
      }
    },
    [service]
  );

  const stopPolling = useCallback(() => {
    try {
      service.stopPolling();
    } catch (error) {
      console.error("Error stopping polling:", error);
    }
  }, [service]);

  const clearUserData = useCallback(() => {
    try {
      service.clearUserData();
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }, [service]);

  const getServiceStatus = useCallback(() => {
    return service.getStatus();
  }, [service]);

  return {
    createNotificationFromActivity,
    processNewActivities,
    startPolling,
    stopPolling,
    clearUserData,
    getServiceStatus,
  };
};

// Enhanced NotificationProvider with better lifecycle management
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const user = useAuthStore((state) => state.user);

  // Get the hook methods but disable auto-start to have more control
  const activityNotifications = useActivityNotifications(false, 30000);
  
  // Initialize WebSocket notifications for real-time updates
  const webSocketNotifications = useWebSocketNotifications(false);

  // Enhanced effect for user authentication changes
  useEffect(() => {
    if (user?.id && user?.role) {
      // Longer delay to ensure all stores and auth are properly initialized
      const timer = setTimeout(() => {
        try {
          console.log("NotificationProvider: Starting services for user:", user.email);
          activityNotifications.startPolling(30000);
          // Start WebSocket connection for real-time updates (using cookie authentication)
          webSocketNotifications.connect();
        } catch (error) {
          console.error("NotificationProvider: Error starting services:", error);
        }
      }, 1000); // Increased delay to 1 second

      return () => {
        clearTimeout(timer);
        try {
          // Clean up both services when component unmounts or user changes
          webSocketNotifications.disconnect();
        } catch (error) {
          console.error("NotificationProvider: Error cleaning up WebSocket:", error);
        }
      };
    } else {
      activityNotifications.stopPolling();
      
      // Stop WebSocket when user logs out
      try {
        webSocketNotifications.disconnect();
      } catch (error) {
        console.error("NotificationProvider: Error stopping WebSocket on logout:", error);
      }

      // Only clear data if user is completely logged out
      if (!user?.id) {
        activityNotifications.clearUserData();
      }
    }
  }, [user?.id, user?.role, activityNotifications, webSocketNotifications]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      activityNotifications.stopPolling();
      webSocketNotifications.disconnect();
    };
  }, [activityNotifications, webSocketNotifications]);

  return <>{children}</>;
};

export default NotificationProvider;
