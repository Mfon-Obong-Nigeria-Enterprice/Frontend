// @/services/columnSettingsAPI.ts
import { isAxiosError } from "axios";
import api from "./baseApi";

// Frontend display column names (what your UI components use)
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

// Mapping between frontend display names and backend column names
const COLUMN_MAPPING = {
  // Frontend -> Backend
  "User ID": "id", // This is generated in frontend, not from API
  "User Details": "name", // Maps to name + email in frontend
  Roles: "role",
  Permission: "permissions", // Note: backend uses plural "permissions"
  Status: "status",
  "Last Login": "lastLogin",
  Location: "location",
  Created: "createdAt",
} as const;

// Reverse mapping for backend to frontend
const REVERSE_COLUMN_MAPPING = Object.entries(COLUMN_MAPPING).reduce(
  (acc, [frontend, backend]) => {
    acc[backend] = frontend as ColumnType;
    return acc;
  },
  {} as Record<string, ColumnType>
);

export interface ColumnSettingsResponse {
  visibleColumns: ColumnType[];
  hiddenColumns: ColumnType[];
  columnOrder: ColumnType[];
  lastUpdated?: string;
}

export interface AvailableColumnsResponse {
  tableName: string;
  availableColumns: string[]; // Backend column names
}

/**
 * Convert backend column names to frontend display names
 */
const mapBackendToFrontend = (backendColumns: string[]): ColumnType[] => {
  const frontendColumns: ColumnType[] = [];

  backendColumns.forEach((backendCol) => {
    const frontendCol = REVERSE_COLUMN_MAPPING[backendCol];
    if (frontendCol) {
      frontendColumns.push(frontendCol);
    }
  });

  // Always include User ID as it's generated in frontend
  if (!frontendColumns.includes("User ID")) {
    frontendColumns.unshift("User ID");
  }

  return frontendColumns;
};

/**
 * Convert frontend column names to backend column names for API calls
 */
const mapFrontendToBackend = (frontendColumns: ColumnType[]): string[] => {
  return frontendColumns
    .filter((col) => col !== "User ID") // Filter out User ID as it's not stored in backend
    .map((col) => COLUMN_MAPPING[col])
    .filter(Boolean); // Remove any undefined mappings
};

/**
 * Get all available columns that can be configured
 */
export const getAvailableColumns = async (): Promise<ColumnType[]> => {
  try {
    const response = await api.get<AvailableColumnsResponse>(
      "/column-settings/users/available-columns"
    );

    if (response.data?.availableColumns) {
      return mapBackendToFrontend(response.data.availableColumns);
    }

    return [...INITIAL_COLUMNS];
  } catch (error) {
    console.warn("Failed to fetch available columns, using defaults:", error);
    return [...INITIAL_COLUMNS];
  }
};

/**
 * Get current user's column settings
 */
export const getCurrentSettings = async (): Promise<ColumnSettingsResponse> => {
  try {
    const response = await api.get<{
      visibleColumns?: string[];
      hiddenColumns?: string[];
      columnOrder?: string[];
      lastUpdated?: string;
    }>("/column-settings/users");

    // Map backend column names to frontend display names
    const visibleColumns = response.data.visibleColumns
      ? mapBackendToFrontend(response.data.visibleColumns)
      : [...INITIAL_COLUMNS];

    const hiddenColumns = response.data.hiddenColumns
      ? mapBackendToFrontend(response.data.hiddenColumns)
      : [];

    const columnOrder = response.data.columnOrder
      ? mapBackendToFrontend(response.data.columnOrder)
      : [...INITIAL_COLUMNS];

    return {
      visibleColumns,
      hiddenColumns,
      columnOrder,
      lastUpdated: response.data.lastUpdated,
    };
  } catch (error) {
    // If 404, user has no settings yet - return defaults
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        visibleColumns: [...INITIAL_COLUMNS],
        hiddenColumns: [],
        columnOrder: [...INITIAL_COLUMNS],
      };
    }
    throw error;
  }
};

/**
 * Save/Update user's column settings
 */
export const saveSettings = async (settings: {
  visibleColumns: ColumnType[];
  hiddenColumns: ColumnType[];
  columnOrder: ColumnType[];
}): Promise<ColumnSettingsResponse> => {
  // Validate frontend settings first
  const validation = validateSettings(settings);
  if (!validation.isValid) {
    throw new Error(`Invalid settings: ${validation.errors.join(", ")}`);
  }

  // Convert frontend column names to backend names for API
  const backendSettings = {
    visibleColumns: mapFrontendToBackend(settings.visibleColumns),
    hiddenColumns: mapFrontendToBackend(settings.hiddenColumns),
    columnOrder: mapFrontendToBackend(settings.columnOrder),
  };

  console.log("Sending to API:", backendSettings);

  const response = await api.put("/column-settings/users", backendSettings);

  return {
    ...settings, // Return the original frontend settings
    lastUpdated: new Date().toISOString(),
    ...response.data,
  };
};

/**
 * Delete user's column settings (reset to default)
 */
export const deleteSettings = async (): Promise<void> => {
  await api.delete("/column-settings/users");
};

/**
 * Validate column settings using frontend column names
 */
export const validateSettings = (settings: {
  visibleColumns: ColumnType[];
  hiddenColumns: ColumnType[];
  columnOrder: ColumnType[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  console.log("Validating settings:", settings);

  if (settings.hiddenColumns.length > 3) {
    errors.push("Cannot hide more than 3 columns");
  }

  // Check for missing columns
  const allColumns = [...settings.visibleColumns, ...settings.hiddenColumns];
  const missingColumns = INITIAL_COLUMNS.filter(
    (col) => !allColumns.includes(col)
  );

  if (missingColumns.length > 0) {
    console.warn("Missing columns detected:", missingColumns);
    errors.push(`Missing columns: ${missingColumns.join(", ")}`);
  }

  // Check for columns that are both visible and hidden
  const overlap = settings.visibleColumns.filter((col) =>
    settings.hiddenColumns.includes(col)
  );

  if (overlap.length > 0) {
    errors.push(
      `Columns cannot be both visible and hidden: ${overlap.join(", ")}`
    );
  }

  // Check for invalid columns
  const invalidVisible = settings.visibleColumns.filter(
    (col) => !INITIAL_COLUMNS.includes(col)
  );
  const invalidHidden = settings.hiddenColumns.filter(
    (col) => !INITIAL_COLUMNS.includes(col)
  );

  if (invalidVisible.length > 0) {
    errors.push(`Invalid visible columns: ${invalidVisible.join(", ")}`);
  }

  if (invalidHidden.length > 0) {
    errors.push(`Invalid hidden columns: ${invalidHidden.join(", ")}`);
  }

  console.log("Validation result:", { isValid: errors.length === 0, errors });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Export the column mapping for debugging purposes
export const getColumnMapping = () => ({
  frontendToBackend: COLUMN_MAPPING,
  backendToFrontend: REVERSE_COLUMN_MAPPING,
});

export { INITIAL_COLUMNS };
