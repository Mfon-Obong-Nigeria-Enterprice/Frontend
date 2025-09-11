import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, Search } from "lucide-react";
import {
  useFilteredNotifications,
  useNotificationStore,
  type Notification,
} from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";

import DashboardTitle from "../DashboardTitle";
import { useAuthStore } from "@/stores/useAuthStore";

const Notifications = () => {
  const user = useAuthStore((s) => s.user);
  const { markAsRead, markAllAsRead, deleteNotification } =
    useNotificationStore();

  // Use filtered notifications instead of all notifications
  const allNotifications = useFilteredNotifications();
  const unreadCount = allNotifications.filter((n) => !n.read).length;

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

  return (
    <div>
      <DashboardTitle
        heading={
          user?.role === "MAINTAINER"
            ? "Maintainer Notification"
            : "Notification"
        }
        description="Stay updated with your business activities"
      />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-sm"
              >
                <Check className="h-4 w-4 mr-1" /> Mark all as read
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200 max-h-screen overflow-y-auto">
          {displayedNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchQuery ? "No matching notifications" : "No notifications"}
            </div>
          ) : (
            displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-gray-50",
                  !notification.read && "bg-blue-50"
                )}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {notification.createdAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex justify-end gap-2">
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 gap-1 text-xs"
                        >
                          <Check className="h-3 w-3" /> Mark read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 gap-1 text-xs text-red-500"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
