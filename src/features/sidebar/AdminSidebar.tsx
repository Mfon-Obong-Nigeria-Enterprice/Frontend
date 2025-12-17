import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// icons
import { MdOutlineShoppingBag } from "react-icons/md";
// Corrected imports to use lucide-react and react-icons for component-based icons
import {
  LayoutDashboard,
  Book,
  CreditCard,
  Settings,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { IoIosLogOut } from "react-icons/io";
import { IoPerson } from "react-icons/io5";

// hooks
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
    url: "/admin/dashboard/overview",
    icon: LayoutDashboard, // Replaced Vector
  },
  { title: "Inventory", url: "/admin/dashboard/inventory", icon: Book }, // Replaced Vector with a relevant icon
  { title: "Clients", url: "/admin/dashboard/clients", icon: IoPerson },
  { title: "Sales", url: "/admin/dashboard/sales", icon: MdOutlineShoppingBag },
  {
    title: "Transactions",
    url: "/admin/dashboard/transactions",
    icon: CreditCard, // Replaced Transaction
  },
  {
    title: "Notifications",
    url: "/admin/dashboard/admin-notifications",
    icon: Bell, // Replaced notification
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: Settings, // Replaced Settings
  },
];

type AdminSidebarProps = {
  onLogoutClick: () => void;
};

function AdminSidebar({ onLogoutClick }: AdminSidebarProps) {
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
                  className="cursor-pointer hover:bg-[#8C1C1380] hover:text-white rounded-sm p-6 my-1 flex items-center gap-3 transition-all text-[#333333]"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft />
                </SidebarMenuButton>
              </SidebarMenuItem>
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

export const AdminSidebarWithModal = () => {
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
      <AdminSidebar onLogoutClick={handleLogoutClick} />
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !isLoading && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  );
};
