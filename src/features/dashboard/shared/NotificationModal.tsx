import { Link } from "react-router-dom";
import { Bell, ChevronRight, Clock, X } from "lucide-react";
import {
  useFilteredNotifications,
  useNotificationStore,
  useUnreadNotificationCount,
  type Notification,
} from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationModalProps {
  onClose?: () => void;
}

const NotificationModal = ({ onClose }: NotificationModalProps) => {
  const { markAsRead, markAllAsRead } = useNotificationStore();
  const user = useAuthStore((s) => s.user);
  const filteredNotifications = useFilteredNotifications();
  const unreadCount = useUnreadNotificationCount();

  // Show only first 5 notifications in preview
  const previewCount = 5;
  const previewNotifications = filteredNotifications.slice(0, previewCount);
  const hasMore = filteredNotifications.length > previewCount;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return (
          <span
            className="text-green-500 text-sm font-medium"
            aria-hidden="true"
          >
            ✓
          </span>
        );
      case "error":
        return (
          <span className="text-red-500 text-sm font-medium" aria-hidden="true">
            ✗
          </span>
        );
      case "info":
        return (
          <span
            className="text-blue-500 text-sm font-medium"
            aria-hidden="true"
          >
            ℹ
          </span>
        );
      default:
        return <Bell className="h-4 w-4 text-gray-400" aria-hidden="true" />;
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const getNotificationRoute = () => {
    const userRole = user?.role?.toUpperCase();

    switch (userRole) {
      case "ADMIN":
        return "/admin/dashboard/admin-notifications";
      case "MAINTAINER":
        return "/maintainer/dashboard/maintainer-notifications";
      case "MANAGER":
      case "SUPER_ADMIN":
        return "/manager/dashboard/manager-notifications";
      default:
        return "/notifications";
    }
  };

  if (filteredNotifications.length === 0) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Empty state */}
        <div className="p-8 text-center">
          <Bell
            className="h-12 w-12 mx-auto mb-3 text-gray-300"
            aria-hidden="true"
          />
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            No notifications yet
          </h4>
          <p className="text-xs text-gray-500">
            You'll see activity notifications here when they arrive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7 px-2"
            >
              Mark all read
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <ScrollArea className="max-h-46">
        <div className="divide-y divide-gray-100">
          {previewNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
              onClick={() =>
                handleNotificationClick(notification.id, notification.read)
              }
              role="button"
              tabIndex={0}
              aria-label={`Notification: ${notification.title}. ${
                notification.message
              }. ${notification.read ? "Read" : "Unread"}. ${formatTimeAgo(
                notification.createdAt
              )}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNotificationClick(notification.id, notification.read);
                }
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-6 w-6 rounded-full bg-white shadow-sm border flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4
                      className={`text-sm font-medium leading-tight line-clamp-2 ${
                        !notification.read ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {notification.title}
                    </h4>

                    {/* Time and unread indicator */}
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                        <time dateTime={notification.createdAt.toISOString()}>
                          {formatTimeAgo(notification.createdAt)}
                        </time>
                      </div>
                      {!notification.read && (
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          aria-label="Unread notification indicator"
                        />
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 mb-1 ${
                      !notification.read ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    {notification.message}
                  </p>

                  {/* Meta information */}
                  {notification.meta?.adminName && (
                    <p className="text-xs text-gray-500">
                      by {notification.meta.adminName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <Link
          to={getNotificationRoute()}
          onClick={onClose} // Close drawer/modal when navigating
          className="block w-full"
          aria-label={`View all ${filteredNotifications.length} notifications`}
        >
          <Button
            variant="ghost"
            className="w-full justify-between text-sm hover:bg-gray-100"
          >
            <span>
              View all notifications
              {filteredNotifications.length > 0 && (
                <span className="text-gray-500 ml-1">
                  ({filteredNotifications.length})
                </span>
              )}
            </span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>

        {hasMore && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Showing {previewCount} of {filteredNotifications.length}{" "}
            notifications
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
