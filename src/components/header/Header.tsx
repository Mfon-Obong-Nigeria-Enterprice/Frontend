import { Bell, BellDot } from "lucide-react";
import Logo from "../Logo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useState } from "react";
import AdminUserModal from "@/features/dashboard/admin/AdminUserModal";
import { ManagerUsersModal } from "@/features/dashboard/manager/component/ManagerUsersModal";
import { Link } from "react-router-dom";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";

type HeaderProps = {
  userRole?: "admin" | "staff" | "maintainer" | "superadmin" | "manager";
};

const Header = ({ userRole }: HeaderProps) => {
  const { user } = useAuthStore();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const getAvatarImage = () => {
    return `/images/${userRole}-avatar.png`;
  };

  const getRoleBadgeColor = () => {
    switch (user?.role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "maintainer":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-green-100 text-green-800";
      case "super_admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          {user?.role !== "STAFF" && (
            <Link
              to={`${
                user?.role === "SUPER_ADMIN"
                  ? "/manager/dashboard/manager-notifications"
                  : `/${user?.role.toLowerCase()}/dashboard/${user?.role.toLowerCase()}-notifications`
              }`}
              className="relative"
            >
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                {unreadCount > 0 ? (
                  <BellDot className="h-5 w-5 text-gray-700" />
                ) : (
                  <Bell className="h-5 w-5 text-gray-500" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </Link>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <span className="capitalize font-medium text-gray-700">
              {/* {userName} */}
              {user?.name}
            </span>
            <span
              className={`capitalize text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}
            >
              {user?.role.toLowerCase()}
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
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <AvatarFallback>
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      {user?.role === "ADMIN" || user?.role === "STAFF" ? (
        <AdminUserModal
          open={isUserModalOpen}
          onOpenChange={setIsUserModalOpen}
          adminData={{
            _id: user?._id ?? "",
            email: user?.email ?? "",
            lastLogin: new Date().toISOString(),
            userRole: user?.role ?? "user",
            adminName: user?.name ?? "",
            profilePicture: getAvatarImage(),
          }}
        />
      ) : (
        <ManagerUsersModal
          open={isUserModalOpen}
          onOpenChange={setIsUserModalOpen}
          userData={{
            _id: (user?._id || user?.id) ?? "",
            email: user?.email ?? "",
            lastLogin: new Date().toISOString(),
            userRole: user?.role ?? "",
            fullName: user?.name ?? "",
            location: user?.branch ?? "",
            profilePicture: getAvatarImage(),
          }}
          onProfileUpdate={(updatedData) => {
            console.log("Profile updated:", updatedData);
          }}
        />
      )}
    </>
  );
};

export default Header;
