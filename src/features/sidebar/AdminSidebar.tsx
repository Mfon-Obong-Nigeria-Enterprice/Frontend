import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import { MdOutlineDashboard, MdOutlineShoppingBag } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { IoPerson, IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Bell } from "lucide-react";
import { IoIosLogOut } from "react-icons/io";

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
    title: "Notifications",
    url: "/admin/dashboard/admin-notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: IoSettingsOutline,
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
  const logoutMutation = useLogout();

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setShowModal(false); // close modal no matter what
      },
    });
  };

  return (
    <>
      <AdminSidebar onLogoutClick={handleLogoutClick} />
      <LogoutConfirmModal
        isOpen={showModal}
        onClose={() => !logoutMutation.isPending && setShowModal(false)}
        onConfirm={handleConfirm}
        isLoading={logoutMutation.isPending}
      />
    </>
  );
};

// export const AdminSidebarWithModal = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const logoutMutation = useLogout();

//   const handleLogoutClick = () => {
//     setShowModal(true);
//   };

//   const handleConfirm = async () => {
//     setIsLoading(true);

//     // wait for 1 second before logout
//     // setTimeout(() => {
//     logoutMutation.mutate(); // trigger logout

//     setIsLoading(false);
//     setShowModal(false);
//     // }, 100);
//   };

//   return (
//     <>
//       <AdminSidebar onLogoutClick={handleLogoutClick} />
//       {/* the logout modal */}
//       <LogoutConfirmModal
//         isOpen={showModal}
//         onClose={() =>
//           !isLoading && setShowModal(false) && !logoutMutation.isPending
//         }
//         onConfirm={handleConfirm}
//         isLoading={isLoading}
//       />
//     </>
//   );
// };
