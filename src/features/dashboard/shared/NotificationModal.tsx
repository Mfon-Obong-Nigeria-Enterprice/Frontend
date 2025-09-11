import { Link } from "react-router-dom";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types/types";

interface NotificationModalProps {
  role: Role;
}

const timeAgo = (date: Date) => {
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

const NotificationModal = ({ role }: NotificationModalProps) => {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const user = useAuthStore((s) => s.user);

  const visible: Notification[] = notifications.filter((n) =>
    n.recipients.includes(role)
  );

  const previews = visible.slice(0, 5);

  return (
    <div className="p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">
          {unreadCount > 0 ? (
            <>
              <span className="font-medium">{unreadCount}</span> unread
            </>
          ) : (
            "No unread"
          )}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={() => {
              // Quick mark first few as read for immediate feedback
              previews.filter((p) => !p.read).forEach((p) => markAsRead(p.id));
            }}
            className="text-xs text-blue-600 hover:underline"
            aria-label="Mark shown notifications as read"
          >
            Mark shown read
          </button>
        )}
      </div>

      {previews.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {previews.map((n) => (
            <li key={n.id} className="py-2 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 inline-block h-2 w-2 rounded-full ${
                    n.read ? "bg-gray-300" : "bg-blue-500"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <span className="text-[10px] text-gray-500 flex-shrink-0">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        to={`${
          user?.role === "SUPER_ADMIN"
            ? "/manager/dashboard/manager-notifications"
            : `/${user?.role.toLowerCase()}/dashboard/${user?.role.toLowerCase()}-notifications`
        }`}
        className="flex justify-center"
      >
        <Button className="mt-4 w-full sm:w-auto">View all notifications</Button>
      </Link>
    </div>
  );
};

export default NotificationModal;
