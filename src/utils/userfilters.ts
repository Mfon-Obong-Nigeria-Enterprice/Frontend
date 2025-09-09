import type { CompanyUser } from "@/stores/useUserStore";

// this function is to allow the super admin see activity of all users including the maintainer, while the maintainer can see all else except himself
export function filterUsers(users: CompanyUser[], currentRole: string) {
  return users.filter((user) => {
    if (currentRole === "SUPER_ADMIN") {
      return user.role !== "SUPER_ADMIN";
    }
    return user.role !== "MAINTAINER" && user.role !== "SUPER_ADMIN";
  });
}

export const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
    0
  )}`.toUpperCase();
};

export const formatRelativeDate = (date: Date | null) => {
  if (!date) return "No login yet";

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};
