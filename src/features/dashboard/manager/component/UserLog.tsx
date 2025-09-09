import { ChevronLeft, ChevronRight } from "lucide-react";
import DashboardTitle from "../../shared/DashboardTitle";
import { useGoBack } from "@/hooks/useGoBack";

import { useMemo, useState } from "react";

// components
import Avatar from "../../shared/Avatar";

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
  };
};

const UserLog = () => {
  const goBack = useGoBack();

  const { activities } = useActivityLogsStore();
  const { users } = useUserStore();
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

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
            profilePicture: "SS", // fallback system icon
          },
        };
      }

      const user = userMap.get(activity.performedBy);

      return {
        ...activity,
        user: user
          ? { name: user.name, profilePicture: user.profilePicture }
          : {
              name: activity.performedBy, // fallback: just show the email
              profilePicture: "/default-avatar.png",
            },
      };
    });
  };

  const mergedAllActivities = useMemo(
    () => mergeActivitiesWithUsers(activities, users),
    [activities, users]
  );

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(mergedAllActivities.length, 6);

  const mergedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    return mergedAllActivities.slice(startIndex, endIndex);
  }, [mergedAllActivities, currentPage]);

  return (
    <div>
      {/* breadcrumb */}
      <div className="flex items-center gap-0.5">
        <span
          onClick={goBack}
          role="button"
          className="cursor-pointer text-sm text-[#444444] hover:underline"
        >
          user management
        </span>
        <ChevronRight className="size-3.5" />
        <span className="cursor-pointer text-sm text-[#444444] hover:underline">
          user audit log
        </span>
      </div>
      {/* start */}

      <main className="mt-5">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <DashboardTitle heading="User Audit Log" description="" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </label>
              <span className="text-sm text-muted-foreground">
                Auto Refresh
              </span>
            </div>

            {/* back to user list */}
            <Button variant="outline" onClick={goBack}>
              <ChevronLeft /> Back to user list
            </Button>

            <Button>Export Log</Button>
          </div>
        </div>

        {/* activity log table */}
        <div className="bg-white border border-[#d9d9d9] rounded-[10px] mt-[40px] overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="py-3 px-4 text-[#333333] text-sm font-medium">
                  Timestamp
                </TableHead>
                <TableHead className="py-3 px-4 text-left font-semibold text-[#333]">
                  User details
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Activity
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Status
                </TableHead>

                <TableHead className="font-semibold text-[#333]">
                  Location
                </TableHead>
                <TableHead className="font-semibold text-[#333]">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {mergedActivities.map((a, i) => (
                <TableRow key={i} className="pl-5">
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
                        a.role === "STAFF"
                          ? "bg-[#2ECC7133] text-[#05431F]"
                          : a.role === "ADMIN"
                          ? "bg-[#FFF2CE] text-[#F39C12]"
                          : "bg-[#E2F3EB] text-[#1A3C7E]"
                      }`}
                    >
                      {a.role === "MAINTAINER"
                        ? "MAINT"
                        : a.role === "SUPER_ADMIN"
                        ? "MANAGER"
                        : a.role}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">
                    {a.action.toLowerCase().replace("-", " ")}
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
                  <TableCell>{}</TableCell>
                  <TableCell>view</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {mergedActivities.length > 0 && (
            <div className="h-14 border-y border-[#D9D9D9] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
              <Pagination>
                <PaginationContent className="!flex !justify-between w-full px-5">
                  <PaginationItem>
                    {(() => {
                      const start = (currentPage - 1) * 6 + 1;
                      const end = Math.min(
                        currentPage * 6,
                        mergedActivities.length
                      );
                      return `Showing ${start}-${end} of ${activities.length} users (Page ${currentPage} of ${totalPages})`;
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
                      ></PaginationPrevious>
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
                    ></PaginationNext>
                  </div>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserLog;
