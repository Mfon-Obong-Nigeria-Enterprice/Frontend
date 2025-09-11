import { create } from "zustand";
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

  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => {
      // Check if notification already exists
      const existingIndex = state.notifications.findIndex(
        (n) => n.id === notification.id
      );

      if (existingIndex !== -1) {
        // Notification already exists, don't add duplicate
        return state;
      }

      const newNotifications = [notification, ...state.notifications];
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
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
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      return { notifications: updated, unreadCount: 0 };
    }),

  deleteNotification: (id) =>
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

export const useFilteredNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);

  if (!user?.role) return notifications;

  const userRole = user.role.toUpperCase();

  return notifications.filter((notification) =>
    notification.recipients.some((role) => role.toUpperCase() === userRole)
  );
};
