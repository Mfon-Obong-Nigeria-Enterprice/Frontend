/* eslint-disable @typescript-eslint/no-explicit-any */
// Debug version of ColumnSettings component with better error handling

import { useMemo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, MoreVertical, X, Menu } from "lucide-react";
import {
  useActivityLogsStore,
  type ActivityLogs,
} from "@/stores/useActivityLogsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import {
  useColumnSettingsManager,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Source = "visible" | "hidden";

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
        className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-grab border border-transparent hover:border-gray-100 transition-colors"
      >
        <Checkbox
          checked={true}
          onCheckedChange={handleCheckboxChange}
          className="h-5 w-5 rounded-md border-[#D9D9D9] data-[state=checked]:!bg-[#2ECC71] data-[state=checked]:!border-[#2ECC71] data-[state=checked]:text-white"
        />
        <span className="text-sm font-normal text-[#333333]">{col}</span>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#333333] rounded-md cursor-grab border border-[#E0E0E0] hover:border-[#D9D9D9] transition-colors shadow-sm"
    >
      <span className="text-sm font-normal">{col}</span>
      <button
        onClick={handleRemove}
        className="text-[#7D7D7D] hover:text-[#333333] flex items-center justify-center"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default function ColumnSettings() {
  const users = useUserStore((s) => s.users);
  const currentUser = useAuthStore((s) => s.user);
  const activityLogs = useActivityLogsStore((s) => s.activities);
  const navigate = useNavigate();

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

  const [localVisibleColumns, setLocalVisibleColumns] = useState<ColumnType[]>(
    () => {
      if (visibleColumns && visibleColumns.length > 0) {
        return [...visibleColumns];
      }
      return [...INITIAL_COLUMNS];
    }
  );

  const [localHiddenColumns, setLocalHiddenColumns] = useState<ColumnType[]>(
    () => {
      if (hiddenColumns) {
        return [...hiddenColumns];
      }
      return [];
    }
  );

  const [localColumnOrder, setLocalColumnOrder] = useState<ColumnType[]>(() => {
    if (settings.columnOrder && settings.columnOrder.length > 0) {
      return [...settings.columnOrder];
    }
    return [...INITIAL_COLUMNS];
  });

  useEffect(() => {
    if (visibleColumns && visibleColumns.length > 0) {
      setLocalVisibleColumns([...visibleColumns]);
    } else {
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

  const filteredUsers = useMemo(
    () => filterUsers(users, currentUser?.role || ""),
    [users, currentUser?.role]
  );

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

  const usersWithActivities = useMemo(() => {
    return filteredUsers.map((user, index) => {
      const logsByUserId = activityByIdMap[user._id] || [];
      const logsByEmail = activityByEmailMap[user.email] || [];

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

    const allLocalColumns = [...localVisibleColumns, ...localHiddenColumns];
    const missingColumns = INITIAL_COLUMNS.filter(
      (col) => !allLocalColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      console.error("Missing columns detected:", missingColumns);
      const fixedSettings = {
        visibleColumns: [...localVisibleColumns, ...missingColumns],
        hiddenColumns: localHiddenColumns,
        columnOrder: localColumnOrder,
      };
      setLocalVisibleColumns(fixedSettings.visibleColumns);
      saveSettings(fixedSettings);
    } else {
      saveSettings(newSettings);
    }

    setHasUnsavedChanges(false);
  }, [
    saveSettings,
    localVisibleColumns,
    localHiddenColumns,
    localColumnOrder,
  ]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      setOpenDiscardModal(true);
    } else {
      navigate(-1);
    }
  }, [hasUnsavedChanges, navigate]);

  const confirmDiscard = useCallback(() => {
    setLocalVisibleColumns(visibleColumns);
    setLocalHiddenColumns(hiddenColumns);
    setLocalColumnOrder(settings.columnOrder);
    setHasUnsavedChanges(false);
    navigate(-1);
  }, [visibleColumns, hiddenColumns, settings.columnOrder, navigate]);

  const closeModal = useCallback(() => {
    setOpenDiscardModal(false);
  }, []);

  const orderedVisibleColumns = useMemo(
    () =>
      localColumnOrder.filter((col) => localVisibleColumns.includes(col)),
    [localColumnOrder, localVisibleColumns]
  );

  const previewData = useMemo(
    () => usersWithActivities.slice(0, 4),
    [usersWithActivities]
  );

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-4 bg-gray-50 min-h-screen w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">
            Loading column settings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:scale-90 lg:-translate-x-20 p-2 md:p-6 space-y-3 bg-gray-50">
      {/* HEADER: Updated Layout for Mobile/Desktop Match */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-4">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <h2 className="text-2xl md:text-2xl font-bold text-[#1E1E1E]">Column Settings</h2>
          
          {/* Mobile Action Menu */}
          <div className="md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-[#333333]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2 bg-white">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleResetToDefault}
                    disabled={isResetting}
                    className="justify-start w-full text-[#333333]"
                  >
                    {isResetting ? "Resetting..." : "Reset to Default"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleCancel} 
                    className="justify-start w-full text-[#333333]"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#2ECC71] hover:bg-[#27ae60] text-white w-full"
                    onClick={handleSaveChanges}
                    disabled={isSaving || !hasUnsavedChanges}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="lg:flex gap-2 w-full md:w-auto">
          {/* Back Button: Full width on mobile (w-full), Auto on desktop (md:w-auto) */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer bg-white  lg:w-auto justify-start lg:justify-center pl-4 border-[#D9D9D9] text-[#333333] h-10 font-medium"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to User List
          </Button>
        </div>
      </div>

      {/* TIP BAR */}
      <Card className="p-4 bg-white border-[#D9D9D9] shadow-sm">
        <p className="text-base font-normal text-[#7D7D7D]">
          <strong className="text-[#333333]">Tip:</strong> Drag and drop columns to reorder them. Uncheck
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 w-full max-w-full">
        {/* LEFT: Visible Columns */}
        <Card className="py-5 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-[#E0E0E0] px-5 pb-3">
            <h3 className="font-semibold text-[#1E1E1E] text-lg">
              Choose Which Columns to show
            </h3>
            <p className="text-sm text-[#7D7D7D]">
              Drag to reorder • Uncheck to hide • Adjust width
            </p>
          </div>

          <div
            className="space-y-1 px-5 pt-4"
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
        <Card className="p-5 w-full bg-white shadow-sm flex flex-col">
          <div className="flex flex-col gap-1 border-b border-[#E0E0E0] pb-3 mb-4">
            <h3 className="font-semibold text-[#1E1E1E] text-lg">
              Hidden Columns
            </h3>
            <p className="text-sm text-[#7D7D7D]">
              Drag Columns here to hide them
            </p>
          </div>

          {/* Drop area for hidden columns */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 mb-6 flex-1 min-h-[160px] flex items-center justify-center transition-colors ${
              dragging && dragging.from === "visible"
                ? "border-blue-300 bg-blue-50"
                : "border-[#E0E0E0] bg-[#FAFAFA]"
            }`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop("hidden")}
          >
            {localHiddenColumns.length === 0 ? (
              <div className="text-center">
                <p className="text-[#333333] font-medium mb-1">Drop Columns here to hide them</p>
                <p className="text-xs text-[#7D7D7D]">or click to add from available columns</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 w-full justify-center">
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
          <div>
            <p className="text-sm font-medium text-[#333333] mb-3">Available Columns</p>
            <div className="flex flex-wrap gap-2">
              {INITIAL_COLUMNS.map((col) => (
                <span
                  key={col}
                  className={`px-3 py-1.5 rounded-md text-sm border cursor-default transition-colors ${
                    localVisibleColumns.includes(col)
                      ? "bg-white border-[#E0E0E0] text-[#7D7D7D]"
                      : "bg-white border-[#2ECC71] text-[#2ECC71]"
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
      <Card className="p-5 bg-white shadow-sm">
        <h3 className="font-semibold text-[#1E1E1E] mb-1">Table Preview</h3>
        <p className="text-sm text-[#7D7D7D] mb-4">
          Preview how your table will look with current settings (showing first 4 users)
        </p>

        <div className="w-full overflow-hidden border border-[#E0E0E0] rounded-lg">
          <div className="overflow-x-auto w-full">
            <Table className="w-full">
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow>
                  {orderedVisibleColumns.map((col) => (
                    <TableHead
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#4B5563] uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </TableHead>
                  ))}
                  <TableHead className="px-4 py-3 w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((user) => (
                  <TableRow key={user._id} className="border-t border-[#E5E7EB] hover:bg-gray-50">
                    {orderedVisibleColumns.map((col) => (
                      <PreviewTableCell
                        key={`${user._id}-${col}`}
                        user={user}
                        column={col}
                      />
                    ))}
                    <TableCell className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="hidden md:flex flex-col sm:flex-row justify-end gap-3 w-full mt-4">
        <Button
          variant="outline"
          onClick={handleResetToDefault}
          disabled={isResetting}
          className="bg-white border-[#D9D9D9] text-[#333333]"
        >
          {isResetting ? "Resetting..." : "Reset to Default"}
        </Button>
        <Button variant="outline" onClick={handleCancel} className="bg-white border-[#D9D9D9] text-[#333333]">
          Cancel
        </Button>
        <Button
          className="bg-[#2ECC71] hover:bg-[#27ae60] text-white"
          onClick={handleSaveChanges}
          disabled={isSaving || !hasUnsavedChanges}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

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
              className="bg-red-600 hover:bg-red-700 text-white"
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