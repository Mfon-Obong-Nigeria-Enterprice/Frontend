import { FaRegBell } from "react-icons/fa";
import Logo from "../Logo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useState } from "react";
import AdminUserModal from "@/features/dashboard/admin/AdminUserModal";
import { NotificationModal } from "@/features/dashboard/admin/NotificationModal";


const Header = ({ userRole = "staff", userName = "User" }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

 
  const getAvatarImage = () => {
    return `/images/${userRole}-avatar.png`;
  };

  return (
    <>
      <header className="h-14 sm:h-16 fixed top-0 right-0 left-0 z-20 flex justify-between items-center px-7 py-3 bg-white shadow-sm">
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
            <FaRegBell className="text-gray-600" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="capitalize font-medium text-gray-700">{userName}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              userRole === 'admin' ? 'bg-blue-100 text-blue-800' :
              userRole === 'maintainer' ? 'bg-purple-100 text-purple-800' :
              userRole === 'superadmin' ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            }`}>
              {userRole}
            </span>
          </div>

          <button
            onClick={() => setIsUserModalOpen(true)}
            className="focus:outline-none"
            aria-label="User settings"
          >
            <Avatar>
              <AvatarImage 
              src={getAvatarImage()} 
              alt={`${userRole} avatar`}
            />
              <AvatarFallback>
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      <AdminUserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        adminData={{
          _id: "6874dd3096123c9e8721ac6b",
          email: `${userRole}@example.com`,
          lastLogin: new Date().toISOString(),
          userRole,
          adminName: userName,
          profilePicture: getAvatarImage() 
        }}
      />

      <NotificationModal
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
      />
    </>
  );
};

export default Header;