import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types/types";
import { useAuthStore } from "./useAuthStore";

export type ActionType =
  | "category_added"
  | "product_added"
  | "client_added"
  | "transaction_completed";

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

          // Add current user ID to notification if not present
          const currentUser = useAuthStore.getState().user;
          const notificationWithUser = {
            ...notification,
            userId: notification.userId || currentUser?.id || "unknown",
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
          const updated = state.notifications.map((n) =>
            n.userId === currentUser?.id ? { ...n, read: true } : n
          );
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
      // Only persist certain fields
      // partialize removed; customStorage handles serialization
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

  // Filter by role and user (only show current user's notifications)
  return notifications.filter((notification) => {
    // Check if notification is for current user
    const isForCurrentUser =
      !notification.userId || notification.userId === user.id;

    // Check if notification is for current user role
    const isForCurrentRole = notification.recipients.some(
      (role) => role.toUpperCase() === userRole
    );

    return isForCurrentUser && isForCurrentRole;
  });
};

// Hook to get unread count for current user
export const useUnreadNotificationCount = () => {
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);

  if (!user?.id) return 0;

  return notifications.filter((notification) => {
    const isForCurrentUser =
      !notification.userId || notification.userId === user.id;
    const userRole = user.role?.toUpperCase();
    const isForCurrentRole = notification.recipients.some(
      (role) => role.toUpperCase() === userRole
    );

    return isForCurrentUser && isForCurrentRole && !notification.read;
  }).length;
};
