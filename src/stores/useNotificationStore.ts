import { create } from "zustand";
import type { Role } from "@/types/types";

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

// import { create } from "zustand";

// import type { Role } from "@/types/types";

// type ActionType =
//   | "category_added"
//   | "product_added"
//   | "client_added"
//   | "transaction_completed";

// export type Notification = {
//   id: string;
//   title: string;
//   description: string;
//   read: boolean;
//   type: "success" | "error" | "info";
//   action: ActionType;
//   message: string;
//   createdAt: Date;

//   // Who should see it
//   recipients: Role[];

//   // Extra metadata (for conditional rendering)
//   meta?: {
//     adminName?: string;
//     staffName?: string;
//     branch?: string;
//     transactionId?: string;
//     timestamp?: string;
//   };
// };

// type NotificationStore = {
//   notifications: Notification[];
//   addNotification: (n: Notification) => void;
//   markAsRead: (id: string) => void;
//   markAsUnread: (id: string) => void;
//   markAllAsRead: () => void;
//   clearNotifications: () => void;
// };

// export const useNotificationStore = create<NotificationStore>((set) => ({
//   notifications: [],
//   addNotification: (n) =>
//     set((state) => ({ notifications: [n, ...state.notifications] })),
//   markAsRead: (id) =>
//     set((state) => ({
//       notifications: state.notifications.map((n) =>
//         n.id === id ? { ...n, read: true } : n
//       ),
//     })),
//   markAsUnread: (id) =>
//     set((state) => ({
//       notifications: state.notifications.map((n) =>
//         n.id === id ? { ...n, read: false } : n
//       ),
//     })),
//   markAllAsRead: () =>
//     set((state) => ({
//       notifications: state.notifications.map((n) => ({ ...n, read: true })),
//     })),
//   clearNotifications: () => set({ notifications: [] }),
// }));

// // import type { Notification } from "@/types/types";

// // interface NotificationStore {
// //   notifications: Notification[];
// //   unreadCount: number;
// //   isLoading: boolean;
// //   error: string | null;
// //   fetchNotifications: () => void;
// //   markAsRead: (id: string) => void;
// //   markAllAsRead: () => void;
// //   deleteNotification: (id: string) => void;
// // }

// // export const useNotificationStore = create<NotificationStore>((set) => ({
// //   notifications: [
// //     {
// //       id: "1",
// //       title: "Welcome to the app!",
// //       message: "Thank you for signing up. Enjoy your experience.",
// //       read: false,
// //       date: new Date(),
// //       type: "info",
// //     },
// //     {
// //       id: "2",
// //       title: "New message received",
// //       message: "You have 3 unread messages in your inbox",
// //       read: false,
// //       date: new Date(Date.now() - 3600000), // 1 hour ago
// //       type: "message",
// //     },
// //     {
// //       id: "3",
// //       title: "System maintenance",
// //       message: "Scheduled maintenance tomorrow at 2:00 AM",
// //       read: true,
// //       date: new Date(Date.now() - 86400000), // 1 day ago
// //       type: "alert",
// //     },
// //   ],
// //   unreadCount: 2,
// //   isLoading: false,
// //   error: null,

// //   fetchNotifications: async () => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       // Simulated API call
// //       await new Promise((resolve) => setTimeout(resolve, 1000));
// //       set({ isLoading: false });
// //     } catch (err) {
// //       set({
// //         error: "Failed to fetch notifications",
// //         isLoading: false,
// //       });
// //     }
// //   },

// //   markAsRead: (id) =>
// //     set((state) => {
// //       const updatedNotifications = state.notifications.map((n) =>
// //         n.id === id ? { ...n, read: true } : n
// //       );

// //       return {
// //         notifications: updatedNotifications,
// //         unreadCount: updatedNotifications.filter((n) => !n.read).length,
// //       };
// //     }),

// //   markAllAsRead: () =>
// //     set((state) => ({
// //       notifications: state.notifications.map((n) => ({ ...n, read: true })),
// //       unreadCount: 0,
// //     })),

// //   deleteNotification: (id) =>
// //     set((state) => {
// //       const updatedNotifications = state.notifications.filter(
// //         (n) => n.id !== id
// //       );
// //       return {
// //         notifications: updatedNotifications,
// //         unreadCount: updatedNotifications.filter((n) => !n.read).length,
// //       };
// //     }),
// // }));
