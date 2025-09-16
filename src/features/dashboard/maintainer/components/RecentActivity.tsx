// components/RecentActivity.tsx
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
import { timeAgo, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const RecentActivity = () => {
  const { activities, fetchActivities, loading, error } = useActivityLogsStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivities();
    setIsRefreshing(false);
  };

  // Sort activities by most recent first, creating a new sorted array
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-[10px] h-fit shadow-sm border p-4 flex flex-col">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h5 className="text-lg font-semibold">Recent Activity</h5>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Refresh activities"
        >
          <RefreshCw 
            className={`h-4 w-4 ${loading || isRefreshing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Content area */}
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : sortedActivities.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sortedActivities.map((a) => (
              <li
                key={a._id}
                className={cn(
                  "flex justify-between items-start border-b last:border-none pb-3 last:pb-0"
                )}
              >
                {/* Left side */}
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
                  <p className="text-xs text-gray-600 text-right">
                    {a.device}
                  </p>
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