import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Search } from "lucide-react";
import {
  useFilteredNotifications,
  useNotificationStore,
  useUnreadNotificationCount,
  type Notification,
} from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";
import DashboardTitle from "../DashboardTitle";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Notifications = () => {
  const user = useAuthStore((s) => s.user);
  const { markAsRead, markAllAsRead, deleteNotification } =
    useNotificationStore();

  const allNotifications = useFilteredNotifications();
  const unreadCount = useUnreadNotificationCount();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  const displayedNotifications: Notification[] = allNotifications.filter(
    (n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "all" ? true : n.type === filterType; // Assuming 'type' exists on Notification
      return matchesSearch && matchesFilter;
    }
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24 && hours > 0) return `${hours} hours ago`;
    if (hours === 0) return "Just now";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="px-2 md:px-0 pb-10">
      <DashboardTitle
        heading="Notifications"
        description="Stay updated with your business activities"
      />

      {/* --- Controls Section: Search & Filter --- */}
      <div className="flex flex-col md:flex-row gap-4 my-6">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            className="pl-10 h-11 bg-white! border-gray-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="w-full md:w-[200px]">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-11 bg-white! border-gray-200">
              <SelectValue placeholder="All Notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="info">System Updates</SelectItem>
              <SelectItem value="success">Transactions</SelectItem>
              <SelectItem value="error">Alerts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Notifications Container --- */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        
        {/* List Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {unreadCount} unread notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              Mark as read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-100">
          {displayedNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No notifications found.
            </div>
          ) : (
            displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 md:p-5 transition-colors flex flex-col md:flex-row gap-3 md:gap-4 md:items-start",
                  !notification.read ? "bg-[#F2F8FF]" : "bg-white"
                )}
              >
                {/* 1. Unread Indicator (Blue Dot) */}
                <div className="hidden md:block pt-1.5">
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                  {notification.read && <div className="w-2 h-2 flex-shrink-0" />} {/* Spacer */}
                </div>

                {/* Mobile Unread Indicator + Content Wrapper */}
                <div className="flex gap-3 flex-1">
                  {/* Mobile Dot */}
                  <div className="md:hidden pt-1.5 flex-shrink-0">
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-[#1E1E1E] font-medium text-sm md:text-base mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>

                {/* 2. Action Buttons */}
                <div className="flex flex-row md:flex-row gap-3 mt-2 md:mt-0 w-full md:w-auto md:self-center justify-start md:justify-end">
                  {!notification.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="flex-1 md:flex-none h-9 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 font-normal"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark read
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className={cn(
                      "flex-1 md:flex-none h-9 bg-white border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 font-normal",
                      notification.read && "md:w-auto" // Let it size naturally if it's the only button
                    )}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
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