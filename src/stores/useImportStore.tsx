import { create } from "zustand";
import { type ProductImportRow } from "@/types/types";

export type ImportStep =
  | "upload"
  | "preview"
  | "error"
  | "configure"
  | "loading"
  | "complete";

export type ImportSummary = {
  updated: number;
  new: number;
  errors: number;
  processingTime: number;
};

export type ImportError = {
  row: number;
  message: string;
};

interface ImportStore {
  step: ImportStep;
  file: File | null;
  data: ProductImportRow[];
  error: string | null;
  complete: string | boolean;
  mapping: Record<string, string>;
  importOption: string;
  summary: ImportSummary;
  errorRows: ImportError[];

  setStep: (step: ImportStep) => void;
  setFile: (file: File) => void;
  setData: (data: ProductImportRow[]) => void;
  setComplete: (data: string | boolean) => void;
  setError: (msg: string | null) => void;
  setMapping: (mapping: Record<string, string>) => void;
  setImportOption: (option: string) => void;
  setSummary: (summary: ImportSummary) => void;
  setErrorRows: (errorRows: ImportError[]) => void;
  reset: () => void;
}

export const useImportStore = create<ImportStore>((set) => ({
  step: "upload",
  file: null,
  data: [],
  error: null,
  mapping: {},
  importOption: "",
  complete: false,
  summary: { updated: 0, new: 0, errors: 0, processingTime: 0 },
  errorRows: [],
  setStep: (step) => set({ step }),
  setFile: (file) => set({ file }),
  setData: (data) => set({ data }),
  setComplete: (complete) => set({ complete }),
  setError: (error) => set({ error }),
  setMapping: (mapping) => set({ mapping }),
  setImportOption: (option) => set({ importOption: option }),
  setSummary: (summary) => set({ summary }),
  setErrorRows: (errorRows) => set({ errorRows }),
  reset: () =>
    set({
      step: "upload",
      file: null,
      data: [],
      error: null,
      mapping: {},
      importOption: "",
      complete: false,
    }),
}));
