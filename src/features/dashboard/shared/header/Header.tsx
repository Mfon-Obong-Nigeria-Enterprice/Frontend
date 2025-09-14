import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import Logo from "@/components/Logo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/drawer";
import { getFirstAndLastName } from "@/utils/getfirstandlastname";

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

// Enhanced profile picture management
const useProfilePicture = (userRole?: string) => {
  const { userProfile, user } = useAuthStore();
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  useEffect(() => {
    const getProfileImageUrl = (): string => {
      // Priority order for profile picture sources
      const sources = [
        userProfile?.profilePicture,

        // Fallback to localStorage for persistence
        localStorage.getItem(`user-profile-picture-${user?.id}`),
      ];

      // Return first valid source
      for (const source of sources) {
        if (source && source.trim() !== "") {
          return source;
        }
      }

      // Final fallback to default avatar
      return `/images/${userRole}-avatar.png`;
    };

    setProfileImageUrl(getProfileImageUrl());
  }, [userProfile?.profilePicture, user?.id, userRole]);

  return profileImageUrl;
};

// Role-based access control helper
const getRoleBasedCapabilities = (role: string) => {
  const normalizedRole = role.toUpperCase();

  return {
    canAccessNotifications: !["STAFF"].includes(normalizedRole),
    canAccessUserProfiles: ["ADMIN", "SUPER_ADMIN", "MAINTAINER"].includes(
      normalizedRole
    ),
    modalType: ["ADMIN", "STAFF"].includes(normalizedRole)
      ? "admin"
      : "manager",
  };
};

const Header = ({ userRole }: HeaderProps) => {
  const { userProfile, user, updateUser } = useAuthStore();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Enhanced profile picture management
  const profileImageUrl = useProfilePicture(userRole);

  // Role-based capabilities
  const capabilities = getRoleBasedCapabilities(user?.role || "");

  const handleProfileUpdate = async (updatedData: UpdatedUserData) => {
    console.log("=== Header Profile Update ===");
    console.log("Updated data received:", updatedData);

    try {
      // Update the user store with new data immediately for optimistic updates
      if (updateUser) {
        const updates = {
          name:
            updatedData.fullName ||
            updatedData.adminName ||
            updatedData.name ||
            userProfile?.name ||
            user?.name,
          profilePicture:
            updatedData.profilePicture || userProfile?.profilePicture,
          branch: updatedData.location || userProfile?.branch || user?.branch,
          ...updatedData,
        };

        // Apply updates
        updateUser(updates);

        // Persist profile picture if updated
        if (updatedData.profilePicture && user?.id) {
          localStorage.setItem(
            `user-profile-picture-${user.id}`,
            updatedData.profilePicture
          );
        }

        // console.log("Profile updates applied:", updates);
      }
    } catch (error) {
      console.error("Error updating profile in header:", error);
    }
  };

  // Enhanced error handling for profile images
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.warn("Failed to load profile image:", profileImageUrl);
    const img = e.target as HTMLImageElement;

    // Try fallback image
    if (img.src !== `/images/${userRole}-avatar.png`) {
      img.src = `/images/${userRole}-avatar.png`;
    } else {
      // Hide broken image
      img.style.display = "none";
    }
  };

  // Get user initials for fallback
  const getUserInitials = (): string => {
    const name = user?.name || userProfile?.name || "User";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="h-14 sm:h-16 fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-7 py-3 bg-white border border-[#F5F5F5]">
        <div>
          <div className="hidden md:flex md:ml-10">
            <Logo />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {/* Notifications - Role-based access */}
          {capabilities.canAccessNotifications && (
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                  onClick={(e) => {
                    // Ensure the trigger does not retain focus when drawer opens
                    // to avoid focused descendants inside aria-hidden ancestors.
                    (e.currentTarget as HTMLButtonElement).blur();
                  }}
                >
                  {unreadCount > 0 ? (
                    <BellDot className="h-5 w-5 text-gray-700" />
                  ) : (
                    <Bell className="h-5 w-5 text-gray-500" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-4 rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader className="flex items-center justify-between pr-2">
                  <DrawerTitle>Notifications</DrawerTitle>
                  {unreadCount > 0 && (
                    <span className="text-xs text-gray-500">
                      {unreadCount} unread
                    </span>
                  )}
                </DrawerHeader>
                <div className="px-4 pb-4">
                  {user?.role && <NotificationModal />}
                </div>
              </DrawerContent>
            </Drawer>
          )}

          {/* User info display */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="capitalize font-medium text-gray-700">
              {(user && getFirstAndLastName(user.name)) || "User"}
            </span>
            {/* <span
              className={`capitalize text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}
            >
              {(user?.role || "user").toLowerCase()}
            </span> */}
          </div>

          {/* User avatar button */}
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
            aria-label="User settings"
          >
            <Avatar key={`${profileImageUrl}-${Date.now()}`}>
              <AvatarImage
                src={profileImageUrl}
                alt={`${user?.name || userRole} avatar`}
                onError={handleImageError}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      {/* Role-based modal rendering */}
      {capabilities.modalType === "admin" ? (
        <AdminUserModal
          open={isUserModalOpen}
          onOpenChange={setIsUserModalOpen}
          adminData={{
            _id: user?.id ?? "",
            email: user?.email ?? "",
            lastLogin: new Date().toISOString(),
            userRole: user?.role ?? "user",
            adminName: user?.name ?? "",
            profilePicture: profileImageUrl,
          }}
          onProfileUpdate={handleProfileUpdate}
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
            profilePicture: profileImageUrl,
          }}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default Header;
