// @/store/settingsStore.ts
import { create } from "zustand";
import { type Settings, type UpdateSettingsPayload } from "@/types/types"; // Corrected import path
import { updateSettingsSchema } from "@/schemas/SettingsSchemas"; // Import Zod schema
import type { UseMutationResult } from "@tanstack/react-query";

interface SettingsState {
  currentSettings: Settings; // The current form state for settings
  hasChanges: boolean; // To track if there are unsaved changes relative to the initialized state
  validationErrors: Partial<Record<keyof Settings, string>> | null; // For displaying validation errors
  _originalSettings: Settings | null; // Internal state to keep track of the original settings for `hasChanges` logic
  //
  setSetting: (key: keyof Settings, value: boolean) => void;
  initializeSettings: (initialData: Settings) => void; // To load data from API into store
  saveSettings: (
    mutation: UseMutationResult<Settings, Error, UpdateSettingsPayload>
  ) => Promise<void>;
  clearValidationErrors: () => void;
}

// Initial default settings (useful before API data loads)
const defaultSettings: Settings = {
  clientsDebtsAlert: false,
  largeBalanceAlert: false,
  lowStockAlert: false,
  inactivityAlerts: false,
  dashboardNotification: false,
  emailNotification: false,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  currentSettings: { ...defaultSettings },
  hasChanges: false,
  validationErrors: null,
  _originalSettings: null, // Initialize original settings as null

  initializeSettings: (initialData: Settings) => {
    set({
      currentSettings: { ...initialData },
      _originalSettings: { ...initialData }, // Store original for comparison
      hasChanges: false, // Reset hasChanges on re-initialization
      validationErrors: null, // Clear any previous validation errors
    });
  },

  setSetting: (key, value) => {
    set((state) => {
      const newSettings = {
        ...state.currentSettings,
        [key]: value,
      };

      // Compare with _originalSettings to determine if changes exist
      const hasChanges =
        JSON.stringify(newSettings) !== JSON.stringify(state._originalSettings);

      return {
        currentSettings: newSettings,
        hasChanges: hasChanges,
        validationErrors: null, // Clear errors on input change
      };
    });
  },

  saveSettings: async (mutation) => {
    const settingsToSave = get().currentSettings;

    // Zod validation
    const validationResult = updateSettingsSchema.safeParse(settingsToSave);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof Settings, string>> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as keyof Settings] = err.message;
        }
      });
      set({ validationErrors: fieldErrors });
      console.error("Validation failed:", fieldErrors);
      return; // Stop if validation fails
    }

    try {
      set({ validationErrors: null }); // Clear previous errors if validation passes
      await mutation.mutateAsync(validationResult.data); // Use mutateAsync for await

      // On successful mutation, TanStack Query will invalidate the 'settings' query.
      // The `useEffect` in SettingsPage will then re-initialize the store with the fresh data,
      // which will correctly reset `hasChanges` to false and `_originalSettings`.
      console.log("Settings saved successfully via API!");
    } catch (error) {
      console.error("Failed to save settings via API:", error);
      // Here you could set an error state in Zustand to display a global error message,
      // or rely on TanStack Query's error handling to show a toast.
    }
  },

  clearValidationErrors: () => {
    set({ validationErrors: null });
  },
}));
