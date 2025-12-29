import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

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

// SIDEBAR ITEMS — ICONIFY ONLY
const items = [
  {
    title: "Overview",
    url: "/maintainer/dashboard/overview",
    icon: "material-symbols:overview-key-outline-rounded",
  },
  {
    title: "User Management",
    url: "/maintainer/dashboard/user-management",
    icon: "mingcute:user-setting-line",
  },
  {
    title: "Activity log",
    url: "/maintainer/dashboard/log",
    icon: "material-symbols:search-activity-rounded",
  },
  {
    title: "Notification",
    url: "/maintainer/dashboard/maintainer-notifications",
    icon: "material-symbols:notifications-outline",
  },
  {
    title: "Settings",
    url: "/maintainer/dashboard/settings",
    icon: "material-symbols:settings-outline-rounded",
  },
];

type MaintainerSidebarProps = {
  onLogoutClick: () => void;
};

const MaintainerSidebar = ({ onLogoutClick }: MaintainerSidebarProps) => {
  const { pathname } = useLocation();

  return (
    <Sidebar className="w-[280px] md:w-[300px] lg:w-[288px]">
      <SidebarHeader />
      <Logo />

      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title} className="font-bold">
                    <SidebarMenuButton
                      asChild
                      className={`rounded-sm p-6 my-1 flex items-center gap-3 transition-all
                        ${
                          isActive
                            ? "bg-[#8C1C1380] text-white"
                            : "bg-[#F4E8E7] text-[#333333]"
                        }
                        hover:bg-[#8C1C1380] hover:text-white
                      `}
                    >
                      <NavLink to={item.url}>
                        <Icon
                          icon={item.icon}
                          width={20}
                          height={20}
                          className="shrink-0"
                        />
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
          className="cursor-pointer flex items-center gap-3"
          onClick={onLogoutClick}
        >
          <Icon icon="material-symbols:logout" width={20} />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

// WRAPPER WITH LOGOUT MODAL
const MaintainerSidebarWithModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logoutMutation = useLogout();

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      logoutMutation.mutate();
      setIsLoading(false);
      setShowModal(false);
    }, 100);
  };

  return (
    <>
      <MaintainerSidebar onLogoutClick={() => setShowModal(true)} />
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
