// src/components/UserOverview.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";

// components
import UserTable from "../usertable";
import CreateUserModal from "./modals/createusermodal";
import EditUserModal from "./modals/EditUserModal";
import UserSearchList from "../UserSearchList"; 
import Modal from "@/components/Modal";

// ui components
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

// icons
import {
  ExternalLink,
  MoreVertical,
  Plus,
} from "lucide-react";
import { MdOutlineHome } from "react-icons/md";



type UserDataProps = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  branchId?:
    | {
        _id: string;
        name: string;
      }
    | string;
  isActive?: boolean;
  isBlocked?: boolean;
  createdAt?: string;
  branch?: string;
  location?: string;
  profilePicture?: string;
};

const UserOverview = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { users } = useUserStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<UserDataProps | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    location: "all",
    dateRange: "all",
    status: "all"
  });

  // Get unique roles and locations from actual user data
  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(users.map(user => user.role)));
    return uniqueRoles;
  }, [users]);

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(users.map(user => user.location || user.branch || "")));
    return uniqueLocations.filter(loc => loc !== "");
  }, [users]);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!user.name.toLowerCase().includes(query) &&
            !user.email.toLowerCase().includes(query) &&
            !user.role.toLowerCase().includes(query) &&
            !(user.branch && user.branch.toLowerCase().includes(query))) {
          return false;
        }
      }
      
      // Role filter
      if (filters.role !== "all" && user.role !== filters.role) {
        return false;
      }
      
      // Location filter - check both location and branch fields
      if (filters.location !== "all") {
        const userLocation = user.location || user.branch || "";
        if (userLocation !== filters.location) {
          return false;
        }
      }
      
      // Status filter
      if (filters.status !== "all") {
        if (filters.status === "active" && (!user.isActive || user.isBlocked)) {
          return false;
        }
        if (filters.status === "inactive" && (user.isActive || user.isBlocked)) {
          return false;
        }
        if (filters.status === "suspended" && !user.isBlocked) {
          return false;
        }
        if (filters.status === "pending") {
          // For pending status, check if user is neither active nor blocked
          if (user.isActive || user.isBlocked) return false;
        }
      }
      
      // Date range filter
      if (filters.dateRange !== "all") {
        const createdDate = new Date(user.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - createdDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case "today":
            if (diffDays > 0) return false;
            break;
          case "week":
            if (diffDays > 7) return false;
            break;
          case "month":
            if (diffDays > 30) return false;
            break;
          default:
            break;
        }
      }
      
      return true;
    });
  }, [users, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleEditUser = (userData: UserDataProps) => {
    setSelectedUserData(userData);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserData(null);
  };

  return (
    <main className="">
      {/* heading */}
      <div className="flex items-center justify-between mt-[30px] md:mt-[39px] xl:mt-[47px] mx-5 md:mx-8 xl:mx-6">
        <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold font-Arial text-[#333333]">
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
                className="w-64 p-0 rounded-lg shadow-lg border border-[#F0F0F0] cursor-pointer"
              >
                <>
                  <button
                    className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] rounded-t-lg font-medium"
                  >
                    <span className="flex-1 text-left">
                      {">  "} Export All Users
                    </span>
                  </button>
                  <hr className="border-[#F0F0F0]" />
                  {user?.role === "SUPER_ADMIN" && (
                    <>
                      <button
                        className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] font-medium"
                        onClick={() => navigate(
                        "/manager/dashboard/user-log"
                      )} >
                        <span className="flex-1 text-left">User Audit Log</span>
                        <ExternalLink className="size-4 text-muted-foreground" />
                      </button>
                      <hr className="border-[#F0F0F0]" />
                    </>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] rounded-b-lg font-medium"
                    onClick={() => {
                      const url =
                        user?.role === "SUPER_ADMIN" ? "manager" : "maintainer";
                      navigate(
                        `/${url}/dashboard/user-management/col-settings`
                      );
                    }}
                  >
                    <span className="flex-1 text-left py-5">
                      Columns Settings
                    </span>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </Button>

                  {user?.role === "MAINTAINER" && (
                    <>
                      <hr className="border-[#F0F0F0]" />
                      <button className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] rounded-b-lg font-medium">
                        <span className="flex-1 text-left">
                          Add Bussiness Locations
                        </span>
                        <MdOutlineHome className="size-5 text-muted-foreground" />
                      </button>
                      <hr className="border-[#F0F0F0]" />
                    </>
                  )}
                </>
              </PopoverContent>
            </Popover>
          </div>
          {user?.role === "MAINTAINER" && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus /> Create new User
            </Button>
          )}
        </div>
      </div>

      {/* Use the UserSearchList component */}
      <UserSearchList 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        roles={roles}
        locations={locations}
      />

      <UserTable users={filteredUsers} onEditUser={handleEditUser} />

      {/* create new user modal */}
      {isCreateModalOpen && (
        <Modal
          size="xxl"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        >
          <CreateUserModal closeModal={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}

      {/* edit user modal */}
      {isEditModalOpen && selectedUserData && (
        <Modal
          size="xxl"
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
        >
          <EditUserModal
            closeModal={handleCloseEditModal}
            userData={selectedUserData}
          />
        </Modal>
      )}
    </main>
  );
};

export default UserOverview;