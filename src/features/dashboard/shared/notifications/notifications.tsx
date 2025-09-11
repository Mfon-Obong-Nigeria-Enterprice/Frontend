import { useMemo, useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Search, ChevronDown } from "lucide-react";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";

import DashboardTitle from "../DashboardTitle";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type FilterKey = "all" | "unread" | "requests" | "alerts";

const formatTimeAgo = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Notifications = () => {
  const user = useAuthStore((s) => s.user);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered: Notification[] = useMemo(() => {
    let list = notifications;
    if (filter === "unread") list = list.filter((n) => !n.read);
    if (filter === "requests") list = list.filter((n) => n.action?.includes("request"));
    if (filter === "alerts") list = list.filter((n) => n.type === "error" || n.type === "info");
    return list;
  }, [notifications, filter]);

  const displayedNotifications: Notification[] = searchQuery
    ? filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filtered;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const addSampleNotifications = () => {
    const uid = () => Math.random().toString(36).slice(2);
    const role = (user?.role as any) || "MAINTAINER";
    const now = new Date();

    addNotification({
      id: uid(),
      title: "Password Reset Request",
      message: "Role: Staff\nBranch: Main Office",
      read: false,
      type: "info",
      action: "password_request" as any,
      createdAt: now,
      recipients: [role],
      meta: { staffName: "John Doe", branch: "Main Office" },
    } as any);

    addNotification({
      id: uid(),
      title: "CRITICAL SYSTEM ISSUE DETECTED",
      message: "System metrics indicate high load. Please review.",
      read: false,
      type: "error",
      action: "system_alert" as any,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      recipients: [role],
      meta: { branch: "HQ" },
    } as any);

    addNotification({
      id: uid(),
      title: "Inventory Sync Completed",
      message: "All branches synced successfully.",
      read: false,
      type: "success",
      action: "transaction_completed" as any,
      createdAt: new Date(now.getTime() - 5 * 60 * 1000),
      recipients: [role],
    } as any);
  };

  const HeaderBar = (
    <div className="p-4 sm:p-6 border-b">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <p className="text-xs sm:text-sm text-gray-500">
          {unreadCount > 0 ? (
            <>
              <span className="font-medium">{unreadCount}</span> unread notifications
            </>
          ) : (
            "You're all caught up"
          )}
        </p>
        <div className="flex items-center gap-2">
          {import.meta.env.DEV && import.meta.env.VITE_SHOW_SEED_BUTTON === "true" && (
            <Button
              variant="outline"
              size="sm"
              onClick={addSampleNotifications}
              className="text-xs"
            >
              Add sample notifications
            </Button>
          )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
              className="text-sm self-start md:self-auto"
              >
                <Check className="h-4 w-4 mr-1" /> Mark all as read
              </Button>
            )}
          </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            aria-label="Search notifications"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between gap-2 w-full sm:w-auto">
              {filter === "all" && "All Notifications"}
              {filter === "unread" && "Unread"}
              {filter === "requests" && "Requests"}
              {filter === "alerts" && "Alerts"}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setFilter("all")}>All Notifications</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("unread")}>Unread</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("requests")}>Requests</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("alerts")}>Alerts</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const renderMeta = (n: Notification) => {
    const role = (n.meta?.staffName || n.meta?.adminName) ? "Role: Staff" : "Role";
    const branch = n.meta?.branch || user?.branch || "Main Office";
    return (
      <div className="mt-1 text-[10px] sm:text-xs text-gray-500">
        <div className="flex flex-wrap items-center gap-2">
          <span>{role}{role === "Role" ? "" : ""}</span>
          <span className="hidden sm:inline">•</span>
          <span>Branch: {branch}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatTimeAgo(n.createdAt)}</span>
        </div>
      </div>
    );
  };

  const renderActions = (n: Notification) => {
    if (n.action?.includes("password") || n.action?.includes("request")) {
      return (
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" className="h-8 px-3">Approve</Button>
          <Button size="sm" variant="outline" className="h-8 px-3">Deny</Button>
        </div>
      );
    }
    return null;
  };

  const renderBody = (n: Notification) => {
    if (n.action?.includes("system") || n.message?.toLowerCase().includes("system")) {
      return (
        <div className="mt-3 text-xs text-gray-700">
          <p className="font-semibold mb-2">CRITICAL SYSTEM ISSUE DETECTED</p>
          <div className="grid sm:grid-cols-2 gap-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Storage: 98%</li>
              <li>Database Usage: 93%</li>
              <li>CPU Load: 85%</li>
              <li>API Failure Rate: 87%</li>
            </ul>
            <div>
              <p className="text-[11px] leading-5 text-gray-600">
                Detected: {n.createdAt.toLocaleString()}<br />
                Triggered by: System Monitor Bot
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="font-medium text-xs mb-1">Suggested Actions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Clean up unused inventory records</li>
              <li>Archive old transaction logs</li>
              <li>Scale up cloud storage plan</li>
              <li>Notify engineering/dev team</li>
            </ul>
          </div>
        </div>
      );
    }

    return <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{n.message}</p>;
  };

  return (
    <div>
      <DashboardTitle
        heading={
          user?.role === "MAINTAINER" ? "Notifications" : "Notifications"
        }
        description="Stay updated with your business activities"
      />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {HeaderBar}

        <div className="max-h-[calc(100vh-16rem)] sm:max-h-screen overflow-y-auto">
          {displayedNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchQuery ? (
                <>
                  <p className="text-sm">No matching notifications</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </>
              ) : (
                <p className="text-sm">No notifications</p>
              )}
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-3">
              {displayedNotifications.map((n) => (
              <div
                  key={n.id}
                className={cn(
                    "rounded-md border border-gray-300 bg-white shadow-sm",
                    !n.read && "ring-1 ring-blue-200"
                  )}
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={cn(
                            "mt-1 inline-block h-2 w-2 rounded-full",
                            n.read ? "bg-gray-300" : "bg-green-500"
                          )}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-gray-800">
                            {n.title}
                          </h3>
                          {renderMeta(n)}
                    </div>
                  </div>

                      <div className="flex items-center gap-2">
                        {!n.read && (
                        <Button
                            variant="link"
                          size="sm"
                            className="text-xs text-blue-600"
                            onClick={() => markAsRead(n.id)}
                        >
                            Mark as read
                        </Button>
                      )}
                      <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete notification"
                          onClick={() => deleteNotification(n.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                    {renderBody(n)}

                    {renderActions(n)}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
