import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, Search } from "lucide-react";
import {
  useFilteredNotifications,
  useNotificationStore,
  useUnreadNotificationCount,
  type Notification,
} from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";

import DashboardTitle from "../DashboardTitle";
import { useAuthStore } from "@/stores/useAuthStore";

const Notifications = () => {
  const user = useAuthStore((s) => s.user);
  const { markAsRead, markAllAsRead, deleteNotification } =
    useNotificationStore();

  // Use filtered notifications for current user
  const allNotifications = useFilteredNotifications();
  const unreadCount = useUnreadNotificationCount();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const displayedNotifications: Notification[] = searchQuery
    ? allNotifications.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allNotifications;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <span className="text-green-500">✔</span>;
      case "error":
        return <span className="text-red-500">✖</span>;
      case "info":
        return <span className="text-blue-500">ℹ</span>;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="px-2 md:px-0">
      <DashboardTitle
        heading={
          user?.role === "MAINTAINER"
            ? "Maintainer Notifications"
            : "Notifications"
        }
        description="Stay updated with your business activities"
      />

      <div className="relative my-5 sm:my-7">
        <Search className="absolute left-5 top-6 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search notifications..."
          className="pl-10 py-8"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 px-2 md:px-0">
        {/* Header */}
        <div className="p-6 border-b bg-[#F0F0F3]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <span className=" text-[#7D7D7D] text-sm font-medium px-2.5 py-0.5 ">
                  {unreadCount} unread{" "}
                  {unreadCount > 1 ? "notifications" : "notification"}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-sm text-[#3D80FF] font-medium"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {displayedNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery
                  ? "No matching notifications"
                  : "No notifications yet"}
              </h3>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Your notifications will appear here when activities occur in the system"}
              </p>
            </div>
          ) : (
            displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-gray-50 transition-colors",
                  !notification.read &&
                    "bg-blue-50 border-l-4 border-l-blue-500"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">
                    <div className="h-8 w-8 rounded-full bg-white shadow-sm border flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={cn(
                          "text-sm font-medium leading-5",
                          !notification.read ? "text-gray-900" : "text-gray-700"
                        )}
                      >
                        {notification.title}
                      </h3>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>

                    <p
                      className={cn(
                        "text-sm leading-5 mb-3",
                        !notification.read ? "text-gray-800" : "text-gray-600"
                      )}
                    >
                      {notification.message}
                    </p>

                    {/* Meta information */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {notification.meta?.adminName && (
                          <span>by {notification.meta.adminName}</span>
                        )}
                        {notification.meta?.transactionId && (
                          <span>ID: {notification.meta.transactionId}</span>
                        )}
                        <span className="capitalize">{notification.type}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-7 px-3 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-7 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {displayedNotifications.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t text-center">
            <p className="text-xs text-gray-500">
              Showing {displayedNotifications.length} of{" "}
              {allNotifications.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
