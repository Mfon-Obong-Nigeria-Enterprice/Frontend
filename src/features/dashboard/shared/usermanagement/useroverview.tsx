import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

// components
import UserTable from "./usertable";
import CreateUserModal from "./modals/createusermodal";
import Modal from "@/components/Modal";

// ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
// icons
import {
  Search,
  ExternalLink,
  MoreVertical,
  MapPin,
  Users,
  CalendarDays,
  Zap,
  Plus,
} from "lucide-react";

const UserOverview = () => {
  const user = useAuthStore((s) => s.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="">
      {/* heading */}
      <div className="flex items-center justify-between mt-[30px] md:mt-[39px] xl:mt-[47px] mx-5 md:mx-8 xl:mx-6">
        <h2 className="text-xl md:text-2xl lg:text[1.75rem] font-bold font-Arial text-[#333333]">
          User List
        </h2>

        {/* hold refresh and button for maintainer */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-1">
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
                  <button
                    className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] rounded-t-lg font-medium"
                    //   onClick={handleExportAllUsers}
                  >
                    <span className="flex-1 text-left">
                      {">  "} Export All Users
                    </span>
                  </button>
                  <hr className="border-[#F0F0F0]" />
                  <button
                    className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] font-medium"
                    //   onClick={() => navigate("/manager/dashboard/activity-log")}
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
          {user?.role === "MAINTAINER" && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus /> Create new User
            </Button>
          )}{" "}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-6 px-4 py-5 font-sans w-full">
        {/* Search Input with Icon - full width on large screens, smaller height */}
        <div className="relative w-full mb-2 lg:mb-0 flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ">
            <Search className="size-5" />
          </span>
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-5 rounded-lg border border-[#E0E0E0] w-full text-sm bg-[#F9F9F9] text-[#444] placeholder:text-[#B0B0B0]"
            style={{ fontFamily: "inherit" }}
          />
        </div>
        {/* Filters row - below search on tablet, beside on desktop */}
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto flex-1">
          <div className="flex gap-2 w-full overflow-x-auto scrollbar-hide md:overflow-visible">
            <Select>
              {/* <Select value={selectedRole} onValueChange={setSelectedRole}> */}
              <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                <Users className="size-4 text-muted-foreground" />
                {/* <span>
                  {selectedRole === "all" ? "All Roles" : selectedRole}
                </span> */}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Roles</SelectItem>
                  {/* {roles.map((role) => (
                    <SelectItem
                      key={
                        typeof role === "string"
                          ? role
                          : role.id || role._id || role.name
                      }
                      value={typeof role === "string" ? role : role.name}
                    >
                      {typeof role === "string" ? role : role.name}
                    </SelectItem>
                  ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              {/* <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            > */}
              <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                <MapPin className="size-4 text-muted-foreground" />
                {/* <span> */}
                {/* {selectedLocation === "all"
                    ? "All Locations"
                    : selectedLocation}
                </span> */}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Locations</SelectItem>
                  {/* {locations.map((loc) => (
                    <SelectItem
                      key={
                        typeof loc === "string"
                          ? loc
                          : loc.id || loc._id || loc.name
                      }
                      value={typeof loc === "string" ? loc : loc.name}
                    >
                      {typeof loc === "string" ? loc : loc.name} */}
                  {/* </SelectItem>
                  ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
            //   value={selectedDateRange}
            //   onValueChange={setSelectedDateRange}
            >
              <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                <CalendarDays className="size-4 text-muted-foreground" />
                {/* <span>
                  {selectedDateRange === "all"
                    ? "Date Range"
                    : selectedDateRange}
                </span> */}
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
            <Select
            //   value={selectedStatus} onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full md:w-40 flex items-center gap-2 py-5 px-2 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] text-[#444] text-sm font-medium">
                <Zap className="size-4 text-muted-foreground fill-[#7D7D7D]" />
                {/* <span>
                  {selectedStatus === "all" ? "All Status" : selectedStatus}
                </span> */}
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

      {/* user table */}
      <UserTable />

      {/* open user modal */}
      {isModalOpen && (
        <Modal
          size="xxl"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <CreateUserModal />
        </Modal>
      )}
    </main>
  );
};

export default UserOverview;
