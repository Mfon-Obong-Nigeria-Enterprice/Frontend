import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWebSocketNotifications } from "@/services/webSocketNotificationService";
import {
  ActivityNotificationService,
  useActivityNotifications,
} from "@/services/activityNotificationService";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";

interface NotificationProviderProps {
  children: React.ReactNode;
}

// Hook that combines both notification systems
export const useActivityNotification = () => {
  const service = ActivityNotificationService.getInstance();

  const createNotificationFromActivity = (log: ActivityLogs) => {
    service.processSingleActivity(log);
  };

  const processNewActivities = async () => {
    return await service.processNewActivities();
  };

  return {
    createNotificationFromActivity,
    processNewActivities,
    startPolling: (interval?: number) => service.startPolling(interval),
    stopPolling: () => service.stopPolling(),
    clearUserData: () => service.clearUserData(),
  };
};

// Enhanced NotificationProvider with WebSocket + Activity Log support
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const user = useAuthStore((state) => state.user);

  // Initialize WebSocket notifications (primary - real-time)
  const webSocketNotifications = useWebSocketNotifications(true);

  // Initialize Activity Log notifications (secondary - fallback for older events)
  const activityNotifications = useActivityNotifications(true, 60000); // Longer interval since WebSocket handles real-time

  // Handle user authentication changes
  useEffect(() => {
    if (user?.id && user?.role) {
      // console.log(
      //   `NotificationProvider: User authenticated - ${user.name} (${user.role})`
      // );
      console.log(`WebSocket connected: ${webSocketNotifications.isConnected}`);
    } else {
      console.log(
        "NotificationProvider: No user, stopping notification services"
      );
      activityNotifications.stopPolling();
      webSocketNotifications.disconnect();
    }

    return () => {
      if (!user?.id) {
        activityNotifications.clearUserData();
      }
    };
  }, [user?.id, user?.role, activityNotifications, webSocketNotifications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activityNotifications.stopPolling();
      webSocketNotifications.disconnect();
    };
  }, [activityNotifications, webSocketNotifications]);

  return <>{children}</>;
};

export default NotificationProvider;
