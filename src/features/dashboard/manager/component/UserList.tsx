/** @format */

import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import ManagerSidebar from "@/features/sidebar/ManagerSidebar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUsers, useUpdateUserStatus } from "../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import * as XLSX from 'xlsx';
import {
  Search,
  ExternalLink,
  MoreVertical,
  MapPin,
  Users,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// User type is defined in the API types file

const UserList: React.FC = () => {
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    name: string | null;
  }>({ open: false, name: null });
  const [suspendModal, setSuspendModal] = useState<{
    open: boolean;
    name: string | null;
  }>({ open: false, name: null });
  const [enableModal, setEnableModal] = useState<{
    open: boolean;
    name: string | null;
  }>({ open: false, name: null });

  const handleDeleteClick = (name: string) =>
    setDeleteModal({ open: true, name });
  const handleCloseModal = () => setDeleteModal({ open: false, name: null });
  const handleConfirmDelete = () => {
    // Add delete logic here
    setDeleteModal({ open: false, name: null });
  };

  const handleSuspendClick = (name: string) => {
    setSuspendModal({ open: true, name });
  };
  
  const handleCloseSuspendModal = () => {
    setSuspendModal({ open: false, name: null });
  };
  
  const handleConfirmSuspend = async () => {
    const user = users.find((u) => u.name === suspendModal.name);
    if (!user) return handleCloseSuspendModal();
    
    try {
      await suspendUser(user._id);
      toast.success("User suspended successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseSuspendModal();
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to suspend user");
      handleCloseSuspendModal();
    }
  };

  const handleEnableClick = (name: string) => {
    setEnableModal({ open: true, name });
  };

  const handleExportAllUsers = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(users);
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users_export.csv");
  };

  const queryClient = useQueryClient();
  const { data: users = [] } = useUsers();
  const { suspendUser, enableUser } = useUpdateUserStatus();
  
  const handleCloseEnableModal = () => {
    setEnableModal({ open: false, name: null });
  };
  
  const handleConfirmEnable = async () => {
    const user = users.find((u) => u.name === enableModal.name);
    if (!user) return handleCloseEnableModal();
    
    try {
      await enableUser(user._id);
      toast.success("User enabled successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseEnableModal();
    } catch (error) {
      console.error("Error enabling user:", error);
      toast.error("Failed to enable user");
      handleCloseEnableModal();
    }
  };
  
  const defaultRoles = [
    { name: "Admin" },
    { name: "Manager" },
    { name: "Supervisor" },
    { name: "Staff" },
  ] as const;

  const defaultLocations = [
    { name: "Main Office" },
    { name: "Warehouse" },
    { name: "Plaza" },
  ] as const;
  
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  
  const roles = defaultRoles;
  const locations = defaultLocations;
  const navigate = useNavigate();


  return (
    <div className="bg-white w-full m-0 p-0 ">
      <ManagerSidebar hideHamburger={true} />
      <main className="flex flex-col gap-6 mb-0 rounded-xl">
        <div className="flex items-center justify-between px-3 md:px-6 pt-6 rounded-lg">
          <DashboardTitle heading="User List" description="" />
          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-1 rounded-lg">
            <span className="text-sm text-muted-foreground">Auto Refresh</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="ml-1 p-1 rounded hover:bg-muted border border-[#E0E0E0]"
                  aria-label="More options"
                >
                  <MoreVertical className="size-5 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-64 p-0 rounded-lg shadow-lg border border-[#F0F0F0]"
              >
                <>
                  <button className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] rounded-t-lg font-medium" onClick= {handleExportAllUsers}>
                    <span className="flex-1 text-left">
                      {">  "} Export All Users
                    </span>
                  </button>
                  <hr className="border-[#F0F0F0]" />
                  <button
                    className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] font-medium"
                    onClick={() => navigate("/manager/dashboard/activity-log")}
                  >
                    <span className="flex-1 text-left">User Audit Log</span>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </button>
                  <hr className="border-[#F0F0F0]" />
                  <button className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] rounded-b-lg font-medium">
                    <span className="flex-1 text-left">Columns Settings</span>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </button>
                </>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Search and Filter Row */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 px-4 py-5 font-sans w-full">
          {/* Search Input with Icon - full width on large screens, smaller height */}
          <div className="relative w-full mb-2 lg:mb-0 flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ">
              <Search className="size-5" />
            </span>
            <Input
              type="text"
              placeholder="Search by name, email, role, or ID"
              className="pl-10 pr-4 py-5 rounded-lg border border-[#E0E0E0] w-full text-sm bg-[#F9F9F9] text-[#444] placeholder:text-[#B0B0B0]"
              style={{ fontFamily: "inherit" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filters row - below search on tablet, beside on desktop */}
          <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto flex-1">
            <div className="flex gap-2 w-full overflow-x-auto scrollbar-hide md:overflow-visible">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                  <Users className="size-4 text-muted-foreground" />
                  <span>
                    {selectedRole === "all" ? "All Roles" : selectedRole}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem
                        key={typeof role === 'string' ? role : role.name}
                        value={typeof role === 'string' ? role : role.name}
                      >
                        {typeof role === 'string' ? role : role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>
                    {selectedLocation === "all"
                      ? "All Locations"
                      : selectedLocation}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem
                        key={typeof loc === 'string' ? loc : loc.name}
                        value={typeof loc === 'string' ? loc : loc.name}
                      >
                        {typeof loc === 'string' ? loc : loc.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={selectedDateRange}
                onValueChange={setSelectedDateRange}
              >
                <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <span>
                    {selectedDateRange === "all"
                      ? "Date Range"
                      : selectedDateRange}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Date Range</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                  <SlidersHorizontal className="size-4 text-muted-foreground" />
                  <span>
                    {selectedStatus === "all" ? "All Status" : selectedStatus}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* User Table */}
        <div className="mt-6 w-full">
          <div className="w-full">
            <Table className="w-full bg-white">
              <TableHeader className="bg-[#F9F9F9] px-12 py-12">
                <TableRow>
                  <TableHead className="text-[#333] text-xs font-semibold py-5 px-4 ">
                    USER ID
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
                    USER DETAILS
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
                    ROLE
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
                    PERMISSIONS
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
                    STATUS
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
                    LAST LOGIN
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
                    LOCATION
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
                    CREATED
                  </TableHead>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  // Filter users by search and selected filters
                  let filtered = Array.isArray(users) ? users : [];
                  // Reset to page 1 if current page would be out of range after filtering
                  const totalFiltered = filtered.length;
                  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
                  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
                  
                  // Apply search filter
                  if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    filtered = filtered.filter(
                      (user) =>
                        user.name?.toLowerCase().includes(searchLower) ||
                        user.email?.toLowerCase().includes(searchLower) ||
                        user.role?.toLowerCase().includes(searchLower) ||
                        user.location?.toLowerCase().includes(searchLower) ||
                        user.status?.toLowerCase().includes(searchLower) ||
                        user.userId?.toLowerCase().includes(searchLower) ||
                        user._id?.toLowerCase().includes(searchLower)
                    );
                  }
                  
                  // Apply role filter
                  if (selectedRole !== "all") {
                    filtered = filtered.filter(
                      (u) =>
                        u.role &&
                        u.role.toLowerCase() === selectedRole.toLowerCase()
                    );
                  }
                  if (selectedLocation !== "all") {
                    filtered = filtered.filter(
                      (u) =>
                        u.location &&
                        u.location.toLowerCase() ===
                          selectedLocation.toLowerCase()
                    );
                  }
                  if (selectedStatus !== "all") {
                    filtered = filtered.filter((u) => {
                      if (selectedStatus === "active")
                        return u.isActive === true;
                      if (selectedStatus === "inactive")
                        return u.isActive === false;
                      if (selectedStatus === "pending")
                        return u.status?.toLowerCase() === "pending";
                      if (selectedStatus === "suspended")
                        return u.status?.toLowerCase() === "suspended";
                      return true;
                    });
                  }
                  // Date range filter (basic: only today/week/month)
                  if (selectedDateRange !== "all") {
                    const now = new Date();
                    filtered = filtered.filter((u) => {
                      if (!u.createdAt) return false;
                      const created = new Date(u.createdAt);
                      if (selectedDateRange === "today") {
                        return created.toDateString() === now.toDateString();
                      }
                      if (selectedDateRange === "week") {
                        const weekAgo = new Date(now);
                        weekAgo.setDate(now.getDate() - 7);
                        return created >= weekAgo && created <= now;
                      }
                      if (selectedDateRange === "month") {
                        return (
                          created.getMonth() === now.getMonth() &&
                          created.getFullYear() === now.getFullYear()
                        );
                      }
                      // custom: no filter
                      return true;
                    });
                  }
                  const startIndex = (safePage - 1) * pageSize;
                  const endIndex = Math.min(startIndex + pageSize, totalFiltered);
                  const paginated = filtered.slice(startIndex, endIndex);
                  if (paginated.length > 0) {
                    return paginated.map((user, idx, arr) => {
                      // ...existing code...
                      // Match role colors to Activity Log
                      let roleColor = "bg-[#E6F4F1] text-[#2CA89A]"; // Maintainer
                      if (user.role?.toLowerCase() === "staff")
                        roleColor = "bg-[#F5EAEA] text-[#B0B0B0]";
                      if (user.role?.toLowerCase() === "admin")
                        roleColor = "bg-[#E6F4F1] text-[#2CA89A]";
                      let statusColor = "bg-green-100 text-green-700";
                      let statusText = "Active";
                      if (user.isActive === false) {
                        statusColor = "bg-yellow-100 text-yellow-700";
                        statusText = "Inactive";
                      }
                      if (user.status?.toLowerCase() === "suspended") {
                        statusColor = "bg-red-100 text-red-700";
                        statusText = "Suspended";
                      }
                      const initials = user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "U";
                      return (
                        <TableRow
                          key={user._id}
                          className={
                            "transition hover:bg-[#F5F5F5] " +
                            (idx < arr.length - 1
                              ? "border-b border-[#F0F0F0]"
                              : "")
                          }
                        >
                          <TableCell className="text-xs text-[#444] py-3 font-mono px-4">
                            {user.userId || user._id}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={user.profilePicture || undefined}
                                  alt={user.name}
                                />
                                <AvatarFallback
                                  className="rounded-full font-bold text-white flex items-center justify-center"
                                  style={{
                                    background: "#E0E0E0",
                                    color: "#444",
                                  }}
                                >
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-[#444] text-sm">
                                  {user.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <span
                              className={`rounded px-2 py-1 text-xs font-semibold ${roleColor}`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 text-xs text-[#444] px-4">
                            {user.permissions || "-"}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <span
                              className={`rounded px-2 py-1 text-xs font-semibold ${statusColor}`}
                            >
                              {statusText}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 text-xs text-[#444] px-4">
                            {user.lastLogin || "-"}
                          </TableCell>
                          <TableCell className="py-3 text-xs text-[#444] px-4">
                            {user.location || "-"}
                          </TableCell>
                          <TableCell className="py-3 text-xs text-[#444] px-4">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          {/* Three dots popover menu at end of row */}
                          <TableCell className="py-3 px-4 text-right">
                            {!(
                              deleteModal.open && deleteModal.name === user.name
                            ) &&
                            !(
                              suspendModal.open &&
                              suspendModal.name === user.name
                            ) &&
                            !(
                              enableModal.open && enableModal.name === user.name
                            ) ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    className="ml-2 p-1 rounded hover:bg-muted border border-[#E0E0E0]"
                                    aria-label="User actions"
                                  >
                                    <MoreVertical className="size-5 text-muted-foreground" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="end"
                                  className="w-64 p-0 rounded-lg shadow-lg border border-[#F0F0F0]"
                                >
                                  <>
                                    <button
                                      className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium"
                                      onClick={() =>
                                        navigate(`/user-management/${user._id}`)
                                      }
                                    >
                                      <span className="flex-1 text-left">
                                        View User Data
                                      </span>
                                      <ExternalLink className="size-4 text-muted-foreground" />
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium">
                                      <span className="flex-1 text-left">
                                        Edit User
                                      </span>
                                      <ExternalLink className="size-4 text-muted-foreground" />
                                    </button>
                                    <button
                                      className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium"
                                      onClick={() =>
                                        handleEnableClick(user.name)
                                      }
                                    >
                                      <span className="flex-1 text-left">
                                        Enable User
                                      </span>
                                    </button>
                                    <button
                                      className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium"
                                      onClick={() =>
                                        handleSuspendClick(user.name)
                                      }
                                    >
                                      <span className="flex-1 text-left">
                                        Suspend User
                                      </span>
                                    </button>
                                    <button
                                      className="w-full flex items-center gap-2 px-5 py-4 text-sm hover:bg-[#F5F5F5] font-medium text-red-600"
                                      onClick={() =>
                                        handleDeleteClick(user.name)
                                      }
                                    >
                                      <span className="flex-1 text-left">
                                        Delete User
                                      </span>
                                    </button>
                                  </>
                                </PopoverContent>
                              </Popover>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      );
                    });
                  } else {
                    return (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No users found.
                        </TableCell>
                      </TableRow>
                    );
                  }
                })()}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Delete Confirmation Modal (rendered outside main for stacking) */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-md mx-auto text-center">
              <h2 className="text-xl font-bold mb-4 ">Confirm Action</h2>
              <p className="mb-6 text-base text-[#444]">
                You are about to delete{" "}
                <span className="font-semibold">{deleteModal.name}</span>.<br />
                Are you sure you want to perform this action?
                <br />
                <span className="font-medium">This can’t be undone...</span>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 rounded-lg text-[#444] font-medium border-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Suspend Confirmation Modal (customized) */}
        {suspendModal.open && suspendModal.name && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-md mx-auto text-center">
              <h2 className="text-xl font-bold mb-4 ">Confirm Action</h2>
              <p className="mb-6 text-base text-[#444]">
                You are about to suspend{" "}
                <span className="font-semibold">{suspendModal.name}</span>.
                <br />
                Are you sure you want to perform this action?
                <br />
                <span className="font-medium">
                  This will restrict the user's access.
                </span>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 rounded-lg text-[#444] font-medium border-2"
                  onClick={handleCloseSuspendModal}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium"
                  onClick={handleConfirmSuspend}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Enable Confirmation Modal (customized) */}
        {enableModal.open && enableModal.name && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 w-full max-w-md mx-auto text-center">
              <h2 className="text-xl font-bold mb-4 ">Confirm Action</h2>
              <p className="mb-6 text-base text-[#444]">
                You are about to enable{" "}
                <span className="font-semibold">{enableModal.name}</span>.<br />
                Are you sure you want to perform this action?
                <br />
                <span className="font-medium">
                  This will allow the user to access the system again.
                </span>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-2 rounded-lg text-[#444] font-medium border-2"
                  onClick={handleCloseEnableModal}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium"
                  onClick={handleConfirmEnable}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-3 md:px-6 py-4 md:py-6 text-sm text-muted-foreground border-t border-[#F0F0F0] bg-white w-full">
          {/* Calculate actual range based on filtered users */}
          {(() => {
            // Reproduce filter length minimally for footer (fallback to users.length if unavailable)
            const total = Array.isArray(users) ? users.length : 0;
            const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
            const end = Math.min(currentPage * pageSize, total);
            return (
              <span className="font-medium text-[#444]">
                {`Showing ${start}-${end} of ${total} users`}
              </span>
            );
          })()}
          {(() => {
            const total = Array.isArray(users) ? users.length : 0;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));
            const canPrev = currentPage > 1;
            const canNext = currentPage < totalPages;
            return (
              <div className="flex items-center gap-3">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#E0E0E0] bg-white text-[#B0B0B0] text-sm font-bold transition hover:bg-[#F5F5F5] disabled:opacity-50"
                  disabled={!canPrev}
                  aria-label="Previous page"
                  onClick={() => canPrev && setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  &#60;
                </button>
                <button className="min-w-10 h-10 px-3 flex items-center justify-center rounded-lg border border-[#E0E0E0] bg-[#F5EAEA] text-[#B0B0B0] text-sm font-bold">
                  {currentPage}
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#E0E0E0] bg-white text-[#B0B0B0] text-sm font-bold transition hover:bg-[#F5F5F5] disabled:opacity-50"
                  aria-label="Next page"
                  disabled={!canNext}
                  onClick={() => canNext && setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  &#62;
                </button>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
};

export default UserList;
