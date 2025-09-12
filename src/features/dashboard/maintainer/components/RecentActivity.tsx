import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60)
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  if (minutes < 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  return past.toLocaleDateString();
}

const RecentActivity = () => {
  const { activities } = useActivityLogsStore();

  const recentActivities = activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 8);

  return (
    <div className="bg-white rounded-[10px] shadow-sm border p-4 h-[67vh] flex flex-col">
      {/* Header */}
      <h5 className="text-lg font-semibold mb-4 border-b pb-2 flex-shrink-0">
        Recent Activity
      </h5>

      {/* Content area that fills remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {recentActivities.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        ) : (
          <ul className="space-y-3 h-full overflow-y-auto pr-2">
            {recentActivities.map((a) => (
              <li
                key={a._id}
                className="flex justify-between items-start border-b last:border-none pb-3 last:pb-0"
              >
                {/* Left side with green dot + details */}
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium break-words">
                      {a.details}
                    </p>
                    <span className="text-xs text-gray-500">
                      {timeAgo(a.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Device info */}
                <div className="ml-2 flex-shrink-0">
                  <p className="text-xs text-gray-600 text-right">{a.device}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
