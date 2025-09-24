import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types/types";
import { useAuthStore } from "./useAuthStore";
import { getTabId, createTabSessionStorage } from "@/utils/tabSession";

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
  userId?: string;
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
    urgent?: boolean;
  };
};

type NotificationStore = {
  notifications: Notification[];
  unreadCount: number;
  lastSyncTime: number;

  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  clearUserNotifications: (userId: string) => void;
  setLastSyncTime: (time: number) => void;
};

// import type { PersistStorage, StorageValue } from "zustand/middleware";

// Use the shared tab session storage utility for consistency
// const customStorage: PersistStorage<NotificationStore> = {
//   getItem: (name: string): StorageValue<NotificationStore> | null => {
//     const item = sessionStorage.getItem(name);
//     if (!item) return null;
//     try {
//       return JSON.parse(item);
//     } catch {
//       return null;
//     }
//   },
//   setItem: (name: string, value: StorageValue<NotificationStore>): void => {
//     sessionStorage.setItem(name, JSON.stringify(value));
//   },
//   removeItem: (name: string): void => {
//     sessionStorage.removeItem(name);
//   },
// };

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      lastSyncTime: 0,

      addNotification: (notification) =>
        set((state) => {
          // Check if notification already exists
          const existingIndex = state.notifications.findIndex(
            (n) => n.id === notification.id
          );

          if (existingIndex !== -1) {
            // Update existing notification instead of adding duplicate
            const updatedNotifications = [...state.notifications];
            updatedNotifications[existingIndex] = {
              ...notification,
              createdAt:
                notification.createdAt instanceof Date
                  ? notification.createdAt
                  : new Date(notification.createdAt),
            };

            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter((n) => !n.read).length,
            };
          }

          const notificationWithDate = {
            ...notification,
            createdAt:
              notification.createdAt instanceof Date
                ? notification.createdAt
                : new Date(notification.createdAt),
          };

          const newNotifications = [
            notificationWithDate,
            ...state.notifications,
          ];
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
          if (!currentUser) return state;

          const updated = state.notifications.map((n) => {
            // Check if notification is for current user
            const isForCurrentUser = isNotificationForUser(n, currentUser);
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
          if (!currentUser) return state;

          const updated = state.notifications.filter(
            (n) => !isNotificationForUser(n, currentUser)
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
      name: `notification-storage-${getTabId()}`,
      storage: createTabSessionStorage(), // Use shared session storage utility
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

// Enhanced helper function to check if notification is for user
function isNotificationForUser(
  notification: Notification,
  user: { id: string; role: string }
): boolean {
  if (!user?.role) return false;

  // Check if notification is for current user role
  const userRoleUpper = user.role.toUpperCase() as Role;
  const isForCurrentRole = notification.recipients.some(
    (role) => role.toUpperCase() === userRoleUpper
  );

  if (!isForCurrentRole) {
    return false;
  }

  // Notification targeting logic:
  // 1. If userId is specified and matches current user -> show
  // 2. If userId is undefined (global notification) and role matches -> show
  // 3. If userId is specified but doesn't match current user -> don't show
  if (notification.userId !== undefined) {
    return notification.userId === user.id;
  }

  // Global notification for the role
  return true;
}

// Enhanced filtered notifications hook
export const useFilteredNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);

  if (!user?.role || !user?.id) {
    return [];
  }

  const filtered = notifications.filter((notification) =>
    isNotificationForUser(notification, user)
  );

  // Sort by creation date (newest first) and unread first
  const sorted = filtered.sort((a, b) => {
    // Unread notifications first
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sorted;
};

// Enhanced unread count hook
export const useUnreadNotificationCount = () => {
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);

  if (!user?.id || !user?.role) {
    return 0;
  }

  const unreadCount = notifications.filter((notification) => {
    return isNotificationForUser(notification, user) && !notification.read;
  }).length;

  return unreadCount;
};
