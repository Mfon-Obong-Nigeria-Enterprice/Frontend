import { useMemo, useState } from "react";

import { format } from "date-fns";

import type { CompanyUser } from "@/stores/useUserStore";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";

import { Dot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import usePagination from "@/hooks/usePagination";

interface UserAccountDetailsProps {
  user: CompanyUser;
  activities: ActivityLogs[];
  lastLogin: string | null;
  activityCount: number;
}

const UserAccountDetails = ({
  user,
  activities,
  lastLogin,
  activityCount,
}: UserAccountDetailsProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const {
    currentPage,
    // totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(activities.length, 4);

  const currentActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * 4;
    const endIndex = startIndex + 4;
    return activities.slice(startIndex, endIndex);
  }, [activities, currentPage]);

  return (
    <>
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full md:mt-10 mt-0">
        {/* Account details */}
        <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full">
          <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
            Account Details
          </h6>
          <hr className="border-[#F0F0F0] mb-4" />
          <div className="divide-y divide-[#F0F0F0] px-6">
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Created Date:</span>
              <span>{new Date(user.createdAt).toDateString()}</span>
            </p>
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Last login:</span>
              <span>
                {lastLogin ? format(new Date(lastLogin), "PPpp") : "Never"}
              </span>
            </p>
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Total logins:</span>
              <span>{activityCount || 0}</span>
            </p>
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Address:</span>
              <span>{user.address || "N/A"}</span>
            </p>

            <p className="flex justify-between text-base text-[#444] py-3">
              <span>
                {user.role === "STAFF" ? "Sales recorded" : "Actions"}:
              </span>
              <span>--</span>
            </p>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full">
          <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
            Staff Activities
          </h6>
          <hr className="border-[#F0F0F0] mb-4" />
          <ul className="divide-y divide-[#F0F0F0]">
            {currentActivities && currentActivities.length > 0 ? (
              currentActivities.map((activity) => (
                <li
                  key={activity._id}
                  className="flex items-center gap-1 py-2 px-6"
                >
                  <Dot className="text-[#2ECC71]" />
                  <div>
                    <p className="text-xs text-[#444] mb-1">
                      {activity.details}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {format(new Date(activity.timestamp), "PPpp")}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-[#7d7d7d]">No activity logs</p>
            )}
          </ul>
          {/* Pagination */}
          {currentActivities.length > 0 && (
            <div className="h-[50px] border-t border-[#D9D9D9] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
              <Pagination>
                <PaginationContent className="!flex !justify-between w-full px-5">
                  <PaginationItem>
                    {(() => {
                      const itemsPerPage = 4;
                      const start = (currentPage - 1) * itemsPerPage + 1;
                      const end = Math.min(
                        currentPage * itemsPerPage,
                        activities.length
                      );
                      return `Showing ${start}-${end} of ${activities.length} activities`;
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
      </div>

      {/* tab for mobile */}
      {/* buttons to navigate tab */}
      <div className="h-[44px] bg-white mt-5 p-[4px] grid grid-cols-2 md:hidden rounded-[0.625rem] shadow-2xs md:my-10 my-6">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("details")}
          className={`flex items-center justify-center text-sm rounded-[8px] font-Inter transition-all duration-100 ease-in-out ${
            activeTab === "details" ? "bg-[#3D80FF] text-white shadow-2xs" : ""
          }`}
        >
          User Details
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("activities")}
          className={`flex items-center justify-center text-sm rounded-[8px] font-Inter transition-all duration-100 ease-in-out ${
            activeTab === "activities"
              ? "bg-[#3D80FF] text-white shadow-2xs"
              : ""
          }`}
        >
          Staff Activities
        </Button>
      </div>

      {/* for user details */}
      {activeTab === "details" && (
        <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full md:hidden">
          <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
            Account Details
          </h6>
          <hr className="border-[#F0F0F0] mb-4" />
          <div className="divide-y divide-[#F0F0F0] px-6">
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Created Date:</span>
              <span>{new Date(user.createdAt).toDateString()}</span>
            </p>
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Last login:</span>
              <span>
                {lastLogin ? format(new Date(lastLogin), "PPpp") : "Never"}
              </span>
            </p>
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Total logins:</span>
              <span>{activityCount || 0}</span>
            </p>
            <p className="flex justify-between text-base text-[#444] py-3">
              <span>Address:</span>
              <span>{user.address || "N/A"}</span>
            </p>

            <p className="flex justify-between text-base text-[#444] py-3">
              <span>
                {user.role === "STAFF" ? "Sales recorded" : "Actions"}:
              </span>
              <span>--</span>
            </p>
          </div>
        </div>
      )}

      {/* for the activities */}
      {activeTab === "activities" && (
        <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full md:hidden">
          <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
            Staff Activities
          </h6>
          <hr className="border-[#F0F0F0] mb-4" />
          <ul className="divide-y divide-[#F0F0F0]">
            {currentActivities && currentActivities.length > 0 ? (
              currentActivities.map((activity) => (
                <li
                  key={activity._id}
                  className="flex items-center gap-1 py-2 px-6"
                >
                  <Dot className="text-[#2ECC71]" />
                  <div>
                    <p className="text-xs text-[#444] mb-1">
                      {activity.details}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      {format(new Date(activity.timestamp), "PPpp")}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-[#7d7d7d]">No activity logs</p>
            )}
          </ul>
          {/* Pagination */}
          {currentActivities.length > 0 && (
            <div className="h-[50px] border-t border-[#D9D9D9] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
              <Pagination>
                <PaginationContent className="!flex !justify-between w-full px-5">
                  <PaginationItem>
                    {(() => {
                      const itemsPerPage = 4;
                      const start = (currentPage - 1) * itemsPerPage + 1;
                      const end = Math.min(
                        currentPage * itemsPerPage,
                        activities.length
                      );
                      return `Showing ${start}-${end} of ${activities.length} activities`;
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
      )}
    </>
  );
};

export default UserAccountDetails;
