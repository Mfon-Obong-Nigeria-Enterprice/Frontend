import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


// import { MdOutlineShoppingBag } from "react-icons/md";
// import Vector from "public/icons/Vector (1).svg"
// import notification from 'public/icons/notification.svg'
// import  Transaction from 'public/icons/Transaction.svg'
// import  Settings from 'public/icons/Settings.svg' 
// import { IoPerson } from "react-icons/io5";
// import { HomeIcon } from "lucide-react";
// import { IoIosLogOut } from "react-icons/io";

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

// Updated items array with string names from Material Symbols
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard/overview",
    icon:  "dashboard",
  },
  { title: "Inventory", url: "/admin/dashboard/inventory", icon: "inventory_2" },
  { title: "Clients", url: "/admin/dashboard/clients", icon: "groups" },
  { title: "Sales", url: "/admin/dashboard/sales", icon: "shopping_bag" },
  {
    title: "Transactions",
    url: "/admin/dashboard/transactions",
    icon: "send_money"
  },
  {
    title: "Notifications",
    url: "/admin/dashboard/admin-notifications",
    icon: "notifications",
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: "settings",
  },
];

type AdminSidebarProps = {
  onLogoutClick: () => void;
};
function AdminSidebar({ onLogoutClick }: AdminSidebarProps) {
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
        <SidebarMenuButton className="cursor-pointer" onClick={onLogoutClick}>
          {/* Use a <span> with the Material Symbols class */}
          <span className="material-symbols-outlined">logout</span>
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
    }, 100);
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