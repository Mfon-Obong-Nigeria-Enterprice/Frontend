import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import {
  LayoutDashboard,
  Book,
  UserRound,
  UserRoundCog,
  Settings,
  LogOut,
} from "lucide-react";
import { MdOutlineNotifications } from "react-icons/md";
import { HiMiniChartBar } from "react-icons/hi2";

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
    icon: LayoutDashboard,
  },
  {
    title: "Business Report",
    url: "/manager/dashboard/business-report",
    icon: Book,
  },
  {
    title: "Clients",
    url: "/manager/dashboard/manage-clients",
    icon: UserRound,
  },
  {
    title: "Transaction",
    url: "/manager/dashboard/manage-transactions",
    icon: UserRound,
  },
  {
    title: "Revenue Analytics",
    url: "/manager/dashboard/revenue-analytics",
    icon: HiMiniChartBar,
  },
  {
    title: "User Management",
    url: "/manager/dashboard/manage-user",
    icon: UserRoundCog,
  },
  {
    title: "Notifications",
    url: "/manager/dashboard/manager-notifications",
    icon: MdOutlineNotifications,
  },
  {
    title: "Settings",
    url: "/manager/dashboard/manager-settings",
    icon: Settings,
  },
];

interface ManagerSidebarProps {
  onLogoutClick: () => void;
}

const ManagerSidebar = ({ onLogoutClick }: ManagerSidebarProps) => {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader />
      <Logo />
      <SidebarContent className="pt-8 z-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
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
          <LogOut />
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