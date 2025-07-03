import React from "react";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/useGoBack";
import { X, FolderOpen } from "lucide-react";
import { useImportStore } from "@/stores/useImportStore";

const requirements: string[] = [
  "Maximum file size 10MB",
  "Requirement columns: Product Name, Category, Stock Quantity, Price per unit",
  "First row should contain headers",
];

const ImportUpload: React.FC = () => {
  const goBack = useGoBack();
  const { setStep, setData, setError } = useImportStore();

  const handleUpload = () => {
    // simulate file parsing
    try {
      const data = [
        { product: "Cement", category: "Building", stock: 100, price: 3000 },
        { product: "Iron rod", category: "Metal", stock: 50, price: 5000 },
      ];
      setData(data);
      setError(null);
      setStep("preview");
    } catch (err) {
      setError("Could not parse file.");
      setStep("error");
    }
  };

  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]"> Import stock</h4>
        <button
          className="h-7 w-7 inline-flex justify-center items-center border border-full rounded-full"
          onClick={() => goBack()}
        >
          <X size={14} />
        </button>
      </div>
      <div className="px-5 pt-8 space-y-6">
        {/* file upload */}
        <div className="bg-[#F5F5F5] flex flex-col justify-center items-center min-h-70 gap-1.5 border-2 border-dashed border-[#7D7D7D] rounded-md">
          <FolderOpen size={60} />
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
              handleUpload();
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
