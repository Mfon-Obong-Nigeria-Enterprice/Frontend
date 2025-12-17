import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// icons imported from react-icons
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosPeople, IoIosStats, IoIosNotifications } from "react-icons/io";
import { RiSettings3Line } from "react-icons/ri";
import { IoIosLogOut, IoIosArrowBack } from "react-icons/io";

// hooks
import { useLogout } from "@/hooks/uselogout";

// components
import Logo from "@/components/Logo";
import LogoutConfirmModal from "../dashboard/shared/LogoutConfirmModal";

// ui components
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

// Updated items array to use imported icon components
const items = [
  {
    title: "Overview",
    url: "/maintainer/dashboard/overview",
    icon: MdOutlineDashboard,
  },
  {
    title: "User Management",
    url: "/maintainer/dashboard/user-management",
    icon: IoIosPeople,
  },
  {
    title: "Activity log",
    url: "/maintainer/dashboard/log",
    icon: IoIosStats,
  },
  {
    title: "Notification",
    url: "/maintainer/dashboard/maintainer-notifications",
    icon: IoIosNotifications,
  },
  {
    title: "Settings",
    url: "/maintainer/dashboard/settings",
    icon: RiSettings3Line,
  },
];

type MaintainerSidebarProps = {
  onLogoutClick: () => void;
};

const MaintainerSidebar = ({ onLogoutClick }: MaintainerSidebarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader />
      <Logo />
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="cursor-pointer hover:bg-[#8C1C1380] hover:text-white rounded-sm p-6 my-1 flex items-center gap-3 transition-all bg-[#F4E8E7] text-[#333333]"
                  onClick={() => navigate(-1)}
                >
                  <IoIosArrowBack />
                  <span>Back</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title} className="font-bold">
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
                        {/* Render the icon component directly */}
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
          {/* Use the imported React icon component for logout */}
          <IoIosLogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

const MaintainerSidebarWithModal = () => {
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
    }, 100);
  };

  return (
    <>
      <MaintainerSidebar onLogoutClick={handleLogoutClick} />
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !isLoading && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  );
};

export default MaintainerSidebarWithModal;
