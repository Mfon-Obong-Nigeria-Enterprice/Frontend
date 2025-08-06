import { FaRegBell } from "react-icons/fa";
import Logo from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import AdminUserModal from "@/features/dashboard/admin/AdminUserModal";
import { NotificationModal } from "@/features/dashboard/admin/NotificationModal";

type HeaderProps = {
  userRole?: "manager" | "maintainer" | "admin" | "staff";
};

const Header = ({ userRole }: HeaderProps) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);


  return (
    <><header className="h-14 sm:h-16 fixed top-0 right-0 left-0 z-20 flex justify-between items-center px-7 py-3 bg-white">
      <div>
        <div className="hidden md:flex">
          <Logo />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setIsNotificationModalOpen(true)}
          className="border border-[#F5F5F5] rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <FaRegBell />
        </button>

        <p className="hidden sm:block capitalize">{userRole}</p>

        <button
          onClick={() => setIsUserModalOpen(true)}
          className="focus:outline-none"
          aria-label="User settings"
        >
          <Avatar>
            <AvatarImage src={`/images/${userRole}-avatar.png`} />
            <AvatarFallback>{userRole?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header><AdminUserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        adminData={{
          _id: "6874dd3096123c9e8721ac6b",
          email: "aniekan50k@gmail.com",
          lastLogin: new Date().toISOString(),
          userRole: "admin",
          adminName: "Admin Name",
          profilePicture: "/public/images/admin-avatar.svg"
        }} /><NotificationModal
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen} /></>
  );
};

export default Header;