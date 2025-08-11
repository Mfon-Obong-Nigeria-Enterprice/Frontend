/** @format */

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  UserRound,
  UserRoundCog,
  Settings,
  LogOut,
} from "lucide-react";
import { HiMiniChartBar } from "react-icons/hi2";

import Logo from "@/components/Logo";
import { useLogout } from "@/hooks/uselogout";
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
    title: "Settings",
    url: "/manager/dashboard/manager-settings",
    icon: Settings,
  },
];

interface ManagerSidebarProps {
  hideHamburger?: boolean;
}

const ManagerSidebar = ({ hideHamburger = false }: ManagerSidebarProps) => {
  const { pathname } = useLocation();
  const { logout } = useLogout();

  return (
    <Sidebar>
      {!hideHamburger && <SidebarHeader />}
      <Logo />
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Check if current path starts with item URL or if it's a user detail/activity log path and this is the User Management item
                const isActive = 
                  pathname.startsWith(item.url) ||
                  (item.title === 'User Management' && 
                   (pathname.includes('/user-management/') || 
                    pathname.endsWith('/activity-log')));

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
        <SidebarMenuButton onClick={logout}>
          <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
export default ManagerSidebar;
