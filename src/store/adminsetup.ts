import { create } from "zustand";
import { type AdminSetupData } from "@/types/types";

type AdminSetupStore = {
  data: Partial<AdminSetupData>;
  setField: (field: keyof AdminSetupData, value: any) => void;
  setFormSubmit: (submitFn: (() => Promise<void>) | null) => void;
  formSubmit?: (() => Promise<void>) | null; // Fixed: Added null to union type
  reset: () => void;
};

export const useAdminSetupStore = create<AdminSetupStore>((set) => ({
  data: {},
  formSubmit: null,
  setField: (field, value) =>
    set((state) => ({ data: { ...state.data, [field]: value } })),
  setFormSubmit: (submitFn) => set({ formSubmit: submitFn }),
  reset: () => set({ data: {}, formSubmit: null }),
}));

// import { create } from "zustand";
// import { type AdminSetupData } from "@/types/types";

// type AdminSetupStore = {
//   data: Partial<AdminSetupData>;
//   setField: (field: keyof AdminSetupData, value: any) => void;
//   setFormSubmit: (submitFn: (() => Promise<void>) | null) => void;
//   formSubmit?: () => Promise<void> | null;
//   reset: () => void;
// };

// export const useAdminSetupStore = create<AdminSetupStore>((set) => ({
//   data: {},
//   formSubmit: null,
//   setField: (field, value) =>
//     set((state) => ({ data: { ...state.data, [field]: value } })),
//   setFormSubmit: (submitFn) => set({ formSubmit: submitFn }),
//   reset: () => set({ data: {}, formSubmit: null }),
// }));
