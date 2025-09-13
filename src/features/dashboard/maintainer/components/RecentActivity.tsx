import { useActivityLogsStore } from "@/stores/useActivityLogsStore";


function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
}

const RecentActivity = () => {
  const { activities } = useActivityLogsStore();

  const recentActivities = activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 8);
    const { getTotalActivityToday } = useActivityLogsStore();

  const totalActivities = getTotalActivityToday();
  console.log(`Total activities today: ${totalActivities}`);


  return (
    <div className="bg-white rounded-[10px] shadow-sm border p-4 lg:p-6 h-full">
      <h5 className="text-lg font-semibold mb-4 border-b">Recent Activity</h5>
      {recentActivities.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity</p>
      ) : (
        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
          {recentActivities.map((a) => (
            <li
              key={a._id}
              className="flex justify-between items-center border-b last:border-none pb-2"
            >
              {/* Left side with green dot + details */}
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{a.details}</p>
                  <span className="text-xs text-gray-500">
                    {timeAgo(a.timestamp)}
                  </span>
                </div>
              </div>

              {/* Device info */}
              <p className="text-xs text-gray-600">{a.device}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;