/** @format */

import React from "react";
import { useGoBack } from "@/hooks/useGoBack";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useImportStore } from "@/stores/useImportStore";

const ImportConfigure: React.FC = () => {
  const {
    data,
    setStep,
    mapping,
    importOption,
    setMapping,
    setImportOption,
    reset,
  } = useImportStore();
  const goBack = useGoBack();

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        No data available. Go back and upload a file.
        <div className="mt-4">
          <Button onClick={() => setStep("upload")}>Back to Upload</Button>
        </div>
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  const handleMappingChange = (field: string, column: string) => {
    setMapping({ ...mapping, [field]: column });
  };

  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]">Configure stock</h4>
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
      <div className="px-10 py-4">
        <p className="text-[#333333] font-medium mb-2">Map Your Columns</p>

        {/* <div className="grid grid-cols-1 gap-4 items-center"> */}
        <div>
          {/* Mapping row */}
          {[
            { label: "Product name", field: "product" },
            { label: " Stock quantity", field: "stock" },
            { label: "Category", field: "category" },
            { label: "Unit price", field: "unitPrice" },
          ].map(({ label, field }) => (
            <div
              key={field}
              className="bg-[#F5F5F5] grid grid-cols-[20fr_80fr] gap-2 items-center px-5 py-3 rounded"
            >
              <h6 className="text-[15px] text-[#333333] font-normal">
                {label}:
              </h6>
              <select
                className="bg-[#d9d9d9] text-[#444444] text-xs border border-[#7D7D7D] px-1.5 py-2 rounded"
                value={mapping[field] || ""}
                onChange={(e) => handleMappingChange(field, e.target.value)}
              >
                <option value="">Select column</option>
                {headers.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* <select
              name=""
              id=""
              className="bg-[#d9d9d9] text-[#444444] text-xs border border-[#7D7D7D] px-1.5 py-2 rounded"
            >
              <option value="">Product name</option>
            </select> */}
          {/* </div> */}

          {/* 02 */}
          {/* <div className="bg-[#F5F5F5] grid grid-cols-[15fr_80fr] gap-2 items-center px-5 py-3 rounded">
            <h6 className="text-[15px] text-[#333333] font-normal">
              Stock quantity:
            </h6>
            <select
              name=""
              id=""
              className="bg-[#d9d9d9] text-[#444444] text-xs border border-[#7D7D7D] px-1.5 py-2 rounded"
            >
              <option value="">stock</option>
            </select>
          </div> */}
          {/* 03 */}
          {/* <div className="bg-[#F5F5F5] grid grid-cols-[15fr_80fr] gap-2 items-center px-5 py-3 rounded">
            <h6 className="text-[15px] text-[#333333] font-normal">
              Category:
            </h6>
            <select
              name=""
              id=""
              className="bg-[#d9d9d9] text-[#444444] text-xs border border-[#7D7D7D] px-1.5 py-2 rounded"
            >
              <option value="">Category</option>
            </select>
          </div> */}

          {/* 04 */}
          {/* <div className="bg-[#F5F5F5] grid grid-cols-[15fr_80fr] gap-2 items-center px-5 py-3 rounded">
            <h6 className="text-[15px] text-[#333333] font-normal">
              Unit price:
            </h6>
            <select
              name=""
              id=""
              className="bg-[#d9d9d9] text-[#444444] text-xs border border-[#7D7D7D] px-1.5 py-2 rounded"
            >
              <option value="">price</option>
            </select>
          </div> */}
        </div>
      </div>
      <div className="border-y border-[#d9d9d9] py-4 px-10">
        <p className="text-[#333333] leading-relaxed font-medium">
          Import Options
        </p>
        <div className="ml-2">
          <label className="flex items-center gap-1.5 text-[#444444] text-sm">
            <input
              type="radio"
              name="import-options"
              value="update"
              checked={importOption === "update"}
              onChange={(e) => setImportOption(e.target.value)}
              className="w-3 bg-transparent"
            />
            Update existing product and add new ones
          </label>
          <label className="flex items-center gap-1.5 text-[#444444] text-sm">
            <input
              type="radio"
              name="import-options"
              value="add-new"
              checked={importOption === "add-new"}
              onChange={(e) => setImportOption(e.target.value)}
              className="w-3"
            />
            Only add new products (skip existing)
          </label>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 mt-5 px-10">
        <Button
          variant="outline"
          onClick={() => setStep("preview")}
          className="w-40"
        >
          Back
        </Button>
        <Button className="w-40" onClick={() => setStep("loading")}>
          Start Import
        </Button>
      </div>
    </div>
  );
};

export default ImportConfigure;
