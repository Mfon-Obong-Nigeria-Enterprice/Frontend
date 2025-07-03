import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/components/ui/button";
import { useImportStore } from "@/stores/useImportStore";
import { X, Check } from "lucide-react";

const ImportComplete = () => {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const { setStep } = useImportStore();

  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]">Import Complete</h4>
        <Button
          variant="ghost"
          className="h-7 w-7 inline-flex justify-center items-center border border-full rounded-full"
          onClick={() => goBack()}
        >
          <X size={14} />
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center gap-3 mt-6">
        <div className="bg-[#E0DDDD] w-[150px] h-[150px] flex justify-center items-center rounded-full">
          <div className="bg-[#2ECC71] w-[135px] h-[135px] inline-flex justify-center items-center rounded-full">
            <Check className="text-white" size={70} />
          </div>
        </div>
        <p className="text-center">Import Successful</p>
      </div>
      {/* buttons to be removed */}
      <div className="flex justify-end items-center gap-4 mt-5 px-10">
        <Button
          variant="outline"
          onClick={() => setStep("loading")}
          className="w-40"
        >
          Back
        </Button>
        <Button onClick={() => navigate("/admin/dashboard/inventory")}>
          View Inventory
        </Button>
        <Button variant="destructive" onClick={() => setStep("error")}>
          Show error state
        </Button>
      </div>
    </div>
  );
};

export default ImportComplete;
