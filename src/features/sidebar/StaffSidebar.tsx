import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import { MdOutlineDashboard, MdOutlineShoppingBag } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { IoPerson } from "react-icons/io5";
// import {  IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";

// hook
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
    url: "/staff/dashboard/s-overview",
    icon: MdOutlineDashboard,
  },
  { title: "Stock Levels", url: "/staff/dashboard/s-stock", icon: BsBoxSeam },
  { title: "Clients", url: "/staff/dashboard/s-clients", icon: IoPerson },
  {
    title: "New Sales",
    url: "/staff/dashboard/new-sales",
    icon: MdOutlineShoppingBag,
  },
  {
    title: "My Sales",
    url: "/staff/dashboard/s-sales",
    icon: RiLogoutCircleRLine,
  },
];

export function StaffSidebar() {
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
    <Sidebar className="bg-white">
      <SidebarHeader />
      <Logo />
      <SidebarContent className="bg-white pt-8">
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
          <IoIosLogOut />
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
}
