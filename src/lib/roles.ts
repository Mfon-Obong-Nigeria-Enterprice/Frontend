import { useAuthStore } from "@/stores/useAuthStore";

export function useHasRole(roles: string[]) {
  const role = useAuthStore((s) => s.user?.role);
  return roles.includes(role || "");
}
