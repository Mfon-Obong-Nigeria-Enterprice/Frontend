import { create } from "zustand";

type StatusAction = "suspend" | "enable";

interface ModalState {
  deleteModal: { id: string; name: string } | null;
  statusModal: { id: string; name: string; action: StatusAction } | null;
  openDelete: (id: string, name: string) => void;
  openStatus: (id: string, name: string, action: StatusAction) => void;
  closeModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  deleteModal: null,
  statusModal: null,
  openDelete: (id, name) => set({ deleteModal: { id, name } }),
  openStatus: (id, name, action) => set({ statusModal: { id, name, action } }),
  closeModals: () => set({ deleteModal: null, statusModal: null }),
}));
