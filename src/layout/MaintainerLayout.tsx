import Header from "@/features/dashboard/shared/header/Header";
import { Outlet, useLocation } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppProvider } from "@/providers/AppProvider";
import { useModalStore } from "@/stores/useModalStore";
import DeleteUserModal from "@/features/dashboard/shared/usermanagement/modals/deleteusermodal";
import UserStatusModal from "@/features/dashboard/shared/usermanagement/modals/userstatusmodal";
import MaintainerSidebarWithModal from "@/features/sidebar/MaintainerSidebar";

const MaintainerLayout = () => {
  const pathname = useLocation();
  const { deleteModal, statusModal, closeModals } = useModalStore();

  return (
    <SidebarProvider>
      <MaintainerSidebarWithModal />
      <div className="w-full">
        <Header userRole="maintainer" />
        <SidebarTrigger className="fixed z-50" />
        <div
          className={`min-h-[90dvh] ${
            pathname.pathname.endsWith("/user-management")
              ? "bg-[#f5f5f5] xl:bg-white mt-[4rem] border border-[#D9D9D9]"
              : "bg-[#f5f5f5] p-10 mt-[3rem]"
          }`}
        >
          <AppProvider>
            <Outlet />
          </AppProvider>
        </div>
        {/* Global modals for maintainer */}
        {deleteModal && (
          <DeleteUserModal user={deleteModal} onClose={closeModals} />
        )}

        {statusModal && (
          <UserStatusModal
            user={{ id: statusModal.id, name: statusModal.name }}
            action={statusModal.action}
            onClose={closeModals}
          />
        )}
      </div>
    </SidebarProvider>
  );
};
export default MaintainerLayout;
