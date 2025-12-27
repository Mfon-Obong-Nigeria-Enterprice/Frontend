import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

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

// SIDEBAR ITEMS — ICONIFY ONLY
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard/overview",
    icon: "material-symbols:dashboard-outline",
  },
  {
    title: "Inventory",
    url: "/admin/dashboard/inventory",
    icon: "material-symbols:inventory-2-outline-sharp",
  },
  {
    title: "Clients",
    url: "/admin/dashboard/clients",
    icon: "material-symbols:groups-outline",
  },
  {
    title: "Sales",
    url: "/admin/dashboard/sales",
    icon: "material-symbols:shopping-bag-outline-sharp",
  },
  {
    title: "Transactions",
    url: "/admin/dashboard/transactions",
    icon: "material-symbols:send-money",
  },
  {
    title: "Notifications",
    url: "/admin/dashboard/admin-notifications",
    icon: "material-symbols:notifications-outline",
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: "material-symbols:settings-outline-rounded",
  },
];

type AdminSidebarProps = {
  onLogoutClick: () => void;
};

function AdminSidebar({ onLogoutClick }: AdminSidebarProps) {
  const { pathname } = useLocation();
 // const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader />
      <Logo />

      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Back Button */}
              {/* <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate(-1)}
                  className="cursor-pointer rounded-sm p-6 my-1 flex items-center gap-3 transition-all
                  bg-[#F4E8E7] text-[#333333] hover:bg-[#8C1C1380] hover:text-white"
                >
                  <Icon icon="material-symbols:arrow-back" width={20} />
                  <span>Back</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}

              {/* Menu Items */}
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-sm p-6 my-1 flex items-center gap-3 transition-all
                        ${
                          isActive
                            ? "bg-[#8C1C1380] text-white"
                            : "bg-[#F4E8E7] text-[#333333]"
                        }
                        hover:bg-[#8C1C1380] hover:text-white
                      `}
                    >
                      <NavLink to={item.url}>
                        <Icon
                          icon={item.icon}
                          width={20}
                          height={20}
                          className="shrink-0"
                        />
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
        <SidebarMenuButton
          className="cursor-pointer flex items-center gap-3"
          onClick={onLogoutClick}
        >
          <Icon icon="material-symbols:logout" width={20} />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

// WRAPPER WITH LOGOUT MODAL
export const AdminSidebarWithModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logoutMutation = useLogout();

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      logoutMutation.mutate();
      setIsLoading(false);
      setShowModal(false);
    }, 500);
  };

  return (
    <>
      <AdminSidebar onLogoutClick={() => setShowModal(true)} />
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !isLoading && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  );
};
