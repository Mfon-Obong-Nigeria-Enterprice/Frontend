/** @format */

import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/components/ui/button";
import { useImportStore } from "@/stores/useImportStore";
import { X, TriangleAlert } from "lucide-react";

const importErrorData = [
  { title: "Invalid price format for “Steel Wire”", quantity: 15 },
  { title: "Missing product name", quantity: 23 },
  { title: "Duplicate product “Cement Block”", quantity: 67 },
  { title: "Category “Tool” doesn’t exist", quantity: 89 },
  { title: "Negative stock quantity not allowed", quantity: 134 },
  { title: "Negative stock quantity not allowed", quantity: 134 },
  { title: "Negative stock quantity not allowed", quantity: 134 },
  { title: "Negative stock quantity not allowed", quantity: 134 },
];

const ImportError = () => {
  const goBack = useGoBack();
  const { setStep, reset, data, errorRows } = useImportStore();

  const total = data.length;
  const errors = errorRows.length;
  const success = total - errors;
  const warnings = errorRows.filter((e) =>
    e.message.toLowerCase().includes("duplicate")
  ).length;
  const successRate = Math.round((success / total) * 100);

  const importedData = [
    { title: "Product Updated", quantity: success },
    { title: "Errors", quantity: errors },
    { title: "Warnings", quantity: warnings },
    { title: "Success rate", quantity: successRate },
  ];

  return (
    <div>
      <div className="flex justify-between px-5 pb-3 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]">
          Import Complete with issues
        </h4>
        <Button
          variant="ghost"
          className="h-7 w-7 inline-flex justify-center items-center border border-full rounded-full"
          onClick={() => {
            goBack();
            reset();
          }}
        >
          <X size={14} />
        </Button>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center my-5">
        <TriangleAlert stroke="#FFA500" size={60} />
        <p className="text-[#ffa500] font-medium">
          Import Complete with Warning
        </p>
        <p className="text-(--cl-secondary) text-xs">
          Some items couldn’t be processed
        </p>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-8 mt-5">
          {importedData.map((data, i) => (
            <div
              key={i}
              className="bg-[#F5F5F5] flex flex-col justify-center items-center p-4 rounded-md"
            >
              <p className="text-[#333333] font-semibold text-lg">
                {data.title === "Success rate"
                  ? `${data.quantity}%`
                  : `${data.quantity}`}
              </p>
              <p className="text-[#7D7D7D] text-sm">{data.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* error list */}
      <ul className="bg-[#FFE4E2] max-w-[630px] border border-[#F95353] overflow-auto max-h-30 h-full mx-auto px-3.5 py-3 rounded-md">
        {errorRows.map((err, i) => (
          <li
            key={i}
            className="text-[#F95353] text-xs border-b border-[#FFCACA] py-1 "
          >
            Row {err.row}: {err.message}
          </li>
        ))}
      </ul>

      {/* buttons */}
      <div className="flex justify-end items-center gap-4 mt-5 px-10">
        <Button
          variant="outline"
          onClick={() => setStep("loading")}
          className="w-40"
        >
          Fix Anyway
        </Button>
        <Button onClick={() => setStep("configure")}>Continue Anyway</Button>
      </div>
    </div>
  );
};

export default ImportError;
