/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/UserOverview.tsx
import { useState, useMemo, useCallback } from "react";
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
import BusinessLocationModal from "./modals/BusinessLocationModal";

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

// Add the filterUsers function
const filterUsers = (users: any[]) => {
  return users.filter(user => user.role !== "SUPER_ADMIN");
};

const UserOverview = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { users } = useUserStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<UserDataProps | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    role: "all",
    location: "all",
    dateRange: "all",
    status: "all"
  });

  const nonSuperAdminUsers = useMemo(() => filterUsers(users), [users]);

  // Get unique roles and locations from actual user data
  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(nonSuperAdminUsers.map(user => user.role)));
    return uniqueRoles;
  }, [nonSuperAdminUsers]);

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(nonSuperAdminUsers.map(user => user.location || user.branch || "")));
    return uniqueLocations.filter(loc => loc !== "");
  }, [nonSuperAdminUsers]);

  // Filter users based on search and filters (excluding SUPER_ADMIN)
  const filteredUsers = useMemo(() => {
    return nonSuperAdminUsers.filter(user => {
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
      
      // Date range filter - REMOVED CUSTOM RANGE SUPPORT
      if (filters.dateRange !== "all") {
        if (!user.createdAt) return false;
        
        const createdDate = new Date(user.createdAt);
        const now = new Date();
        let startDate: Date, endDate: Date;

        switch (filters.dateRange) {
          case "today":
            startDate = new Date(now);
            endDate = new Date(now);
            break;
          case "week":
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
            endDate = new Date(now);
            break;
          case "month":
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 1);
            endDate = new Date(now);
            break;
          default:
            return true;
        }

        // Reset times for correct date comparison
        const createdDateOnly = new Date(createdDate);
        createdDateOnly.setHours(0, 0, 0, 0);
        
        const startDateOnly = new Date(startDate);
        startDateOnly.setHours(0, 0, 0, 0);
        
        const endDateOnly = new Date(endDate);
        endDateOnly.setHours(23, 59, 59, 999);

        return createdDateOnly >= startDateOnly && createdDateOnly <= endDateOnly;
      }
      
      return true;
    });
  }, [nonSuperAdminUsers, searchQuery, filters]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  }, []);

  const handleEditUser = (userData: UserDataProps) => {
    setSelectedUserData(userData);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserData(null);
  };

  return (
    <main className="w-full max-w-full overflow-x-auto">
      {/* heading */}
      <div className="flex items-center justify-between mt-[30px] md:mt-[39px] xl:mt-[47px] mx-5 md:mx-8 xl:mx-6">
        <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold font-Arial text-[#333333]">
          User List
        </h2>

        {/* hold refresh and button for maintainer */}
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex items-center gap-1">
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
                        onClick={() => navigate("/manager/dashboard/user-log")}
                      >
                        <span className="flex-1 text-left">User Audit Log</span>
                        <ExternalLink className="size-4 text-muted-foreground" />
                      </button>
                      <hr className="border-[#F0F0F0]" />
                    </>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 px-4 py-4 text-sm hover:bg-[#F5F5F5] rounded-b-lg font-medium min-w-0"
                    onClick={() => {
                      const url = user?.role === "SUPER_ADMIN" ? "manager" : "maintainer";
                      navigate(`/${url}/dashboard/user-management/col-settings`);
                    }}
                  >
                    <span className="flex-1 text-left truncate min-w-0">
                      Columns Settings
                    </span>
                    <ExternalLink className="size-4 text-muted-foreground flex-shrink-0" />
                  </Button>

                  {user?.role === "MAINTAINER" && (
                    <>
                      <hr className="border-[#F0F0F0]" />
                      <button
                        className="w-full flex items-center gap-2 px-5 py-5 text-sm hover:bg-[#F5F5F5] rounded-b-lg font-medium"
                        onClick={() => setIsBusinessModalOpen(true)}
                      >
                        <span className="flex-1 text-left">
                          Add Business Locations
                        </span>
                        <MdOutlineHome className="size-5 text-muted-foreground" />
                      </button>
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
      <div className="bg-white mt-8 mx-5 md:mx-8 xl:mx-6">
        <h2 className="p-3 font-medium">Filter & Controls</h2>
        <UserSearchList 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          roles={roles}
          locations={locations}
          showLocationFilter={true}
        />
      </div>

      {/* User summary */}
      <div className="mt-4 px-5 md:px-8 xl:px-6">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} users 
          {filters.dateRange !== 'all' && ` created in ${filters.dateRange}`}
          {filters.role !== 'all' && ` with role: ${filters.role}`}
          {filters.location !== 'all' && ` at location: ${filters.location}`}
          {filters.status !== 'all' && ` with status: ${filters.status}`}
        </p>
      </div>
      
<div className="w-full px-5 md:px-8 xl:px-6 mt-4">
  <div className="w-full max-w-full overflow-x-auto">
  
    <UserTable users={filteredUsers} onEditUser={handleEditUser} />
  </div>
</div>


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

      {/* business location modal */}
      {isBusinessModalOpen && (
        <Modal
          size="lg"
          isOpen={isBusinessModalOpen}
          onClose={() => setIsBusinessModalOpen(false)}
        >
          <BusinessLocationModal closeModal={() => setIsBusinessModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
};

export default UserOverview;