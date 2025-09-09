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
];

type ColumnType = (typeof INITIAL_COLUMNS)[number];

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

  // Getters
  isColumnVisible: (column: ColumnType) => boolean;
  getVisibleColumnsInOrder: () => ColumnType[];
}

const DEFAULT_VISIBLE_COLUMNS = INITIAL_COLUMNS; // All columns visible by default

const DEFAULT_HIDDEN_COLUMNS: ColumnType[] = []; // No columns hidden by default

export const useColumnSettingsStore = create<ColumnSettingsState>()(
  persist(
    (set, get) => ({
      visibleColumns: DEFAULT_VISIBLE_COLUMNS,
      hiddenColumns: DEFAULT_HIDDEN_COLUMNS,
      columnOrder: INITIAL_COLUMNS,
      // Getters to avoid unnecessary re-renders
      getVisibleColumns: () => get().visibleColumns,
      getHiddenColumns: () => get().hiddenColumns,
      getColumnOrder: () => get().columnOrder,

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
          columnOrder: INITIAL_COLUMNS,
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
      name: "column-settings-storage", // unique name for localStorage key
      // Only persist the essential state
      partialize: (state) => ({
        visibleColumns: state.visibleColumns,
        hiddenColumns: state.hiddenColumns,
        columnOrder: state.columnOrder,
      }),
    }
  )
);
