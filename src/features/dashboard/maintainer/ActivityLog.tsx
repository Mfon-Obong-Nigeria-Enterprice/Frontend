import { useMemo, useState } from "react";

// components
import DashboardTitle from "../shared/DashboardTitle";
import Avatar from "../shared/Avatar";

// ui component
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import UserSearchList from "../shared/UserSearchList";

// hooks
import usePagination from "@/hooks/usePagination";

// stores
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
import { useUserStore } from "@/stores/useUserStore";

// types
import type { CompanyUser } from "@/stores/useUserStore";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";

type ActivityWithUser = ActivityLogs & {
  user?: {
    name: string;
    profilePicture: string;
    role?: string;
  };
};

const ActivityLog = () => {
  const { activities } = useActivityLogsStore();
  const { users } = useUserStore();
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    dateRange: "all",
    status: "all"
  });

  const toggleRow = (i: number) => {
    setExpandedRows((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const mergeActivitiesWithUsers = (
    activities: ActivityLogs[],
    users: CompanyUser[]
  ): ActivityWithUser[] => {
    const userMap = new Map(users.map((u) => [u.email, u]));

    return activities.map((activity) => {
      if (activity.performedBy === "System") {
        return {
          ...activity,
          user: {
            name: "System",
            profilePicture: "SS",
            role: "SYSTEM"
          },
        };
      }

      const user = userMap.get(activity.performedBy);

      return {
        ...activity,
        user: user
          ? { 
              name: user.name, 
              profilePicture: user.profilePicture,
              role: user.role
            }
          : {
              name: activity.performedBy,
              profilePicture: "/default-avatar.png",
              role: "UNKNOWN"
            },
      };
    });
  };

  // Filter activities based on search query and filters
  const filteredActivities = useMemo(() => {
    let result = mergeActivitiesWithUsers(activities, users);

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(activity => {
        // Check if any field matches the search query
        return (
          activity.user?.name?.toLowerCase().includes(query) ||
          activity.performedBy.toLowerCase().includes(query) ||
          activity.action.toLowerCase().includes(query) ||
          activity.details.toLowerCase().includes(query) ||
          activity.device?.toLowerCase().includes(query) ||
          activity.user?.role?.toLowerCase().includes(query)
        );
      });
    }

    // Apply role filter
    if (filters.role !== "all") {
      result = result.filter(activity => activity.user?.role === filters.role);
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      result = result.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        
        switch (filters.dateRange) {
          case "today":
            return activityDate.toDateString() === now.toDateString();
          case "week":
            { const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityDate >= weekAgo; }
          case "month":
            { const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return activityDate >= monthAgo; }
          default:
            return true;
        }
      });
    }

    return result;
  }, [activities, users, searchQuery, filters]);

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredActivities.length, 6);

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Extract unique roles for filter dropdown
  const roles = useMemo(() => {
    const uniqueRoles = new Set<string>();
    users.forEach(user => uniqueRoles.add(user.role));
    return Array.from(uniqueRoles);
  }, [users]);

  return (
    <main>
      <div className="flex flex-col md:flex-row justify-between ">
        <DashboardTitle heading="System Activity Log" description="" />
        <Button className="w-fit p-5 ">Export User Report</Button>
      </div>
<div className="bg-white mt-8 ">
      <h2 className="p-3 font-medium"> Filter & Controls </h2>
      <UserSearchList 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        roles={roles}
      />
</div>

      {/* activity log table */}
      <div className="bg-white border border-[#d9d9d9] rounded-[10px] mt-[40px] overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F5F5]">
              <TableHead className="py-3 px-4 text-[#333333] text-sm font-medium">
                TIMESTAMP
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-semibold text-[#333]">
                USER
              </TableHead>
              <TableHead className="font-semibold text-[#333]">ROLE</TableHead>
              <TableHead className="font-semibold text-[#333]">
                ACTIONS
              </TableHead>
              <TableHead className="font-semibold text-[#333]">
                DETAILS
              </TableHead>
              <TableHead className="font-semibold text-[#333]">
                DEVICE
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="">
            {paginatedActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery || Object.values(filters).some(f => f !== "all") 
                    ? "No activities match your search criteria" 
                    : "No activities found"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedActivities.map((a, i) => (
                <TableRow key={`${a._id}-${i}`} className="pl-5">
                  <TableCell className="">
                    <span className="block text-xs text-[#444444]">
                      {new Date(a.timestamp).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="block text-[0.625rem] text-[#7D7D7D]">
                      {new Date(a.timestamp).toLocaleTimeString()}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-1.5 items-center">
                    <Avatar
                    name={a.user?.name}
                    profilePicture={a.user?.profilePicture}
                    role={a.role}
                  />

                    <p>
                      <span className="block text-xs font-medium text-[#444444]">
                        {a.user?.name}
                      </span>
                      <span className="block text-[9px] text-[#7D7D7D]">
                        {a.performedBy}
                      </span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`min-w-16 mx-auto text-center py-2 px-2.5 rounded ${
                        a.user?.role === "STAFF"
                          ? "bg-[#2ECC7133] text-[#05431F]"
                          : a.user?.role === "ADMIN"
                          ? "bg-[#FFF2CE] text-[#F39C12]"
                          : a.user?.role === "SYSTEM"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-[#E2F3EB] text-[#1A3C7E]"
                      }`}
                    >
                      {a.user?.role === "MAINTAINER"
                        ? "MAINT"
                        : a.user?.role === "SUPER_ADMIN"
                        ? "MANAGER"
                        : a.user?.role === "SYSTEM"
                        ? "SYSTEM"
                        : a.user?.role || "UNKNOWN"}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">
                    {a.action.toLowerCase().replace(/-/g, " ")}
                  </TableCell>
                  <TableCell
                    onClick={() => toggleRow(i)}
                    title={!expandedRows[i] ? a.details : ""}
                    className={`cursor-pointer ${
                      expandedRows[i] ? "whitespace-pre-wrap" : "truncate"
                    } max-w-[170px]`}
                  >
                    {a.details}
                  </TableCell>
                  <TableCell>{a.device}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredActivities.length > 0 && (
          <div className="h-14 border-y border-[#D9D9D9] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
            <Pagination>
              <PaginationContent className="!flex !justify-between w-full px-5">
                <PaginationItem>
                  {(() => {
                    const start = (currentPage - 1) * 6 + 1;
                    const end = Math.min(
                      currentPage * 6,
                      filteredActivities.length
                    );
                    return `Showing ${start}-${end} of ${filteredActivities.length} activities (Page ${currentPage} of ${totalPages})`;
                  })()}
                </PaginationItem>
                <div className="flex justify-center gap-[18px]">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={canGoPrevious ? goToPreviousPage : undefined}
                      className={`border border-[#d9d9d9] ${
                        !canGoPrevious
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }`}
                      aria-label="Go to previous page"
                    />
                  </PaginationItem>
                  <PaginationItem className="flex items-center justify-center bg-[#8C1C1380] w-[34px] h-[34px] rounded px-4 text-lg text-white">
                    {currentPage}
                  </PaginationItem>
                  <PaginationNext
                    onClick={canGoNext ? goToNextPage : undefined}
                    className={`border border-[#d9d9d9] ${
                      !canGoNext
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                    aria-label="Go to next page"
                  />
                </div>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
};

export default ActivityLog;