import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
import { timeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const RecentActivity = () => {
  const { activities, fetchActivities, loading, error } =
    useActivityLogsStore();
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
    <div className="bg-white rounded-lg shadow-md border p-3 sm:p-4 lg:p-5 flex flex-col h-full">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 border-b pb-2">
        <h5 className="text-base sm:text-lg font-semibold">Recent Activity</h5>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="p-1 sm:p-1.5 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh activities"
        >
          <RefreshCw
            className={`h-3 w-3 sm:h-4 sm:w-4 ${
              loading || isRefreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 sm:p-3 rounded mb-3 sm:mb-4 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Content area with flexible height */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {loading && sortedActivities.length === 0 ? (
            <div className="flex items-center justify-center h-24 sm:h-32">
              <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-gray-400" />
            </div>
          ) : sortedActivities.length === 0 ? (
            <div className="flex items-center justify-center h-24 sm:h-32">
              <p className="text-xs sm:text-sm text-gray-500">
                No recent activity
              </p>
            </div>
          ) : (
            <ul className="space-y-2 sm:space-y-3">
              {sortedActivities.slice(0, 7).map((a) => (
                <li
                  key={a._id}
                  className="border-b last:border-none pb-2 sm:pb-3 last:pb-0"
                >
                  {/* Mobile Layout (< sm) */}
                  <div className="sm:hidden">
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium break-words leading-tight">
                          {a.details}
                        </p>
                        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                          <span>{timeAgo(a.timestamp)}</span>
                          <span className="truncate max-w-24 ml-2">
                            {a.device}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout (>= sm) */}
                  <div className="hidden sm:flex sm:justify-between sm:items-start sm:gap-3">
                    {/* Left side */}
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium break-words leading-tight">
                          {a.details}
                        </p>
                        <span className="text-xs text-gray-500 block mt-1">
                          {timeAgo(a.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Right side - Device info */}
                    <div className="flex-shrink-0 max-w-28 lg:max-w-36">
                      <p
                        className="text-xs text-gray-600 text-right truncate"
                        title={a.device}
                      >
                        {a.device}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
