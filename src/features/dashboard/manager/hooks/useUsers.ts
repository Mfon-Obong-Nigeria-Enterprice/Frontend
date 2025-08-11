import { useQuery } from "@tanstack/react-query";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  location?: string;
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
  permissions?: string[];
  passwordChanged?: boolean;
  isActive?: boolean;
  userId?: string;
}

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const token = localStorage.getItem("token") || "";
      const response = await fetch("https://mfon-obong-enterprise.onrender.com/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error ${response.status}: ${error}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : data.users || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserStatus = () => {
  return {
    suspendUser: async (userId: string) => {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `https://mfon-obong-enterprise.onrender.com/api/users/${userId}/suspend`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to suspend user");
      return response.json();
    },
    enableUser: async (userId: string) => {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `https://mfon-obong-enterprise.onrender.com/api/users/${userId}/enable`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to enable user");
      return response.json();
    },
  };
};
