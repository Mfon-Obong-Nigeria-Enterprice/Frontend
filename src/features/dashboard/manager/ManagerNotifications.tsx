import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Check, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useState } from "react";
import { cn } from "@/lib/utils";


function ManagerNotifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const displayedNotifications = searchQuery
    ? notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notifications;

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "payment":
        return <span className="text-red-500">!</span>;
      case "transaction":
        return <span className="text-green-500">$</span>;
      case "system":
        return <span className="text-blue-500">⚙</span>;
      case "client":
        return <span className="text-purple-500">+</span>;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Notifications</h2>
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                        {new Date(notification.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
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
                          <Check className="h-3 w-3" />
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 gap-1 text-xs text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default ManagerNotifications;
