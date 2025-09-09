// @/stores/useColumnSettingsStore.ts
// This store is now optional and serves as a fallback when API is unavailable
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_COLUMNS = [
  "User ID",
  "User Details",
  "Roles",
  "Permission",
  "Status",
  "Last Login",
  "Location",
  "Created",
] as const;

export type ColumnType = (typeof INITIAL_COLUMNS)[number];

interface ColumnSettingsState {
  visibleColumns: ColumnType[];
  hiddenColumns: ColumnType[];
  columnOrder: ColumnType[];

  // Actions
  setVisibleColumns: (columns: ColumnType[]) => void;
  setHiddenColumns: (columns: ColumnType[]) => void;
  setColumnOrder: (columns: ColumnType[]) => void;
  hideColumn: (column: ColumnType) => void;
  showColumn: (column: ColumnType) => void;
  reorderColumns: (columns: ColumnType[]) => void;
  resetToDefault: () => void;
  updateFromAPI: (settings: {
    visibleColumns: ColumnType[];
    hiddenColumns: ColumnType[];
    columnOrder: ColumnType[];
  }) => void;

  // Getters
  isColumnVisible: (column: ColumnType) => boolean;
  getVisibleColumnsInOrder: () => ColumnType[];
}

const DEFAULT_VISIBLE_COLUMNS = [...INITIAL_COLUMNS]; // All columns visible by default
const DEFAULT_HIDDEN_COLUMNS: ColumnType[] = []; // No columns hidden by default

export const useColumnSettingsStore = create<ColumnSettingsState>()(
  persist(
    (set, get) => ({
      visibleColumns: DEFAULT_VISIBLE_COLUMNS,
      hiddenColumns: DEFAULT_HIDDEN_COLUMNS,
      columnOrder: [...INITIAL_COLUMNS],

      setVisibleColumns: (columns) => set({ visibleColumns: columns }),

      setHiddenColumns: (columns) => set({ hiddenColumns: columns }),

      setColumnOrder: (columns) => set({ columnOrder: columns }),

      hideColumn: (column) => {
        const { visibleColumns, hiddenColumns } = get();

        // Check if hiding would exceed 3 column limit
        if (hiddenColumns.length >= 3) {
          throw new Error("Cannot hide more than 3 columns");
        }

        set({
          visibleColumns: visibleColumns.filter((col) => col !== column),
          hiddenColumns: [...hiddenColumns, column],
        });
      },

      showColumn: (column) => {
        const { visibleColumns, hiddenColumns } = get();

        set({
          hiddenColumns: hiddenColumns.filter((col) => col !== column),
          visibleColumns: [...visibleColumns, column],
        });
      },

      reorderColumns: (columns) => {
        set({
          visibleColumns: columns,
          columnOrder: columns,
        });
      },

      resetToDefault: () => {
        set({
          visibleColumns: DEFAULT_VISIBLE_COLUMNS,
          hiddenColumns: DEFAULT_HIDDEN_COLUMNS,
          columnOrder: [...INITIAL_COLUMNS],
        });
      },

      // New method to update from API response
      updateFromAPI: (settings) => {
        set({
          visibleColumns: settings.visibleColumns,
          hiddenColumns: settings.hiddenColumns,
          columnOrder: settings.columnOrder,
        });
      },

      isColumnVisible: (column) => {
        const { visibleColumns } = get();
        return visibleColumns.includes(column);
      },

      getVisibleColumnsInOrder: () => {
        const { visibleColumns, columnOrder } = get();
        // Return columns in the order they appear in columnOrder, but only if they're visible
        return columnOrder.filter((col) => visibleColumns.includes(col));
      },
    }),
    {
      name: "column-settings-fallback", // Changed name to indicate this is fallback
      partialize: (state) => ({
        visibleColumns: state.visibleColumns,
        hiddenColumns: state.hiddenColumns,
        columnOrder: state.columnOrder,
      }),
    }
  )
);

export { INITIAL_COLUMNS };
