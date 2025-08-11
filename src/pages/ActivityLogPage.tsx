/** @format */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/header/Header";
import ManagerSidebar from "@/features/sidebar/ManagerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import * as XLSX from "xlsx";
import { ArrowLeft } from "lucide-react";
import {
  ExternalLink,
  Users,
  MapPin,
  CalendarDays,
  Zap,
  Search,
  ChevronDown,
} from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// TypeScript interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  location?: string;
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
  permissions?: string[];
  passwordChanged?: boolean;
  isActive?: boolean;
  userId?: string;
}

const ActivityLogPage = () => {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarVisible] = useState(true);
    const navigate = useNavigate();
  // Date range state
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Fetch logs using React Query
  const { data: logs = [] } = useQuery<User[]>({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token") || "";
      
      const response = await fetch(`${apiUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You are not authorized to view activity logs. Please login.");
        }
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
  });

  const handleExportActivityLog = (activities: User[]) => {
    if (!activities || activities.length === 0) return;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(activities);
    XLSX.utils.book_append_sheet(wb, ws, "Activity Log");
    XLSX.writeFile(wb, "activity_log_report.csv");
  };

  // Get unique options from logs
  const roleOptions = [
    "All Roles",
    ...Array.from(new Set(logs.map((u) => u.role).filter(Boolean))),
  ];
  const locationOptions = [
    "All Locations",
    "Lagos",
    "Abuja",
    "Port Harcourt",
    ...Array.from(new Set(logs.map((u) => u.location).filter((loc): loc is string => Boolean(loc)))),
  ];
  const statusOptions = [
    "All Status",
    "active",
    "suspended",
    "pending",
    ...Array.from(new Set(logs.map((u) => u.status).filter(Boolean))),
  ];

  // Filtering logic
  const filteredLogs = logs.filter((user) => {
    if (roleFilter !== "All Roles" && user.role !== roleFilter) return false;
    if (locationFilter !== "All Locations" && user.location !== locationFilter)
      return false;
    if (statusFilter !== "All Status" && user.status !== statusFilter)
      return false;
    if (
      searchTerm &&
      !(
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
      return false;
    // Date range filter (inclusive)
    if (startDate || endDate) {
      if (!user.createdAt) return false;
      const created = new Date(user.createdAt);
      if (isNaN(created.getTime())) return false;
      if (startDate) {
        const s = new Date(startDate);
        if (created < s) return false;
      }
      if (endDate) {
        const e = new Date(endDate);
        // include entire end day
        e.setHours(23, 59, 59, 999);
        if (created > e) return false;
      }
    }
    return true;
  });

  // Pagination calculations (page size is 9)
  const totalFiltered = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const start = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalFiltered);
  const paginatedLogs = filteredLogs.slice(start - 1, end);

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, locationFilter, statusFilter, searchTerm, startDate, endDate]);

  // Clamp current page if it exceeds total pages (e.g., after filters reduce results)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full m-0 p-0">
        {/* Hamburger for sidebar toggle - top right after sidebar */}
        
        <div className={sidebarVisible ? "lg:block" : "hidden lg:hidden"}>
          <div className="hidden lg:hidden">
            <ManagerSidebar />
          </div>
          <div
            className={`$${
              sidebarVisible ? "block" : "hidden"
            } fixed top-0 left-0 h-full  bg-white shadow-xl z-[120] lg:hidden`}
          >
            <ManagerSidebar />
          </div>
        </div>
        <main className="flex-1 min-h-0 flex flex-col gap-6 mb-0 overflow-y-auto">
          <Header userRole="manager" />
          <div className="w-full px-0 md:px-8 pt-4 md:pt-6 pb-2 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span className="font-semibold text-[#333]">User management</span>
                <span className="mx-1">&gt;</span>
                <span className="font-semibold text-[#333]">
                  System Activity Log
                </span>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold text-[#333]">
                System Activity Log
              </h1>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 py-5 md:py-5 bg-white w-full md:w-auto"
                  size="sm"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="size-4" /> Back to User List
                </Button>
                <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex items-center gap-2 py-3 md:py-5 bg-white"
                onClick={() => handleExportActivityLog(logs)}
              >
                <ExternalLink className="size-4 " /> Export Activity Log
              </Button></div>
            </div>
          </div>
          {/* Filter & Controls */}
          <div className="w-full bg-white rounded-xl shadow p-3 md:p-6 border border-[#F0F0F0] mt-6 mb-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center lg:justify-between">
            <div className="relative w-full flex-grow min-w-0">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                <Search className="size-5 text-[#B0B0B0]" />
              </span>
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 pl-12 pr-4 border border-[#E0E0E0] rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#E0E0E0] text-sm"
              />
            </div>
            <div className="flex flex-nowrap gap-2 w-full lg:w-auto lg:flex-nowrap lg:justify-end relative overflow-x-auto overflow-y-visible lg:overflow-visible -mx-0 px-0 lg:-mx-6 lg:px-6 lg:snap-x lg:snap-mandatory">
              {/* Role Filter Dropdown */}
              <div className="relative snap-start">
                <DropdownMenu open={roleMenuOpen} onOpenChange={setRoleMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-3 lg:py-5 flex-shrink-0"
                      type="button"
                    >
                      <Users className="size-4 text-[#B0B0B0]" />
                      {roleFilter}
                      <ChevronDown className="size-4 text-[#B0B0B0]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={8} className="z-50 w-40">
                    {roleOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        className={`text-sm ${roleFilter === option ? "font-semibold" : ""}`}
                        onSelect={() => {
                          setRoleFilter(option);
                          setRoleMenuOpen(false);
                        }}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Location Filter Dropdown */}
              <div className="relative">
                <DropdownMenu open={locationMenuOpen} onOpenChange={setLocationMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-3 md:py-5 flex-shrink-0"
                      type="button"
                    >
                      <MapPin className="size-4 text-[#B0B0B0]" />
                      {locationFilter}
                      <ChevronDown className="size-4 text-[#B0B0B0]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={8} className="z-50 w-40 max-h-60 overflow-auto">
                    {locationOptions.length > 1 ? (
                      locationOptions.map((option) => (
                        <DropdownMenuItem
                          key={option}
                          className={`text-sm ${locationFilter === option ? "font-semibold" : ""}`}
                          onSelect={() => {
                            setLocationFilter(option);
                            setLocationMenuOpen(false);
                          }}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-[#888]">No locations found</div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Status Filter Dropdown */}
              <div className="relative">
                <DropdownMenu open={statusMenuOpen} onOpenChange={setStatusMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-3 md:py-5 flex-shrink-0"
                      type="button"
                    >
                      <Zap className="size-4 text-[#B0B0B0]" />
                      {statusFilter}
                      <ChevronDown className="size-4 text-[#B0B0B0]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={8} className="z-50 w-40 max-h-60 overflow-auto">
                    {statusOptions.length > 1 ? (
                      statusOptions.map((option) => (
                        <DropdownMenuItem
                          key={option}
                          className={`text-sm ${statusFilter === option ? "font-semibold" : ""}`}
                          onSelect={() => {
                            setStatusFilter(option);
                            setStatusMenuOpen(false);
                          }}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-[#888]">No statuses found</div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Date Range filter */}
              <DropdownMenu open={dateMenuOpen} onOpenChange={setDateMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-3 md:py-5 flex-shrink-0"
                    type="button"
                  >
                    <CalendarDays className="size-4 text-[#B0B0B0]" />
                    {startDate || endDate ? (
                      <span className="text-xs md:text-sm text-[#555]">
                        {startDate ? new Date(startDate).toLocaleDateString() : "..."} - {endDate ? new Date(endDate).toLocaleDateString() : "..."}
                      </span>
                    ) : (
                      <>Date Range</>
                    )}
                    <ChevronDown className="size-4 text-[#B0B0B0]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={8} className="z-50 w-64 p-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-[#666] w-16">From</label>
                      <input
                        type="date"
                        value={startDate ?? ""}
                        onChange={(e) => setStartDate(e.target.value || null)}
                        className="flex-1 border border-[#E0E0E0] rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-[#666] w-16">To</label>
                      <input
                        type="date"
                        value={endDate ?? ""}
                        onChange={(e) => setEndDate(e.target.value || null)}
                        className="flex-1 border border-[#E0E0E0] rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex justify-between gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 py-1"
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 py-1"
                        onClick={() => setDateMenuOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Mobile Export Button */}
          <div className="md:hidden px-4 md:px-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 py-5 md:py-5 bg-white"
              onClick={() => handleExportActivityLog(logs)}
            >
              <ExternalLink className="size-4" /> Export Activity Log
            </Button>
          </div>
          {/* Activity Log Table with error handling */}
          <div className="w-full bg-white rounded-xl shadow p-3 md:p-6 border border-[#F0F0F0]">
            {false ? (
              <div className="py-8 text-center text-red-500 text-base font-medium">
                An error occurred
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[#F5F5F5] text-[#333]">
                        <th className="py-3 px-4 text-left font-semibold text-[#333]">
                          TIMESTAMP
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[#333]">
                          USER
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[#333]">
                          ROLE
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[#333]">
                          ACTIONS
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[#333]">
                          DETAILS
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-[#333]">
                          DEVICE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.length > 0 ? (
                        paginatedLogs.map((user, idx) => {
                          // Synthesize log row from user fields
                          // Format timestamp as in image: Month Day, Year \n HH:MM AM/PM
                          let timestamp = "-";
                          if (user.createdAt) {
                            const d = new Date(user.createdAt);
                            const dateStr = d.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            });
                            const timeStr = d.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            });
                            timestamp = `${dateStr}\n${timeStr}`;
                          }
                          const name = user.name || "-";
                          const email = user.email || "-";
                          const role = user.role || "-";
                          const avatar =
                            user.profilePicture || "/images/manager-avatar.png";
                          // Example actions/details/device
                          let action = "User Added";
                          let details = "New Staff Member Added";
                          let device = "Desktop";
                          if (user.status === "suspended") {
                            action = "Account Suspended";
                            details = "User Account Deactivated";
                          } else if (user.lastLogin) {
                            action = "Login";
                            details = "User Logged in Successful";
                          } else if (user.permissions) {
                            action = "System Access";
                            details = "Disable System Access";
                          } else if (user.passwordChanged) {
                            action = "Password Change";
                            details = "Change Current Password";
                            device = "Mobile";
                          }
                          return (
                            <tr key={idx} className="border-b border-[#F0F0F0]">
                              <td className="py-3 px-4 whitespace-pre-line text-[#333] font-medium">
                                {timestamp}
                              </td>
                              <td className="py-3 px-4 flex items-center gap-2">
                                <Avatar className="w-8 h-8 mr-2">
                                  <AvatarImage src={avatar} alt={name} />
                                  <AvatarFallback className="bg-[#F5EAEA] text-[#B0B0B0] font-bold">
                                    {name ? name[0] : "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-[#333]">
                                    {name}
                                  </span>
                                  <span className="text-xs text-[#888]">
                                    {email}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="default"
                                  className={`capitalize text-xs px-3 py-1 font-semibold rounded-lg ${
                                    role === "MAINT"
                                      ? "bg-[#E6F4F1] text-[#2CA89A]"
                                      : role === "STAFF"
                                      ? "bg-[#F5EAEA] text-[#B0B0B0]"
                                      : "bg-[#E6F4F1] text-[#2CA89A]"
                                  }`}
                                >
                                  {role}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-[#333]">
                                {action}
                              </td>
                              <td className="py-3 px-4 text-[#888]">
                                {details}
                              </td>
                              <td className="py-3 px-4 text-[#333]">
                                {device}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-6 text-center text-[#888]"
                          >
                            No activity logs found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 text-xs text-[#888]">
                  <span>
                    {totalFiltered === 0
                      ? "Showing 0-0 of 0 users"
                      : `Showing ${start}-${end} of ${totalFiltered} users`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || totalFiltered === 0}
                    >
                      &#60;
                    </button>
                    <span className="px-2 text-[#333]">
                      Page {totalFiltered === 0 ? 0 : currentPage} of {totalFiltered === 0 ? 0 : totalPages}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalFiltered === 0}
                    >
                      &#62;
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ActivityLogPage;
