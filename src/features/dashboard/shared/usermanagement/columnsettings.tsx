// Debug version of ColumnSettings component with better error handling

import { useMemo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, MoreVertical } from "lucide-react";
import {
  useActivityLogsStore,
  type ActivityLogs,
} from "@/stores/useActivityLogsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
// Use React Query hook instead of Zustand store
import {
  useColumnSettingsManager,
  // debugColumnSettings,
} from "@/hooks/useColumnSettings";
import { type ColumnType, INITIAL_COLUMNS } from "@/services/columnSettingsAPI";
import {
  filterUsers,
  formatRelativeDate,
  getInitials,
} from "@/utils/userfilters";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Source = "visible" | "hidden";

// Debug component to show current state

// Memoized table cell renderer for preview
type PreviewTableCellProps = {
  user: any;
  column: ColumnType;
};

const PreviewTableCell = ({ user, column }: PreviewTableCellProps) => {
  const cellContent = useMemo(() => {
    switch (column) {
      case "User ID":
        return user.userId;
      case "User Details":
        return (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`flex justify-center items-center w-full h-full text-white ${
                    user.role === "STAFF"
                      ? "bg-[#2ECC71]"
                      : user.role === "ADMIN"
                      ? "bg-[#392423]"
                      : "bg-[#F39C12]"
                  }`}
                >
                  <span>{getInitials(user.name)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
        );
      case "Roles":
        return (
          <span
            className={`min-w-16 mx-auto text-center py-2 px-2.5 rounded ${
              user.role === "STAFF"
                ? "bg-[#2ECC7133] text-[#05431F]"
                : user.role === "ADMIN"
                ? "bg-[#FFF2CE] text-[#F39C12]"
                : "bg-[#E2F3EB] text-[#1A3C7E]"
            }`}
          >
            {user.role === "MAINTAINER" ? "MAINT" : user.role}
          </span>
        );
      case "Permission":
        return (
          <span className="font-normal text-xs">
            {user.role === "STAFF"
              ? "Record Sales"
              : user.role === "ADMIN"
              ? "Inventory, client"
              : "System maintainer"}
          </span>
        );
      case "Status":
        return (
          <span
            className={`text-xs ${
              user.isBlocked
                ? "text-[#F95353]"
                : user.isActive
                ? "text-[#1AD410]"
                : "text-[#F39C12]"
            }`}
          >
            {user.isBlocked
              ? "Suspended"
              : user.isActive
              ? "Active"
              : "Inactive"}
          </span>
        );
      case "Last Login":
        return (
          <span className="text-sm">{formatRelativeDate(user.lastLogin)}</span>
        );
      case "Location":
        return <span className="text-sm">{user.branch || "N/A"}</span>;
      case "Created":
        return (
          <span className="text-sm">
            {new Date(user.createdAt).toDateString()}
          </span>
        );
      default:
        return "";
    }
  }, [user, column]);

  return <TableCell className="px-4 py-3">{cellContent}</TableCell>;
};

// Memoized draggable column item
const DraggableColumnItem = ({
  col,
  source,
  onDragStart,
  onCheckboxChange,
  onRemove,
}: {
  col: ColumnType;
  source: Source;
  onDragStart: (col: ColumnType, source: Source) => void;
  onCheckboxChange: (col: ColumnType, checked: boolean) => void;
  onRemove: (col: ColumnType) => void;
}) => {
  const handleDragStart = useCallback(() => {
    onDragStart(col, source);
  }, [col, source, onDragStart]);

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      onCheckboxChange(col, checked);
    },
    [col, onCheckboxChange]
  );

  const handleRemove = useCallback(() => {
    onRemove(col);
  }, [col, onRemove]);

  if (source === "visible") {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-grab border border-transparent hover:border-gray-200 transition-colors"
      >
        <Checkbox
          checked={true}
          onCheckedChange={handleCheckboxChange}
          className="border border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        />
        <span className="text-sm font-light text-[#444444]">{col}</span>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-md cursor-grab border border-red-200 hover:bg-red-200 transition-colors"
    >
      <span className="text-sm">{col}</span>
      <button
        onClick={handleRemove}
        className="text-red-600 hover:text-red-800"
      >
        ×
      </button>
    </div>
  );
};

export default function ColumnSettings() {
  const users = useUserStore((s) => s.users);
  const currentUser = useAuthStore((s) => s.user);
  const activityLogs = useActivityLogsStore((s) => s.activities);
  const navigate = useNavigate();

  // Use React Query hook for column settings
  const {
    settings,
    visibleColumns,
    hiddenColumns,
    saveSettings,
    resetToDefault,
    isLoading,
    isSaving,
    isResetting,
  } = useColumnSettingsManager();

  const [openDiscardModal, setOpenDiscardModal] = useState(false);
  const [dragging, setDragging] = useState<{
    col: ColumnType;
    from: Source;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize local state properly with ALL columns
  const [localVisibleColumns, setLocalVisibleColumns] = useState<ColumnType[]>(
    () => {
      if (visibleColumns && visibleColumns.length > 0) {
        return [...visibleColumns];
      }
      return [...INITIAL_COLUMNS]; // Default to all columns visible
    }
  );

  const [localHiddenColumns, setLocalHiddenColumns] = useState<ColumnType[]>(
    () => {
      if (hiddenColumns) {
        return [...hiddenColumns];
      }
      return []; // Default to no hidden columns
    }
  );

  const [localColumnOrder, setLocalColumnOrder] = useState<ColumnType[]>(() => {
    if (settings.columnOrder && settings.columnOrder.length > 0) {
      return [...settings.columnOrder];
    }
    return [...INITIAL_COLUMNS]; // Default order
  });

  // Update local state when server state changes
  useEffect(() => {
    if (visibleColumns && visibleColumns.length > 0) {
      setLocalVisibleColumns([...visibleColumns]);
    } else {
      // Ensure all columns are accounted for if visibleColumns is empty
      setLocalVisibleColumns([...INITIAL_COLUMNS]);
    }

    if (hiddenColumns) {
      setLocalHiddenColumns([...hiddenColumns]);
    } else {
      setLocalHiddenColumns([]);
    }

    if (settings.columnOrder && settings.columnOrder.length > 0) {
      setLocalColumnOrder([...settings.columnOrder]);
    } else {
      setLocalColumnOrder([...INITIAL_COLUMNS]);
    }

    setHasUnsavedChanges(false);
  }, [visibleColumns, hiddenColumns, settings]);

  // Debug effect

  // Filter users according to current user's role - memoized
  const filteredUsers = useMemo(
    () => filterUsers(users, currentUser?.role || ""),
    [users, currentUser?.role]
  );

  // Create lookup maps for activities - optimized
  const { activityByIdMap, activityByEmailMap } = useMemo(() => {
    const byIdMap: Record<string, ActivityLogs[]> = {};
    const byEmailMap: Record<string, ActivityLogs[]> = {};

    activityLogs.forEach((log) => {
      if (!byIdMap[log.performedBy]) byIdMap[log.performedBy] = [];
      byIdMap[log.performedBy].push(log);

      if (log.performedBy.includes("@")) {
        if (!byEmailMap[log.performedBy]) byEmailMap[log.performedBy] = [];
        byEmailMap[log.performedBy].push(log);
      }
    });

    return { activityByIdMap: byIdMap, activityByEmailMap: byEmailMap };
  }, [activityLogs]);

  // Merge filtered users with their activities - optimized
  const usersWithActivities = useMemo(() => {
    return filteredUsers.map((user, index) => {
      const logsByUserId = activityByIdMap[user._id] || [];
      const logsByEmail = activityByEmailMap[user.email] || [];

      // Use Map for deduplication (more efficient)
      const allLogsMap = new Map();
      [...logsByUserId, ...logsByEmail].forEach((log) => {
        allLogsMap.set(log._id, log);
      });
      const uniqueLogs = Array.from(allLogsMap.values());

      const loginLogs = uniqueLogs
        .filter((log) => log.action === "LOGIN")
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

      const lastLogin =
        loginLogs.length > 0 ? new Date(loginLogs[0].timestamp) : null;

      const sortedActivities = uniqueLogs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        ...user,
        userId: `U-${(index + 1).toString().padStart(3, "0")}`,
        activities: sortedActivities,
        lastActivity: sortedActivities[0] || null,
        lastLogin,
        activityCount: uniqueLogs.length,
      };
    });
  }, [filteredUsers, activityByIdMap, activityByEmailMap]);

  // Event handlers with useCallback for performance
  const handleDragStart = useCallback((col: ColumnType, from: Source) => {
    setDragging({ col, from });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (to: Source) => {
      if (!dragging) return;
      const { col, from } = dragging;
      if (to === from) return;

      if (from === "visible" && to === "hidden") {
        if (localHiddenColumns.length >= 3) {
          toast.warn("You can't hide more than 3 columns");
          setDragging(null);
          return;
        }

        setLocalVisibleColumns((prev) => prev.filter((c) => c !== col));
        setLocalHiddenColumns((prev) => [...prev, col]);
        setHasUnsavedChanges(true);
      }

      if (from === "hidden" && to === "visible") {
        setLocalHiddenColumns((prev) => prev.filter((c) => c !== col));
        setLocalVisibleColumns((prev) => [...prev, col]);
        setHasUnsavedChanges(true);
      }

      setDragging(null);
    },
    [dragging, localHiddenColumns.length]
  );

  const handleCheckboxChange = useCallback(
    (col: ColumnType, checked: boolean) => {
      if (!checked) {
        if (localHiddenColumns.length >= 3) {
          toast.warn("You can't hide more than 3 columns");
          return;
        }

        setLocalVisibleColumns((prev) => prev.filter((c) => c !== col));
        setLocalHiddenColumns((prev) => [...prev, col]);
        setHasUnsavedChanges(true);
      } else {
        setLocalHiddenColumns((prev) => prev.filter((c) => c !== col));
        setLocalVisibleColumns((prev) => [...prev, col]);
        setHasUnsavedChanges(true);
      }
    },
    [localHiddenColumns.length]
  );

  const handleRemoveFromHidden = useCallback((col: ColumnType) => {
    setLocalHiddenColumns((prev) => prev.filter((c) => c !== col));
    setLocalVisibleColumns((prev) => [...prev, col]);
    setHasUnsavedChanges(true);
  }, []);

  const handleResetToDefault = useCallback(() => {
    resetToDefault();
    setHasUnsavedChanges(false);
  }, [resetToDefault]);

  const handleSaveChanges = useCallback(() => {
    const newSettings = {
      visibleColumns: localVisibleColumns,
      hiddenColumns: localHiddenColumns,
      columnOrder: localColumnOrder,
    };

    console.log("Attempting to save:", newSettings);
    // debugColumnSettings(newSettings, "Attempting to Save");

    // Make sure all columns are accounted for
    const allLocalColumns = [...localVisibleColumns, ...localHiddenColumns];
    const missingColumns = INITIAL_COLUMNS.filter(
      (col) => !allLocalColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      console.error("Missing columns detected:", missingColumns);
      // Add missing columns to visible columns
      const fixedSettings = {
        visibleColumns: [...localVisibleColumns, ...missingColumns],
        hiddenColumns: localHiddenColumns,
        columnOrder: localColumnOrder,
      };

      console.log("Fixed settings:", fixedSettings);
      setLocalVisibleColumns(fixedSettings.visibleColumns);
      saveSettings(fixedSettings);
    } else {
      saveSettings(newSettings);
    }

    setHasUnsavedChanges(false);
  }, [saveSettings, localVisibleColumns, localHiddenColumns, localColumnOrder]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      setOpenDiscardModal(true);
    } else {
      navigate(-1);
    }
  }, [hasUnsavedChanges, navigate]);

  const confirmDiscard = useCallback(() => {
    // Reset local state to server state
    setLocalVisibleColumns(visibleColumns);
    setLocalHiddenColumns(hiddenColumns);
    setLocalColumnOrder(settings.columnOrder);
    setHasUnsavedChanges(false);
    navigate(-1);
  }, [visibleColumns, hiddenColumns, settings.columnOrder, navigate]);

  const closeModal = useCallback(() => {
    setOpenDiscardModal(false);
  }, []);

  // Get ordered visible columns - use local state for preview
  const orderedVisibleColumns = useMemo(
    () => localColumnOrder.filter((col) => localVisibleColumns.includes(col)),
    [localColumnOrder, localVisibleColumns]
  );

  // Preview data - only show first 4 users for performance
  const previewData = useMemo(
    () => usersWithActivities.slice(0, 4),
    [usersWithActivities]
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-2 md:p-6 space-y-3 bg-gray-50">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">
            Loading column settings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-3 bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-semibold">Columns Settings</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to User List
          </Button>
        </div>
      </div>

      {/* TIP BAR */}
      <Card className="p-4 bg-[#FFFFFF] border-[#D9D9D9]">
        <p className="text-[16px] font-medium text-[#7D7D7D]">
          <strong>Tip:</strong> Drag and drop columns to reorder them. Uncheck
          columns to hide them, or drag them to the "Hidden Columns" area.
          Changes will be saved automatically. You can't hide more than 3
          columns.
        </p>
      </Card>

      {/* UNSAVED CHANGES WARNING */}
      {hasUnsavedChanges && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Warning:</strong> You have unsaved changes. Click "Save
            Changes" to apply them.
          </p>
        </Card>
      )}

      {/* MAIN PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Visible Columns */}
        <Card className="py-5">
          <div className="flex flex-col gap-2 border-b-2 border-gray-200 px-4">
            <h3 className="font-semibold text-[#333333] text-[18px]">
              Choose Which Columns to show
            </h3>
            <p className="text-sm text-gray-500 pb-2">
              Drag to reorder • Uncheck to hide • Adjust width
            </p>
          </div>

          <div
            className="space-y-1 px-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("visible")}
          >
            {localVisibleColumns.map((col) => (
              <DraggableColumnItem
                key={col}
                col={col}
                source="visible"
                onDragStart={handleDragStart}
                onCheckboxChange={handleCheckboxChange}
                onRemove={handleRemoveFromHidden}
              />
            ))}
          </div>
        </Card>

        {/* RIGHT: Hidden Columns */}
        <Card className="py-4">
          <div className="flex flex-col gap-2 border-b-2 border-gray-200 px-4">
            <h3 className="font-semibold text-[#333333] text-[18px]">
              Hidden Columns
            </h3>
            <p className="text-sm text-gray-500 pb-2">
              Drag Columns here to hide them
            </p>
          </div>

          {/* Drop area for hidden columns */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 mb-6 min-h-[200px] transition-colors mx-4 ${
              dragging && dragging.from === "visible"
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("hidden")}
          >
            {localHiddenColumns.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Drop Columns here to hide them
                <br />
                or uncheck them from visible columns
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {localHiddenColumns.map((col) => (
                  <DraggableColumnItem
                    key={col}
                    col={col}
                    source="hidden"
                    onDragStart={handleDragStart}
                    onCheckboxChange={handleCheckboxChange}
                    onRemove={handleRemoveFromHidden}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Available Columns */}
          <div className="px-4">
            <p className="text-sm font-medium mb-3">Available Columns</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {INITIAL_COLUMNS.map((col) => (
                <span
                  key={col}
                  className={`px-3 py-1 rounded-md text-sm border cursor-default ${
                    localVisibleColumns.includes(col)
                      ? "bg-white border-[#D9D9D9] text-[#7D7D7D] text-sm font-light"
                      : "bg-green-100 border-green-300 text-green-800 text-sm font-light"
                  }`}
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* TABLE PREVIEW */}
      <Card className="p-5">
        <h3 className="font-semibold mb-2">Table Preview</h3>
        <p className="text-sm text-gray-500 mb-4">
          Preview how your table will look with current settings (showing first
          4 users)
        </p>

        <div className="mt-5">
          <Table className="w-full">
            <TableHeader className="bg-gray-100">
              <TableRow>
                {orderedVisibleColumns.map((col) => (
                  <TableHead
                    key={col}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase"
                  >
                    {col}
                  </TableHead>
                ))}
                <TableHead className="px-4 py-3 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((user) => (
                <TableRow key={user._id} className="border-t hover:bg-gray-50">
                  {orderedVisibleColumns.map((col) => (
                    <PreviewTableCell
                      key={`${user._id}-${col}`}
                      user={user}
                      column={col}
                    />
                  ))}
                  <TableCell className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-gray-200">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleResetToDefault}
          disabled={isResetting}
        >
          {isResetting ? "Resetting..." : "Reset to Default"}
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleSaveChanges}
          disabled={isSaving || !hasUnsavedChanges}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Modal for discard confirmation */}
      <Dialog open={openDiscardModal} onOpenChange={setOpenDiscardModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDiscard}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
