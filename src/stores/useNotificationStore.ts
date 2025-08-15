// src/features/notifications/store.ts
import { create } from 'zustand';
import type { Notification } from '@/types/types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
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
  unreadCount: 2, // Matches the mock data
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
    unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length
  }))
}));