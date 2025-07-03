import { create } from "zustand";

export type ImportStep =
  | "upload"
  | "preview"
  | "error"
  | "configure"
  | "loading"
  | "complete";

interface ImportStore {
  step: ImportStep;
  file: File | null;
  data: any[];
  error: string | null;
  complete: string | boolean;

  setStep: (step: ImportStep) => void;
  setFile: (file: File) => void;
  setData: (data: any[]) => void;
  setComplete: (data: string | boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useImportStore = create<ImportStore>((set) => ({
  step: "upload",
  file: null,
  data: [],
  error: null,
  complete: false,
  setStep: (step) => set({ step }),
  setFile: (file) => set({ file }),
  setData: (data) => set({ data }),
  setComplete: (complete) => set({ complete }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      step: "upload",
      file: null,
      data: [],
      error: null,
    }),
}));
