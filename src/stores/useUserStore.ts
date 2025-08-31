import { create } from "zustand";
import type { Role } from "@/types/types";

export interface CompanyUser {
  _id: string;
  name: string;
  address: string;
  branch: string;
  branchId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  email: string;
  isActive: boolean;
  isBlocked: boolean;

  phone: string;
  profilePicture: string;
  profilePictureMeta: {
    public_id: string;
  };
  role: Role;
  updatedAt: string;
}

type UserState = {
  users: CompanyUser[];
  setUsers: (users: CompanyUser[]) => void;
  removeUser: (id: string) => void;
  suspendUser: (id: string) => void;
  enableUser: (id: string) => void;
  getUserNameById: (id: string) => string | undefined;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  setUsers: (users) =>
    set({
      users,
    }),
  removeUser: (id: string) =>
    set((state) => ({
      users: state.users.filter((u) => u._id !== id),
    })),
  suspendUser: (id: string) =>
    set((state) => ({
      users: state.users.map((u) =>
        u._id === id ? { ...u, isActive: true, isBlocked: true } : u
      ),
    })),
  enableUser: (id: string) =>
    set((state) => ({
      users: state.users.map((u) =>
        u._id === id ? { ...u, isActive: true, isBlocked: false } : u
      ),
    })),
  getUserNameById: (id) => get().users.find((u) => u._id === id)?.name,
}));
