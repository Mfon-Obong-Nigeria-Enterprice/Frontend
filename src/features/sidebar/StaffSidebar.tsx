import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


// import { MdOutlineDashboard, MdOutlineShoppingBag } from "react-icons/md";
// import { BsBoxSeam } from "react-icons/bs";
// import { IoPerson } from "react-icons/io5";
// import { RiLogoutCircleRLine } from "react-icons/ri";
// import { IoIosLogOut } from "react-icons/io";

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
    icon: "dashboard",
  },
  {
    title: "Stock Levels",
    url: "/staff/dashboard/s-stock",
    icon: "inventory_2",
  },
  { title: "Clients", url: "/staff/dashboard/s-clients", icon: "groups" },
  {
    title: "New Sales",
    url: "/staff/dashboard/new-sales",
    icon: "shopping_cart",
  },
  {
    title: "My Sales",
    url: "/staff/dashboard/s-sales",
    icon: "shopping_bag ",
  },
];

type StaffSidebarProps = {
  onLogoutClick: () => void;
};

function StaffSidebar({ onLogoutClick }: StaffSidebarProps) {
  const { pathname } = useLocation();

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
                  <SidebarMenuItem key={item.title} className=" font-bold">
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
                     
                        <span className="material-symbols-outlined ">
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
        <SidebarMenuButton className="cursor-pointer" onClick={onLogoutClick}>
          {/* Use a <span> with the Material Symbols class */}
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

export const StaffSidebarWithModal = () => {
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
      <StaffSidebar onLogoutClick={handleLogoutClick} />
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !isLoading && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  );
};