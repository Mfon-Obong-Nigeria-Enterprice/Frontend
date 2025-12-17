import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// icons
import { MdOutlineDashboard, MdOutlineShoppingBag } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { IoPerson } from "react-icons/io5";
import { RiFileListLine } from "react-icons/ri"; // Changed from RiLogoutCircleRLine
import { IoIosLogOut, IoIosArrowBack } from "react-icons/io";

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
    icon: RiFileListLine,
  },
];
type StaffSidebarProps = {
  onLogoutClick: () => void;
};

function StaffSidebar({ onLogoutClick }: StaffSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="bg-white">
      <SidebarHeader />
      <Logo />
      <SidebarContent className="bg-white pt-8">
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
                      <NavLink to={item.url}>
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
        <SidebarMenuButton className="cursor-pointer" onClick={onLogoutClick}>
          <IoIosLogOut />
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
