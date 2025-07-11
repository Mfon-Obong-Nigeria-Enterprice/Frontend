/** @format */

import React from "react";
import { useGoBack } from "@/hooks/useGoBack";
import { X, File, Dot } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useImportStore } from "@/stores/useImportStore";

const ImportView: React.FC = () => {
  const { data, setStep, file, reset } = useImportStore();
  const goBack = useGoBack();

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        No data to preview. Please go back and upload a file.
        <div className="mt-4">
          <Button onClick={() => setStep("upload")}>Back to upload</Button>
        </div>
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const fileName = file?.name ?? "Unnamed file";
  // const fileExtension = file?.type ?? "Unknown";
  const fileSize = file
    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : "Unknown";
  const totalRows = data.length;
  const previewRows = data.slice(0, 5); // Show only the first 5 rows for preview

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
        {/* uploaded file */}
        <div className="flex gap-4 items-center bg-[#C8F9DD] text-[#444444] p-3 border border-[#2ECC71] rounded">
          <div className="bg-[#2ECC71] w-fit px-1 py-2 rounded">
            <File className="text-white" size={16} />
          </div>
          <div>
            <h6 className="text-base leading-none font-medium text-[#333333]">
              {fileName}
            </h6>
            <p className="flex items-center text-[0.625rem] text-[#7D7D7D]">
              <span>{fileSize}</span>
              <Dot />
              <span>{totalRows} row</span>
              <Dot />
              <span>Uploaded successful</span>
            </p>
          </div>
        </div>

        <div className="border border-[#D9D9D9] rounded-md overflow-hidden">
          <h6 className="bg-[#F5F5F5] border-b-2 border-[#D9D9D9] text-sm font-medium px-4 py-2.5">
            Data Preview (First 5 row)
          </h6>
          <table className="w-full">
            <thead>
              <tr className="border w-full px-3">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-center text-[#333333] font-medium"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-600">
              {previewRows.map((row, i) => (
                <tr key={i} className="border px-3">
                  {headers.map((key) => (
                    <td
                      key={key}
                      className="text-center text-sm text-[#444444] py-2"
                    >
                      {row[key as keyof typeof row]}
                      {/* {`${
                        row[key as keyof typeof row] === "stock"
                          ? "₦ {row.toLocaleString()}"
                          : "row"
                      }`} */}
                    </td>
                  ))}
                  {/* ₦ {file.unitPrice.toLocaleString()} */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end items-center gap-4 mt-5">
          <Button
            variant="outline"
            onClick={() => setStep("upload")}
            className="w-40"
          >
            Back
          </Button>
          <Button className="w-40" onClick={() => setStep("configure")}>
            Next: Configure Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportView;
