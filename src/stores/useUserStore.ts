import { create } from "zustand";

import type { User } from "@/types/user";

type UserState = {
  users: User[];
  setUsers: (users: User[]) => void;
  getUserNameById: (id: string) => string | undefined;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  setUsers: (users) =>
    set({
      users,
    }),
  getUserNameById: (id) => get().users.find((u) => u._id === id)?.name,
}));
