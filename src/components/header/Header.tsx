import { FaRegBell } from "react-icons/fa";
import Logo from "../Logo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useState } from "react";
import AdminUserModal from "@/features/dashboard/admin/AdminUserModal";
import { NotificationModal } from "@/features/dashboard/admin/NotificationModal";
import { ManagerUsersModal } from "@/features/dashboard/manager/component/ManagerUsersModal";

type HeaderProps = {
  userRole?: 'admin' | 'staff' | 'manager' | 'maintainer' | 'superadmin';
  userName?: string;
};

const Header = ({ userRole = "staff", userName = "User" }: HeaderProps) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const getAvatarImage = () => {
    
    return `/images/${userRole}-avatar.png`;
  };

  const getRoleBadgeColor = () => {
    switch(userRole.toLowerCase()) {
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'maintainer': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'superadmin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}>
              {userRole}
            </span>
          </div>

          <button
            onClick={() => {
              console.log(`Opening modal for ${userRole}`);
              setIsUserModalOpen(true);
            }}
            className="focus:outline-none"
            aria-label="User settings"
          >
            <Avatar>
              <AvatarImage 
                src={getAvatarImage()} 
                alt={`${userRole} avatar`}
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

    
      {['admin', 'staff'].includes(userRole) ? (
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
      ) : (
        <ManagerUsersModal
          open={isUserModalOpen}
          onOpenChange={setIsUserModalOpen}
          userData={{
            _id: "6874dd3096123c9e8721ac6b",
            email: `${userRole}@example.com`,
            lastLogin: new Date().toISOString(),
            userRole,
            fullName: userName,
            location: "Main Office",
            profilePicture: getAvatarImage()
          }}
          onProfileUpdate={(updatedData) => {
            console.log('Profile updated:', updatedData);
          
          }}
        />
      )}

      <NotificationModal
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
      />
    </>
  );
};

export default Header;