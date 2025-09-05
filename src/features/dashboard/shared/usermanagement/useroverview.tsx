import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

// components
import UserTable from "../usertable";
import CreateUserModal from "./modals/createusermodal";
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

const UserOverview = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    location: "all",
    dateRange: "all",
    status: "all"
  });

  // Sample data for filters (replace with your actual data)
  const roles = ["Admin", "Maintainer", "Manager", "Staff"];
  const locations = ["Uyo", "Lagos", "Abuja", "Port Harcourt"];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement your search logic here
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // Implement your filter logic here
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
                    //   onClick={handleExportAllUsers}
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
                        onClick={() => navigate("/manager/dashboard/log")}
                      >
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
            <Button onClick={() => setIsModalOpen(true)}>
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

      {/* user table */}
      <UserTable 
        searchQuery={searchQuery}
        filters={filters}
      />

      {/* open create new user modal */}
      {isModalOpen && (
        <Modal
          size="xxl"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <CreateUserModal closeModal={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
};

export default UserOverview; 