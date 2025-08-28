import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import {
  LayoutDashboard,
  UserRoundCog,
  // Settings,
  // CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
// import { HiMiniChartBar } from "react-icons/hi2";

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

const items = [
  {
    title: "Dashboard",
    url: "/maintainer/dashboard/overview",
    icon: LayoutDashboard,
  },

  {
    title: "User Management",
    url: "#",
    icon: UserRoundCog,
  },
  {
    title: "Notification",
    url: "/maintainer/dashboard/maintainer-notifications",
    icon: Bell,
  },
  // /manager/dashboard/manage-user
  // {
  //   title: "Settings",
  //   url: "/manager/dashboard/manager-settings",
  //   icon: Settings,
  // },
];

const MaintainerSidebar = () => {
  const { pathname } = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logoutMutation = useLogout();

  const handleConfirm = async () => {
    setIsLoading(true);

    // wait for 1 second before logout
    setTimeout(() => {
      logoutMutation.mutate(); // trigger logout
      setIsLoading(false);
      setShowModal(false);
    }, 1000);
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <Logo />
      <SidebarContent className="pt-8">
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
          onClick={() => setShowModal(true)}
        >
          <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>

      {/* the logout modal */}
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !isLoading && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </Sidebar>
  );
};
export default MaintainerSidebar;
