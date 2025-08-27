import { useState } from "react";
// import { Link } from "react-router-dom";
import { Bell, BellDot } from "lucide-react";
import Logo from "../Logo";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useState } from "react";
import AdminUserModal from "@/features/dashboard/admin/AdminUserModal";
import { ManagerUsersModal } from "@/features/dashboard/manager/component/ManagerUsersModal";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import NotificationModal from "@/features/dashboard/shared/NotificationModal";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  // DrawerFooter,
  // DrawerClose,
} from "@/components/ui/drawer";
import type { Role } from "@/types/types";

type HeaderProps = {
  userRole?: "admin" | "staff" | "maintainer" | "superadmin" | "manager";
};

// Handler for profile updates
type UpdatedUserData = {
  fullName?: string;
  adminName?: string;
  name?: string;
  profilePicture?: string;
  location?: string;
  [key: string]: unknown;
};

const Header = ({ userRole }: HeaderProps) => {
  const { user, updateUser, refreshUserData, isInitialized } = useAuthStore();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Refresh user data on component mount (after auth is initialized)
  useEffect(() => {
    const refreshData = async () => {
      if (isInitialized && user && !hasRefreshed && (user._id || user.id)) {
        try {
          await refreshUserData();
          setHasRefreshed(true);
        } catch (error) {
          console.error("Failed to refresh user data on mount:", error);
          setHasRefreshed(true); // Mark as attempted even if failed
        }
      }
    };

    refreshData();
  }, [isInitialized, user?._id, user?.id, hasRefreshed, refreshUserData]);

  const getAvatarImage = () => {
    if (user?.profilePicture) {
      return user?.profilePicture;
    }
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

  const handleProfileUpdate = async (updatedData: UpdatedUserData) => {
    console.log("Profile updated:", updatedData);

    // Update the user store with new data immediately for optimistic updates
    if (updateUser) {
      const updates = {
        name:
          updatedData.fullName ||
          updatedData.adminName ||
          updatedData.name ||
          user?.name,
        profilePicture: updatedData.profilePicture || user?.profilePicture,
        branch: updatedData.location || user?.branch,
        ...updatedData,
      };

      updateUser(updates);
    }

    // Also refresh from server to ensure consistency
    try {
      await refreshUserData();
    } catch (error) {
      console.error("Failed to refresh user data after profile update:", error);
    }
  };

  return (
    <>
      <header className="h-14 sm:h-16 fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-7 py-3 bg-white shadow-sm">
        <div>
          <div className="hidden md:flex md:ml-10">
            <Logo />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {user?.role !== "STAFF" && (
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Notifications</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  {user?.role && (
                    <NotificationModal role={user.role.toLowerCase() as Role} />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <span className="capitalize font-medium text-gray-700">
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
                  console.error(
                    "failed to load avatar image:",
                    getAvatarImage()
                  );
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <AvatarFallback>
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
        {/* <div className="flex gap-4 items-center">
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
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </div> */}
      </header>

      {user?.role === "ADMIN" || user?.role === "STAFF" ? (
        <AdminUserModal
          open={isUserModalOpen}
          onOpenChange={setIsUserModalOpen}
          adminData={{
            _id: user?.id ?? "",
            email: user?.email ?? "",
            lastLogin: new Date().toISOString(),
            userRole: user?.role ?? "user",
            adminName: user?.name ?? "",
            profilePicture: getAvatarImage(),
          }}
          // onProfileUpdate={handleProfileUpdate}
        />
      ) : (
        <ManagerUsersModal
          open={isUserModalOpen}
          onOpenChange={setIsUserModalOpen}
          userData={{
            _id: user?.id ?? "",
            email: user?.email ?? "",
            lastLogin: new Date().toISOString(),
            userRole: user?.role ?? "",
            name: user?.name ?? "",
            location: user?.branch ?? "",
            profilePicture: getAvatarImage(),
          }}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default Header;
