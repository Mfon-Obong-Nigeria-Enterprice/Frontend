// src/features/dashboard/admin/NotificationModal.tsx
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Loader2, Check } from "lucide-react";
import { useEffect } from "react";

type NotificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const NotificationModal = ({ open, onOpenChange }: NotificationModalProps) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                markAllAsRead();
                onOpenChange(false);
              }}
              disabled={unreadCount === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchNotifications}>
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications available
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[60vh]">
              {notifications.map((notification) => (
                <div key={notification.id} className="space-y-2">
                  <div 
                    className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      )}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};