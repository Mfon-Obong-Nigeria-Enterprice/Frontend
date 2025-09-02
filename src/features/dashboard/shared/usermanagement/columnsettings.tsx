import { useState } from "react";
import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft } from "lucide-react";

const INITIAL_COLUMNS = [
  "User ID",
  "User Details",
  "Roles",
  "Permission",
  "Status",
  "Location",
  "Created",
  "Last Login",
];

type ColumnType = typeof INITIAL_COLUMNS[number];
type Source = "visible" | "hidden";

export default function ColumnSettings() {
  const goBack = useGoBack();

  const [visibleCols, setVisibleCols] = useState<ColumnType[]>(INITIAL_COLUMNS);
  const [hiddenCols, setHiddenCols] = useState<ColumnType[]>([
    "Permission",
    "Last Login",
  ]);
  const [dragging, setDragging] = useState<{
    col: ColumnType;
    from: Source;
  } | null>(null);

  const handleDragStart = (col: ColumnType, from: Source) => {
    setDragging({ col, from });
  };

  const handleDrop = (to: Source) => {
    if (!dragging) return;
    const { col, from } = dragging;
    if (to === from) return;

    if (from === "visible" && to === "hidden") {
      setVisibleCols((prev) => prev.filter((c) => c !== col));
      setHiddenCols((prev) => [...prev, col]);
    }

    if (from === "hidden" && to === "visible") {
      setHiddenCols((prev) => prev.filter((c) => c !== col));
      setVisibleCols((prev) => [...prev, col]);
    }

    setDragging(null);
  };

  const handleCancel = (col: ColumnType) => {
    // move hidden col back to visible
    setHiddenCols((prev) => prev.filter((c) => c !== col));
    setVisibleCols((prev) => [...prev, col]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Columns Settings</h2>
        <Button variant="outline" size="sm" onClick={goBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to User List
        </Button>
      </div>

      {/* TIP BAR */}
      <Card className="p-4 bg-gray-50 text-sm text-gray-600">
        Tip: Drag and drop columns to reorder them. Uncheck columns to hide
        them, or drag them to the “Hidden Columns” area. Changes will be saved
        automatically. You can’t hide more than 3 columns.
      </Card>

      {/* MAIN PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: Visible Columns */}
        <Card
          className="p-5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop("visible")}
        >
          <h3 className="font-semibold mb-3">Choose Which Columns to show</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Drag to reorder • Uncheck to hide • Adjust width
          </p>

          <div className="divide-y">
            {visibleCols.map((col, i) => (
              <label
                key={col}
                draggable
                onDragStart={() => handleDragStart(col, "visible")}
                className="flex items-center gap-2 py-3 cursor-grab hover:bg-gray-50"
              >
                <Checkbox
                  id={`col-${i}`}
                  checked={!hiddenCols.includes(col)}
                  onCheckedChange={() => {}}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <span className="text-[15px]">{col}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* RIGHT: Hidden Columns + Available Columns */}
        <Card className="p-5">
          <h3 className="font-semibold">Hidden Columns</h3>
          <p className="text-sm text-gray-500 mt-1">
            Drag Columns here to hide them
          </p>

          {/* drop area */}
          <div
            className="mt-4 border-2 border-dashed border-gray-300 rounded-lg
              p-6 text-center text-gray-500 min-h-[100px]
              flex flex-col items-center justify-center gap-2"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("hidden")}
          >
            {hiddenCols.length === 0 ? (
              <div className="text-sm">Drop Columns here to hide them</div>
            ) : (
              hiddenCols.map((col) => (
                <span
                  key={col}
                  draggable
                  onDragStart={() => handleDragStart(col, "hidden")}
                  className="px-3 py-1 rounded-md bg-gray-100 text-sm cursor-grab flex items-center gap-2"
                >
                  {col}
                  <button
                    onClick={() => handleCancel(col)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Available Columns */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Available Columns</p>
            <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-2">
              {visibleCols.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-md bg-white border text-sm cursor-default"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
