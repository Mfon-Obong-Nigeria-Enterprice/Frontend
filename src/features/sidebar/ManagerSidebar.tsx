import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// icons
import {
  MdOutlineDashboard,
  MdInventory2,
  MdBarChart,
  MdManageAccounts,
} from "react-icons/md";
import { FiUsers, FiSettings, FiLogOut } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";
// hooks
import { useLogout } from "@/hooks/uselogout";

// components
import Logo from "@/components/Logo";
import LogoutConfirmModal from "../dashboard/shared/LogoutConfirmModal";

// ui
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/manager/dashboard/m-overview",
    icon: MdOutlineDashboard,
  },
  {
    title: "Business Report",
    url: "/manager/dashboard/business-report",
    icon: MdInventory2,
  },
  {
    title: "Clients",
    url: "/manager/dashboard/manage-clients",
    icon: FiUsers,
  },
  {
    title: "Transaction",
    url: "/manager/dashboard/manage-transactions",
    icon: CgArrowsExchangeAlt,
  },
  {
    title: "Revenue Analytics",
    url: "/manager/dashboard/revenue-analytics",
    icon: MdBarChart,
  },
  {
    title: "User Management",
    url: "/manager/dashboard/manage-user",
    icon: MdManageAccounts,
  },
  {
    title: "Notifications",
    url: "/manager/dashboard/manager-notifications",
    icon: IoNotificationsOutline,
  },
  {
    title: "Settings",
    url: "/manager/dashboard/manager-settings",
    icon: FiSettings,
  },
];

interface ManagerSidebarProps {
  onLogoutClick: () => void;
}

const ManagerSidebar = ({ onLogoutClick }: ManagerSidebarProps) => {
  const { pathname } = useLocation();
  //const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader />
      <Logo />
      <SidebarContent className="pt-8 z-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* <SidebarMenuItem>
                <SidebarMenuButton
                  className="cursor-pointer hover:bg-[#8C1C1380] hover:text-white rounded-sm p-6 my-1 flex items-center gap-3 transition-all bg-[#F4E8E7] text-[#333333]"
                  onClick={() => navigate(-1)}
                >
                  <FiChevronLeft />
                  <span>Back</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title} className="">
                    <SidebarMenuButton
                      asChild
                      className={`hover:bg-[#8C1C1380] hover:text-white rounded-sm p-6 my-1 flex items-center gap-3 transition-all
                        ${
                          isActive
                            ? "bg-[#8C1C1380] text-white"
                            : "bg-[#F4E8E7] text-[#333333] "
                        }`}
                    >
                      <NavLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          className="cursor-pointer"
          onClick={() => onLogoutClick()}
        >
          <FiLogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

// Wrapper component that handles the modal
const ManagerSidebarWithModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logoutMutation = useLogout();

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setTimeout(() => {
      logoutMutation.mutate();
      setIsLoading(false);
      setShowModal(false);
    }, 500);
  };

  return (
    <>
      <ManagerSidebar onLogoutClick={handleLogoutClick} />
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !isLoading && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  );
};

export default ManagerSidebarWithModal;
