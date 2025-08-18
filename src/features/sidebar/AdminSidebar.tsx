import { Link, useLocation } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineShoppingBag } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { IoPerson, IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import Logo from "@/components/Logo";
import { useLogout } from "@/hooks/uselogout";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  // SidebarGroupLabel,
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
    url: "/admin/dashboard/overview",
    icon: MdOutlineDashboard,
  },
  { title: "Inventory", url: "/admin/dashboard/inventory", icon: BsBoxSeam },
  { title: "Clients", url: "/admin/dashboard/clients", icon: IoPerson },
  { title: "Sales", url: "/admin/dashboard/sales", icon: MdOutlineShoppingBag },
  {
    title: "Transactions",
    url: "/admin/dashboard/transactions",
    icon: RiLogoutCircleRLine,
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: IoSettingsOutline,
  },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const { logout } = useLogout();

  return (
    // mt-[3.5rem] pt-10
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
                  <SidebarMenuItem key={item.title}>
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
          <IoIosLogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
