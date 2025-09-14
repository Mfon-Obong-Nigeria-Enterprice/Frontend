import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types/types";
import { useAuthStore } from "./useAuthStore";

export type ActionType =
  | "category_added"
  | "product_added"
  | "client_added"
  | "transaction_completed"
  | "password_reset_sent"
  | "support_request_sent"
  | "support_request_received"
  | "password_reset_received";

export type NotificationType = "success" | "error" | "info";

export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: NotificationType;
  action: ActionType;
  createdAt: Date;
  recipients: Role[];
  userId?: string; // Add userId to associate notifications with specific users
  meta?: {
    adminName?: string;
    staffName?: string;
    branch?: string;
    transactionId?: string;
    timestamp?: string;
    userEmail?: string;
    temporaryPassword?: string;
    branchId?: string;
    branchAdminEmail?: string;
    createdBy?: string;
    description?: string;
    issueType?: string;
  };
};

type NotificationStore = {
  notifications: Notification[];
  unreadCount: number;
  lastSyncTime: number; // Track when we last synced with server

  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  clearUserNotifications: (userId: string) => void; // Clear notifications for specific user
  setLastSyncTime: (time: number) => void;
};

// Custom storage object to handle Date serialization and match PersistStorage interface
import type { PersistStorage, StorageValue } from "zustand/middleware";

const customStorage: PersistStorage<NotificationStore> = {
  getItem: (name: string): StorageValue<NotificationStore> | null => {
    const item = localStorage.getItem(name);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<NotificationStore>): void => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      lastSyncTime: 0,

      addNotification: (notification) =>
        set((state) => {
          console.log(
            "📨 Adding notification:",
            notification.title,
            notification.id
          );

          // Check if notification already exists
          const existingIndex = state.notifications.findIndex(
            (n) => n.id === notification.id
          );

          if (existingIndex !== -1) {
            console.log(
              "🔄 Notification already exists, skipping:",
              notification.id
            );
            return state;
          }

          // Add current user ID to notification if not present and userId is undefined
          const currentUser = useAuthStore.getState().user;
          const notificationWithUser = {
            ...notification,
            userId:
              notification.userId !== undefined
                ? notification.userId
                : currentUser?.id || "unknown",
            // Ensure createdAt is a Date object
            createdAt:
              notification.createdAt instanceof Date
                ? notification.createdAt
                : new Date(notification.createdAt),
          };

          const newNotifications = [
            notificationWithUser,
            ...state.notifications,
          ];
          console.log(`📈 Total notifications now: ${newNotifications.length}`);

          const unreadCount = newNotifications.filter((n) => !n.read).length;

          return {
            notifications: newNotifications,
            unreadCount,
          };
        }),

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      markAsUnread: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: false } : n
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      markAllAsRead: () =>
        set((state) => {
          const currentUser = useAuthStore.getState().user;
          const updated = state.notifications.map((n) => {
            // Mark as read if it's for current user OR if it's a global notification for current user's role
            const isForCurrentUser =
              n.userId === currentUser?.id ||
              (n.userId === undefined &&
                n.recipients.includes(currentUser?.role as Role));
            return isForCurrentUser ? { ...n, read: true } : n;
          });
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      deleteNotification: (id) =>
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      clearNotifications: () =>
        set((state) => {
          const currentUser = useAuthStore.getState().user;
          const updated = state.notifications.filter(
            (n) => n.userId !== currentUser?.id
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      clearUserNotifications: (userId) =>
        set((state) => {
          const updated = state.notifications.filter(
            (n) => n.userId !== userId
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        }),

      setLastSyncTime: (time) =>
        set(() => ({
          lastSyncTime: time,
        })),
    }),
    {
      name: "notification-storage", // Storage key
      storage: customStorage,
      // Rehydrate dates when loading from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert date strings back to Date objects
          state.notifications = state.notifications.map((n) => ({
            ...n,
            createdAt: new Date(n.createdAt),
          }));
          // Recalculate unread count
          state.unreadCount = state.notifications.filter((n) => !n.read).length;
        }
      },
    }
  )
);

// Enhanced filtered notifications hook that considers user context
export const useFilteredNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);

  if (!user?.role || !user?.id) return [];

  const userRole = user.role.toUpperCase();

  // Filter by role and user - include both user-specific and global notifications
  const filtered = notifications.filter((notification) => {
    // Check if notification is for current user role
    const isForCurrentRole = notification.recipients.some(
      (role) => role.toUpperCase() === userRole
    );

    if (!isForCurrentRole) {
      return false;
    }

    // Include notifications that are:
    // 1. Specifically for this user (userId matches)
    // 2. Global notifications for this role (userId is undefined)
    const isForCurrentUser =
      notification.userId === user.id || // Specifically for this user
      notification.userId === undefined; // Global notification for all users of the role

    return isForCurrentUser;
  });

  console.log(`🔍 Filtering notifications for user ${user.id} (${userRole}):`, {
    total: notifications.length,
    filtered: filtered.length,
    userRole,
    userId: user.id,
  });

  return filtered;
};

// Hook to get unread count for current user
export const useUnreadNotificationCount = () => {
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);

  if (!user?.id) return 0;

  const userRole = user.role?.toUpperCase();

  const unreadCount = notifications.filter((notification) => {
    const isForCurrentRole = notification.recipients.some(
      (role) => role.toUpperCase() === userRole
    );

    const isForCurrentUser =
      notification.userId === user.id || // Specifically for this user
      notification.userId === undefined; // Global notification for all users of the role

    return isForCurrentRole && isForCurrentUser && !notification.read;
  }).length;

  console.log(
    `🔔 Unread count for user ${user.id} (${userRole}): ${unreadCount}`
  );

  return unreadCount;
};
