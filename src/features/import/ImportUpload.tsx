/** @format */

import React, { useRef, useState } from "react";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/useGoBack";
import { X, FolderOpen } from "lucide-react";
import { useImportStore } from "@/stores/useImportStore";
import { type ProductImportRow } from "@/types/types";

const requirements: string[] = [
  "Maximum file size 10MB",
  "Requirement columns: Product Name, Category, Stock Quantity, Price per unit",
  "First row should contain headers",
];

const ImportUpload: React.FC = () => {
  const goBack = useGoBack();
  const { setStep, setData, setFile, setError, reset } = useImportStore();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds the maximum allowed size of 10MB");
      return;
    }

    const fileName = file.name.toLowerCase();

    try {
      let parsedData: ProductImportRow[] = [];

      // check if it's a CSV file
      if (fileName.endsWith(".csv")) {
        // parse CSV file with PapaParse
        const text = await file.text();
        const { data, errors } = Papa.parse<ProductImportRow>(text, {
          header: true,
          skipEmptyLines: true, // skip empty lines
        });

        if (errors.length > 0) {
          console.error("CSV parse errors:", errors);
          setError("CSV file has formatting issues.");
          setStep("error");
          return;
        }

        parsedData = data;
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        // parse excel file with ExcelJS
        const buffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0]; // read first sheet
        const rows: ProductImportRow[] = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          // skip header row
          if (rowNumber === 1) return;

          const rowData: Partial<ProductImportRow> = {};
          row.eachCell((cell, colNumber) => {
            const header = worksheet.getRow(1).getCell(colNumber).text.trim();
            rowData[header as keyof ProductImportRow] = cell.text.trim();
          });

          rows.push(rowData as ProductImportRow);
        });
        parsedData = rows;
      } else {
        // for unsupported format
        setError("Unsupported file type. Please upload a .csv or .xlsx file");
        return;
      }

      // on success, update global state
      setData(parsedData); // set parsed rows to state
      setFile(file); // store file info for display
      setError(null);
      setStep("preview"); // move to preview screen
    } catch (err) {
      setError("Could not parse file. Please check formatting.");
      setStep("error");
      console.error("File parse error:", err);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleBrowse = () => inputRef.current?.click();

  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]"> Import stock</h4>
        <button
          className="h-7 w-7 inline-flex justify-center items-center border border-full rounded-full"
          onClick={() => {
            goBack();
            reset();
          }}
        >
          <X size={14} />
        </button>
      </div>
      <div className="px-5 pt-8 space-y-6">
        {/* file upload */}
        <div
          className={cn(
            "bg-[#F5F5F5] hover:bg-gray-200 flex flex-col justify-center items-center min-h-70 gap-1.5 border-2 border-dashed rounded-md cursor-pointer transition-colors duration-300 ease-in-out",
            isDragging ? "border-blue-500" : "border-[#7D7D7D]"
          )}
          onClick={handleBrowse}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            ref={inputRef}
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <FolderOpen size={60} className="text-[#7D7D7D]" />
          <p className="font-medium text-[#444444] text-center mt-6">
            Drop your file here or click to browse
          </p>
          <p className="mt-2 text-[#7D7D7D] text-sm">
            Support CSV, Excel (.xlsx, .xls)
          </p>
        </div>
        {/* file requirements */}
        <div className="bg-[#FFE7A4] text-[#444444] p-2 border border-[#FFA500] rounded">
          <h6 className="text-base font-medium">File requirements</h6>
          <ul className="list-disc list-inside pl-1">
            {requirements.map((req, i) => (
              <li key={i} className="text-xs leading-snug">
                {req}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end items-center gap-4 mt-5">
          <Button variant="outline" onClick={() => goBack()}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // handleUpload(file);
              setStep("preview");
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportUpload;
