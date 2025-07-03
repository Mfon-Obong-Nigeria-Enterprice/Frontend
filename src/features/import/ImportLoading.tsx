import React from "react";
import { useImportStore } from "@/stores/useImportStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ImportLoading = () => {
  const { setStep } = useImportStore();

  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]">
          Importing stock data
        </h4>
      </div>

      <div className="max-w-[80%] mt-5 mx-auto">
        <p className="py-2 text-center">Procesing your file...</p>
        <p className="pb-5 text-center">Importing 450 products</p>
        <Progress className=" bg-[#2ECC71] w-[100%]" />
      </div>

      <div className="flex justify-end items-center gap-4 mt-5 px-10">
        <Button
          variant="outline"
          onClick={() => setStep("configure")}
          className="w-40"
        >
          Back
        </Button>
        <Button className="w-40" onClick={() => setStep("complete")}>
          complete
        </Button>
      </div>
    </div>
  );
};

export default ImportLoading;
