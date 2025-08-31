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
