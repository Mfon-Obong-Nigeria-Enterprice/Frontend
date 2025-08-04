/** @format */

import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  Users,
  MapPin,
  CalendarDays,
  ListChecks,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserList: React.FC = () => {
  return (
    <div className="bg-white w-full m-0 p-0">
      <main className="flex flex-col gap-6 mb-0">
        <div className="flex items-center justify-between px-12 pt-8">
          <DashboardTitle heading="User List" description="" />
          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Auto Refresh</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
            </label>
            <button
              className="ml-2 p-1 rounded hover:bg-muted"
              aria-label="More options"
            >
              <MoreVertical className="size-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-12 py-6">
          {/* Search Input with Icon */}
          <div className="relative max-w-xs w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="size-5" />
            </span>
            <Input
              type="text"
              placeholder="Search users"
              className="pl-10 pr-3 h-10 rounded-md border border-input bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          {/* Dropdowns */}
          <div className="flex flex-wrap gap-3">
            {/* All Roles Dropdown */}
            <Select>
              <SelectTrigger className="w-44 flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span>All Roles</span>
                <ChevronDown className="size-4 ml-auto text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="maintainer">Maintainer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* All Locations Dropdown */}
            <Select>
              <SelectTrigger className="w-44 flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <span>All Locations</span>
                <ChevronDown className="size-4 ml-auto text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="ph">Port Harcourt</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* Date Range Dropdown */}
            <Select>
              <SelectTrigger className="w-44 flex items-center gap-2">
                <CalendarDays className="size-4 text-muted-foreground" />
                <span>Date Range</span>
                <ChevronDown className="size-4 ml-auto text-muted-foreground" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* All Status Dropdown */}
            <Select>
              <SelectTrigger className="w-44 flex items-center gap-2">
                <ListChecks className="size-4 text-muted-foreground" />
                <span>All Status</span>
                <ChevronDown className="size-4 ml-auto text-muted-foreground" />
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
        {/* User Table */}
        <div className="mt-6 w-full">
          <div className="w-full">
            <Table className="w-full bg-white">
              <TableHeader className="bg-[#F9F9F9] px-12">
                <TableRow>
                  <TableHead className="text-[#333] text-xs font-semibold py-3 px-4">
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
                  <TableHead className="py-3 w-8 text-right px-4">
                    <MoreVertical className="size-5 text-muted-foreground" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Example data, replace with your store data */}
                {[
                  {
                    id: "USR001",
                    name: "John Doe",
                    email: "john@example.com",
                    role: "Admin",
                    permissions: "All Access",
                    status: "Active",
                    lastLogin: "2025-07-20 09:15",
                    location: "Lagos",
                    created: "2025-06-01",
                    avatar: "/images/admin-avatar.png",
                  },
                  {
                    id: "USR002",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    role: "Manager",
                    permissions: "Edit, View",
                    status: "Inactive",
                    lastLogin: "2025-07-18 14:22",
                    location: "Abuja",
                    created: "2025-05-15",
                    avatar: "/images/manager-avatar.png",
                  },
                  {
                    id: "USR003",
                    name: "Samuel Staff",
                    email: "samuel@example.com",
                    role: "Staff",
                    permissions: "View Only",
                    status: "Pending",
                    lastLogin: "2025-07-10 11:05",
                    location: "Port Harcourt",
                    created: "2025-04-28",
                    avatar: "/images/staff-avatar.png",
                  },
                ].map((user, idx, arr) => (
                  <TableRow
                    key={user.id}
                    className={
                      idx < arr.length - 1 ? "border-b border-[#F0F0F0]" : ""
                    }
                  >
                    <TableCell className="text-xs text-[#444] py-3 font-mono px-4">
                      {user.id}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
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
                      <Badge
                        variant="outline"
                        className="capitalize p-2 text-xs"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-xs text-[#444] px-4">
                      {user.permissions}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Badge
                        variant={
                          user.status === "Active"
                            ? "default"
                            : user.status === "Inactive"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize p-2 text-xs"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-xs text-[#444] px-4">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="py-3 text-xs text-[#444] px-4">
                      {user.location}
                    </TableCell>
                    <TableCell className="py-3 text-xs text-[#444] px-4">
                      {user.created}
                    </TableCell>
                    <TableCell className="py-3 w-8 text-right px-4">
                      <button
                        className="p-1 rounded hover:bg-muted"
                        aria-label="More options"
                      >
                        <MoreVertical className="size-5 text-muted-foreground" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-6 py-5 text-xs text-muted-foreground border-t border-[#F0F0F0] bg-white w-full">
          <span>Showing 1-9 of 50 users</span>
          <div className="flex items-center gap-2">
            <button
              className="w-6 h-6 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0]"
              disabled
            >
              &#60;
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded border border-[#E0E0E0] bg-[#F5EAEA] text-[#B0B0B0] font-semibold">
              1
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0]">
              &#62;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserList;
