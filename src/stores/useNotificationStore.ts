/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/notifications/store.ts
import { create } from 'zustand';
import type { Notification } from '@/types/types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [
    {
      id: '1',
      title: 'Welcome to the app!',
      message: 'Thank you for signing up. Enjoy your experience.',
      read: false,
      date: new Date(),
      type: 'info'
    },
    {
      id: '2',
      title: 'New message received',
      message: 'You have 3 unread messages in your inbox',
      read: false,
      date: new Date(Date.now() - 3600000), // 1 hour ago
      type: 'message'
    },
    {
      id: '3',
      title: 'System maintenance',
      message: 'Scheduled maintenance tomorrow at 2:00 AM',
      read: true,
      date: new Date(Date.now() - 86400000), // 1 day ago
      type: 'alert'
    }
  ],
  unreadCount: 2,
  isLoading: false,
  error: null,
  
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (err) {
      set({ 
        error: 'Failed to fetch notifications',
        isLoading: false 
      });
    }
  },
  
  markAsRead: (id) => set((state) => {
    const updatedNotifications = state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    
    return {
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.read).length
    };
  }),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  deleteNotification: (id) => set((state) => {
    const updatedNotifications = state.notifications.filter(n => n.id !== id);
    return {
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.read).length
    };
  })
}));