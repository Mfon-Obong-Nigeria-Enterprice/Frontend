// stores/notification.store.ts
import { create } from 'zustand';
import { api } from '@/lib/api';
import { z } from 'zod';
import { useEffect } from 'react';

// Zod schema for notification validation
const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
  type: z.enum(['SALE', 'PAYMENT', 'INVENTORY', 'SYSTEM']),
  metadata: z.record(z.unknown()).optional(),
});

export type Notification = z.infer<typeof notificationSchema>;

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  addTestNotification: () => void; // For development only
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasFetched: false,

  fetchNotifications: async () => {
    if (get().isLoading) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/notifications');
      const data = notificationSchema.array().parse(response.data);
      
      set({ 
        notifications: data,
        unreadCount: data.filter(n => !n.isRead).length,
        isLoading: false,
        hasFetched: true
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false 
      });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => {
        const updated = state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length
        };
      });
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  },

  markAllAsRead: async () => {
    if (get().unreadCount === 0) return;
    
    try {
      await api.patch('/notifications/mark-all-read');
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  },

  clearAll: async () => {
    try {
      await api.delete('/notifications/clear-all');
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      console.error('Failed to clear notifications', error);
    }
  },

  // For development/testing purposes only
  addTestNotification: () => {
    const newNotification: Notification = {
      id: `test-${Date.now()}`,
      title: 'Test Notification',
      message: 'This is a test notification added locally',
      isRead: false,
      createdAt: new Date().toISOString(),
      type: 'SYSTEM'
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  }
}));

// Utility hook for polling/real-time updates
export const useNotificationPolling = (interval = 30000) => {
  const { fetchNotifications, hasFetched } = useNotificationStore();
  
  useEffect(() => {
    if (!hasFetched) return;

    const poll = setInterval(fetchNotifications, interval);
    return () => clearInterval(poll);
  }, [fetchNotifications, hasFetched, interval]);
};