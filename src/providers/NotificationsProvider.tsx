import React from "react";
import { useActivityNotifications } from "@/services/activityNotificationService";
import { useAuthStore } from "@/stores/useAuthStore";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAuthStore((state) => state.user);

  console.log(
    "🏠 NotificationProvider rendered, user:",
    user?.email,
    "role:",
    user?.role
  );

  useActivityNotifications(
    !!user, // Only start when user is logged in
    30000 // Poll every 30 seconds
  );

  return <>{children}</>;
};
