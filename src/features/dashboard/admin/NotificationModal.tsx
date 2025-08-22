// src/features/dashboard/admin/NotificationsPage.tsx
import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, Search } from "lucide-react";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";

export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const displayedNotifications: Notification[] = searchQuery
    ? notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notifications;

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
    <main className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
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
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto p-4 space-y-2">
          {displayedNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No matching notifications" : "No notifications"}
            </div>
          ) : (
            displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 rounded-lg hover:bg-gray-50",
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
};

// // src/features/dashboard/admin/NotificationModal.tsx
// import { useNotificationStore } from "@/stores/useNotificationStore";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Loader2, Check } from "lucide-react";
// import { useEffect } from "react";

// type NotificationModalProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// };

// export const NotificationModal = ({
//   open,
//   onOpenChange,
// }: NotificationModalProps) => {
//   const {
//     notifications,
//     unreadCount,

//     markAsRead,
//     markAllAsRead,
//   } = useNotificationStore();

//   // useEffect(() => {
//   //   if (open) {
//   //     fetchNotifications();
//   //   }
//   // }, [open, fetchNotifications]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
//         <div className="p-4 border-b flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Notifications</h2>
//           <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
//             Close
//           </Button>
//         </div>

//         <div className="p-4 space-y-4">
//           <div className="flex justify-between">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => {
//                 markAllAsRead();
//                 onOpenChange(false);
//               }}
//               disabled={unreadCount === 0}
//             >
//               <Check className="mr-2 h-4 w-4" />
//               Mark all as read
//             </Button>
//             <Button variant="ghost" size="sm">
//               Refresh
//             </Button>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : error ? (
//             <div className="text-red-500 text-center py-4">{error}</div>
//           ) : notifications.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No notifications available
//             </div>
//           ) : (
//             <div className="space-y-2 overflow-y-auto max-h-[60vh]">
//               {notifications.map((notification) => (
//                 <div key={notification.id} className="space-y-2">
//                   <div
//                     className={`p-3 rounded-lg ${
//                       !notification.read ? "bg-blue-50" : ""
//                     }`}
//                     onClick={() =>
//                       !notification.read && markAsRead(notification.id)
//                     }
//                   >
//                     <div className="flex justify-between">
//                       <div>
//                         <h4 className="font-medium">{notification.title}</h4>
//                         <p className="text-sm text-gray-600">
//                           {notification.message}
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {new Date(notification.createdAt).toLocaleString()}
//                         </p>
//                       </div>
//                       {!notification.read && (
//                         <span className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
//                       )}
//                     </div>
//                   </div>
//                   <Separator />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
