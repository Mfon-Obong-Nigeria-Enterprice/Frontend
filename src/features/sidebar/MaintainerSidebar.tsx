/** @format */

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  UserRound,
  UserRoundCog,
  Settings,
  CreditCard,
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
      url: "/maintainer/dashboard/overview",
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
    icon: CreditCard,
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

const MaintainerSidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useLogout();

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
        <SidebarMenuButton onClick={logout}>
          <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
export default MaintainerSidebar;
