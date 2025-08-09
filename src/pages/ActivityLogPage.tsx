/** @format */

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
import Header from "@/components/header/Header";
import ManagerSidebar from "@/features/sidebar/ManagerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import * as XLSX from "xlsx"; // Import XLSX for exporting
import {
  ExternalLink,
  Users,
  MapPin,
  CalendarDays,
  Zap,
  Search,
  ChevronDown,
} from "lucide-react";

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarVisible] = useState(true);
  const [error, setError] = useState("");
  const handleExportActivityLog = (activities: any[]) => {
    if (!activities || activities.length === 0) return; // Ensure activity data is available
    const wb = XLSX.utils.book_new(); // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(activities); // Convert activity data to a worksheet
    XLSX.utils.book_append_sheet(wb, ws, "Activity Log"); // Append the worksheet to the workbook
    XLSX.writeFile(wb, "activity_log_report.csv"); // Export the workbook to a CSV file
  };

  useEffect(() => {
    // Fetch logs from the users endpoint
    fetch("https://mfon-obong-enterprise.onrender.com/api/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          setError(
            res.status === 401
              ? "You are not authorized to view activity logs. Please login."
              : `Error ${res.status}: ${text}`
          );
          setLogs([]);
          return;
        }
        const data = JSON.parse(text);
        setLogs(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch(() => {
        setError("Unable to fetch activity logs. Please try again later.");
        setLogs([]);
      });
  }, []);

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
    return true;
  });

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
        <main className="flex-1 flex flex-col gap-6 mb-0">
          <Header userRole="manager" />
          <div className="w-full bg-white px-8 pt-6 pb-2 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-16 mb-4">
              <span className="font-semibold text-[#333]">User management</span>
              <span className="mx-1">&gt;</span>
              <span className="font-semibold text-[#333]">
                System Activity Log
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#333]">
                System Activity Log
              </h1>
              <Button
     variant="outline"
     size="sm"
     className="flex items-center gap-2 py-5"
     onClick={() => handleExportActivityLog(logs)} // Call the export function on click
   >
     <ExternalLink className="size-4" /> Export User Report
   </Button>
            </div>
          </div>
          {/* Filter & Controls */}
          <div className="w-full bg-white rounded-xl shadow p-6 border border-[#F0F0F0] mt-6 mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
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
            <div className="flex gap-2 w-full md:w-auto relative">
              {/* Role Filter Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-5"
                  onClick={() => setRoleMenuOpen((open) => !open)}
                  type="button"
                >
                  <Users className="size-4 text-[#B0B0B0]" />
                  {roleFilter}
                  <ChevronDown className="size-4 text-[#B0B0B0]" />
                </Button>
                {roleMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-40 bg-white border border-[#E0E0E0] rounded shadow z-50">
                    {roleOptions.map((option) => (
                      <button
                        key={option}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F5F5] ${
                          roleFilter === option
                            ? "bg-[#F5F5F5] font-semibold"
                            : ""
                        }`}
                        onClick={() => {
                          setRoleFilter(option);
                          setRoleMenuOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Location Filter Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-5"
                  onClick={() => setLocationMenuOpen((open) => !open)}
                  type="button"
                >
                  <MapPin className="size-4 text-[#B0B0B0]" />
                  {locationFilter}
                  <ChevronDown className="size-4 text-[#B0B0B0]" />
                </Button>
                {locationMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-40 bg-white border border-[#E0E0E0] rounded shadow z-50">
                    {locationOptions.length > 1 ? (
                      locationOptions.map((option) => (
                        <button
                          key={option}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F5F5] ${
                            locationFilter === option
                              ? "bg-[#F5F5F5] font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setLocationFilter(option);
                            setLocationMenuOpen(false);
                          }}
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-[#888]">
                        No locations found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Status Filter Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-5"
                  onClick={() => setStatusMenuOpen((open) => !open)}
                  type="button"
                >
                  <Zap className="size-4 text-[#B0B0B0]" />
                  {statusFilter}
                  <ChevronDown className="size-4 text-[#B0B0B0]" />
                </Button>
                {statusMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-40 bg-white border border-[#E0E0E0] rounded shadow z-50">
                    {statusOptions.length > 1 ? (
                      statusOptions.map((option) => (
                        <button
                          key={option}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F5F5F5] ${
                            statusFilter === option
                              ? "bg-[#F5F5F5] font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setStatusFilter(option);
                            setStatusMenuOpen(false);
                          }}
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-[#888]">
                        No statuses found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Date Range filter not implemented, just icon */}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-[#333] border-[#E0E0E0] bg-white py-5"
                type="button"
              >
                <CalendarDays className="size-4 text-[#B0B0B0]" /> Date Range{" "}
                <ChevronDown className="size-4 text-[#B0B0B0]" />
              </Button>
            </div>
          </div>
          {/* Activity Log Table with error handling */}
          <div className="w-full bg-white rounded-xl shadow p-6 border border-[#F0F0F0]">
            {error ? (
              <div className="py-8 text-center text-red-500 text-base font-medium">
                {error}
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
                        filteredLogs.map((user, idx) => {
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
                    Showing 1-{filteredLogs.length} of {logs.length} users
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
                      disabled
                    >
                      &#60;
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-[#F5EAEA] text-[#B0B0B0] font-semibold text-base">
                      1
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
                      disabled={logs.length < 7}
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
