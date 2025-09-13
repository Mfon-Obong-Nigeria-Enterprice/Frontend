import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


// import {
//   LayoutDashboard,
//   UserRoundCog,
//   Settings,
//   CreditCard,
//   Bell,
//   LogOut,
// } from "lucide-react";

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

// Updated items array with string names for Material Symbols
const items = [
  {
    title: "Overview",
    url: "/maintainer/dashboard/overview",
    icon: "overview_key",
  },
  {
    title: "User Management",
    url: "/maintainer/dashboard/user-management",
    icon: "manage_accounts",
  },
  {
    title: "Activity log",
    url: "/maintainer/dashboard/log",
    icon: "search_activity",
  },
  {
    title: "Notification",
    url: "/maintainer/dashboard/maintainer-notifications",
    icon: "notifications",
  },
  {
    title: "Settings",
    url: "/maintainer/dashboard/settings",
    icon: "settings",
  },
];

type MaintainerSidebarProps = {
  onLogoutClick: () => void;
};

const MaintainerSidebar = ({ onLogoutClick }: MaintainerSidebarProps) => {
  const { pathname } = useLocation();

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
                      <Link to={item.url}>
                        <span className="material-symbols-outlined">
                          {item.icon}
                        </span>
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
          {/* Use a <span> with the Material Symbols class */}
          <span className="material-symbols-outlined">logout</span>
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
    }, 500);
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