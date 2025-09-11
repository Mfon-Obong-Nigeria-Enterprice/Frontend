import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import Logo from "@/components/Logo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AdminUserModal from "@/features/dashboard/admin/AdminUserModal";
import { ManagerUsersModal } from "@/features/dashboard/manager/component/ManagerUsersModal";
import { useFilteredNotifications } from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import NotificationModal from "@/features/dashboard/shared/NotificationModal";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
// import type { Role } from "@/types/types";

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

// Generate consistent color based on user ID or name
const generateUserColor = (identifier: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-sky-500",
  ];

  // Simple hash function to get consistent color for same identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
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

      // Return first valid source, otherwise return empty string to use initials
      for (const source of sources) {
        if (source && source.trim() !== "") {
          return source;
        }
      }

      // Return empty string to trigger fallback to initials
      return "";
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
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(false);

  // Get filtered notifications and unread count
  const filteredNotifications = useFilteredNotifications();
  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  // Enhanced profile picture management
  const profileImageUrl = useProfilePicture(userRole);

  // Role-based capabilities
  const capabilities = getRoleBasedCapabilities(user?.role || "");

  // Get the current display name with proper priority
  const getDisplayName = () => {
    return userProfile?.name || user?.name || "User";
  };

  // Get user initials for fallback
  const getUserInitials = (): string => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get consistent background color for user
  const getUserBackgroundColor = (): string => {
    const identifier = user?.id || user?.email || getDisplayName();
    return generateUserColor(identifier);
  };

  // Handle closing the notification drawer
  const handleCloseNotificationDrawer = () => {
    setIsNotificationDrawerOpen(false);
  };

  const handleProfileUpdate = async (updatedData: UpdatedUserData) => {
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

      // Apply updates to both user and userProfile
      updateUser(updates);

      // Persist profile picture if updated
      if (updatedData.profilePicture && user?.id) {
        localStorage.setItem(
          `user-profile-picture-${user.id}`,
          updatedData.profilePicture
        );
      }
    }
  };

  // Enhanced error handling for profile images - fallback to initials
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.warn("Failed to load profile image:", profileImageUrl);
    const img = e.target as HTMLImageElement;
    // Hide the image to show initials fallback
    img.style.display = "none";
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
            <Drawer
              direction="right"
              open={isNotificationDrawerOpen}
              onOpenChange={setIsNotificationDrawerOpen}
            >
              <DrawerTrigger asChild>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={`Notifications. ${unreadCount} unread notifications`}
                >
                  {unreadCount > 0 ? (
                    <BellDot
                      className="h-5 w-5 text-gray-700"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bell
                      className="h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  )}
                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      aria-label={`${unreadCount} unread notifications`}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </DrawerTrigger>

              <DrawerContent
                className="h-[100vh] "
                aria-label="Notifications panel"
              >
                <DrawerHeader className="pb-2">
                  <DrawerTitle className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-sm font-normal text-gray-500">
                        {unreadCount} unread
                      </span>
                    )}
                  </DrawerTitle>
                </DrawerHeader>

                <div className="flex-1 overflow-hidden">
                  {user?.role && (
                    <NotificationModal
                      onClose={handleCloseNotificationDrawer}
                    />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          )}

          {/* User info display */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="capitalize font-medium text-gray-700">
              {getDisplayName()}
            </span>
          </div>

          {/* User avatar button */}
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
            aria-label={`User settings for ${getDisplayName()}`}
          >
            <Avatar key={`${profileImageUrl}-${Date.now()}`}>
              {profileImageUrl && (
                <AvatarImage
                  src={profileImageUrl}
                  alt={`${getDisplayName()} profile picture`}
                  onError={handleImageError}
                  className="object-cover"
                />
              )}
              <AvatarFallback
                className={`${getUserBackgroundColor()} text-white font-medium`}
                aria-label={`${getDisplayName()} initials`}
              >
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
            adminName: getDisplayName(),
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
            name: getDisplayName(),
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
