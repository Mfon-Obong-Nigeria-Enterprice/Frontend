import { Link } from "react-router-dom";
import { Bell, ChevronRight, Clock } from "lucide-react";
import {
  useFilteredNotifications,
  useNotificationStore,
  type Notification,
} from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";

interface NotificationModalProps {
  onClose?: () => void; // Optional callback to close the drawer/modal
}

const NotificationModal = ({ onClose }: NotificationModalProps) => {
  const { markAsRead } = useNotificationStore();
  const user = useAuthStore((s) => s.user);
  const filteredNotifications = useFilteredNotifications();

  // Show only first 4 notifications in preview
  const previewCount = 4;
  const previewNotifications = filteredNotifications.slice(0, previewCount);
  const hasMore = filteredNotifications.length > previewCount;
  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return (
          <span className="text-green-500 text-sm" aria-hidden="true">
            ✓
          </span>
        );
      case "error":
        return (
          <span className="text-red-500 text-sm" aria-hidden="true">
            ✗
          </span>
        );
      case "info":
        return (
          <span className="text-blue-500 text-sm" aria-hidden="true">
            ℹ
          </span>
        );
      default:
        return <Bell className="h-3 w-3" aria-hidden="true" />;
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
    return `${days}d ago`;
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
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
      // case "STAFF":
      //   return "/staff/dashboard/staff-notifications";
      default:
        return "/notifications";
    }
  };

  if (filteredNotifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell
          className="h-12 w-12 mx-auto mb-3 text-gray-300"
          aria-hidden="true"
        />
        <p className="text-gray-500 text-sm mb-2">No notifications yet</p>
        <p className="text-gray-400 text-xs">
          You'll see activity notifications here when they arrive
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-100 flex flex-col">
      {/* Header with unread count */}
      {unreadCount > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <p className="text-sm text-blue-700 font-medium">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {previewNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
              !notification.read
                ? "bg-blue-50 border-l-4 border-l-blue-400"
                : ""
            }`}
            onClick={() => handleNotificationClick(notification.id)}
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
                handleNotificationClick(notification.id);
              }
            }}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4
                    className={`text-sm font-medium line-clamp-1 ${
                      !notification.read ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {notification.title}
                  </h4>

                  {/* Time */}
                  <div className="flex items-center text-xs text-gray-500 ml-2 flex-shrink-0">
                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                    <time dateTime={notification.createdAt.toISOString()}>
                      {formatTimeAgo(notification.createdAt)}
                    </time>
                  </div>
                </div>

                {/* Message */}
                <p
                  className={`text-xs line-clamp-2 mb-2 ${
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

              {/* Unread indicator */}
              {!notification.read && (
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                  aria-label="Unread notification indicator"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer with View All button */}
      <div className="p-4 border-t bg-gray-50">
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
                <span className="text-gray-500">
                  {" "}
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
