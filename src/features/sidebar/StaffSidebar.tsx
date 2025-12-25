import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

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

// SIDEBAR ITEMS — ICONIFY ONLY
const items = [
  {
    title: "Dashboard",
    url: "/staff/dashboard/s-overview",
    icon: "material-symbols:dashboard-outline",
  },
  {
    title: "Stock Levels",
    url: "/staff/dashboard/s-stock",
    icon: "ep:takeaway-box",
  },
  {
    title: "Clients",
    url: "/staff/dashboard/s-clients",
    icon: "material-symbols:groups-outline",
  },
  {
    title: "New Sales",
    url: "/staff/dashboard/new-sales",
    icon: "mdi:cart-outline",
  },
  {
    title: "My Sales",
    url: "/staff/dashboard/s-sales",
    icon: "material-symbols:shopping-bag-outline-sharp",
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
              {/* Back Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate(-1)}
                  className="cursor-pointer rounded-sm p-6 my-1 flex items-center gap-3 transition-all
                  bg-[#F4E8E7] text-[#333333] hover:bg-[#8C1C1380] hover:text-white"
                >
                  <Icon icon="material-symbols:arrow-back" width={20} />
                  <span>Back</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

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
                          className="shrink-0 font-bold"
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
export const StaffSidebarWithModal = () => {
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
      <StaffSidebar onLogoutClick={() => setShowModal(true)} />
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !isLoading && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  );
};
