// @/hooks/useColumnSettings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  type ColumnSettingsResponse,
  type ColumnType,
  deleteSettings,
  getAvailableColumns,
  getCurrentSettings,
  INITIAL_COLUMNS,
  saveSettings,
  validateSettings,
} from "@/services/columnSettingsAPI";
import { isAxiosError } from "axios";

// Query Keys
export const columnSettingsKeys = {
  all: ["columnSettings"] as const,
  settings: () => [...columnSettingsKeys.all, "settings"] as const,
  availableColumns: () =>
    [...columnSettingsKeys.all, "availableColumns"] as const,
};

// Hook to get current user's column settings

export const useColumnSettings = () => {
  return useQuery({
    queryKey: columnSettingsKeys.settings(),
    queryFn: getCurrentSettings,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (isAxiosError(error)) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
};

// Hook to get available columns

export const useAvailableColumns = () => {
  return useQuery({
    queryKey: columnSettingsKeys.availableColumns(),
    queryFn: getAvailableColumns,
    staleTime: 60 * 60 * 1000, // Consider data fresh for 1 hour (rarely changes)
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
    initialData: [...INITIAL_COLUMNS], // Use default columns as fallback
  });
};

// Hook to save column settings with optimistic updates

export const useSaveColumnSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSettings,
    onMutate: async (newSettings) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: columnSettingsKeys.settings(),
      });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<ColumnSettingsResponse>(
        columnSettingsKeys.settings()
      );

      // Optimistically update to the new value
      queryClient.setQueryData<ColumnSettingsResponse>(
        columnSettingsKeys.settings(),
        {
          ...newSettings,
          lastUpdated: new Date().toISOString(),
        }
      );

      // Return a context object with the snapshotted value
      return { previousSettings };
    },
    onError: (err, _newSettings, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSettings) {
        queryClient.setQueryData(
          columnSettingsKeys.settings(),
          context.previousSettings
        );
      }

      console.error("Failed to save column settings:", err);
      toast.error("Failed to save column settings - please try again");
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: columnSettingsKeys.settings(),
      });
      toast.success("Column settings saved and synced across all devices!");
    },
  });
};

//Hook to delete/reset column settings

export const useDeleteColumnSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSettings,
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: columnSettingsKeys.settings(),
      });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<ColumnSettingsResponse>(
        columnSettingsKeys.settings()
      );

      // Optimistically update to default values
      queryClient.setQueryData<ColumnSettingsResponse>(
        columnSettingsKeys.settings(),
        {
          visibleColumns: [...INITIAL_COLUMNS],
          hiddenColumns: [],
          columnOrder: [...INITIAL_COLUMNS],
          lastUpdated: new Date().toISOString(),
        }
      );

      return { previousSettings };
    },
    onError: (err, _variables, context) => {
      // Roll back on error
      if (context?.previousSettings) {
        queryClient.setQueryData(
          columnSettingsKeys.settings(),
          context.previousSettings
        );
      }

      console.error("Failed to reset column settings:", err);
      toast.error("Failed to reset column settings - please try again");
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: columnSettingsKeys.settings(),
      });
      toast.success("Column settings reset to default and synced!");
    },
  });
};

// Combined hook with all column settings operations and derived state

export const useColumnSettingsManager = () => {
  const settingsQuery = useColumnSettings();
  const saveSettingsMutation = useSaveColumnSettings();
  const deleteSettingsMutation = useDeleteColumnSettings();

  // Derived state
  const settings = settingsQuery.data ?? {
    visibleColumns: [...INITIAL_COLUMNS],
    hiddenColumns: [],
    columnOrder: [...INITIAL_COLUMNS],
  };

  const isLoading =
    settingsQuery.isLoading ||
    saveSettingsMutation.isPending ||
    deleteSettingsMutation.isPending;

  const error =
    settingsQuery.error ||
    saveSettingsMutation.error ||
    deleteSettingsMutation.error;

  // Helper functions
  const getVisibleColumnsInOrder = (): ColumnType[] => {
    return settings.columnOrder.filter((col) =>
      settings.visibleColumns.includes(col)
    );
  };

  const isColumnVisible = (column: ColumnType): boolean => {
    return settings.visibleColumns.includes(column);
  };

  const canHideColumn = (): boolean => {
    return settings.hiddenColumns.length < 3;
  };

  // Actions
  const saveSettings = (newSettings: {
    visibleColumns: ColumnType[];
    hiddenColumns: ColumnType[];
    columnOrder: ColumnType[];
  }) => {
    const validation = validateSettings(newSettings);

    if (!validation.isValid) {
      toast.error(`Invalid settings: ${validation.errors.join(", ")}`);
      return;
    }

    saveSettingsMutation.mutate(newSettings);
  };

  const resetToDefault = () => {
    deleteSettingsMutation.mutate();
  };

  return {
    // Data
    settings,
    visibleColumns: settings.visibleColumns,
    hiddenColumns: settings.hiddenColumns,
    columnOrder: settings.columnOrder,
    lastUpdated: settings.lastUpdated,

    // State
    isLoading,
    isError: settingsQuery.isError,
    error,
    isStale: settingsQuery.isStale,

    // Derived state
    getVisibleColumnsInOrder,
    isColumnVisible,
    canHideColumn,

    // Actions
    saveSettings,
    resetToDefault,
    refetch: settingsQuery.refetch,

    // Mutation states for granular control
    isSaving: saveSettingsMutation.isPending,
    isResetting: deleteSettingsMutation.isPending,
  };
};
