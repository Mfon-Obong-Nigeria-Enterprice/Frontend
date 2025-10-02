/** @format */

import { useEffect, useState } from "react";
import { useImportStore } from "@/stores/useImportStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { bulkImportProducts } from "@/services/productService";
import { toast } from "sonner";

const ImportLoading = () => {
  const { data, setStep, setSummary, setErrorRows } = useImportStore();
  const [processed, setProcessed] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const total = data.length || 0;

  useEffect(() => {
    if (total === 0) {
      setStep("error");
      return;
    }

    const processImport = async () => {
      if (isProcessing) return;
      
      setIsProcessing(true);
      const startTime = Date.now();

      try {
        const result = await bulkImportProducts(data, (processed, total) => {
          setProcessed(processed);
        });

        const processingTime = (Date.now() - startTime) / 1000; // in seconds

        // Update summary with real results
        setSummary({
          updated: 0, // We're only creating new products
          new: result.success.length,
          errors: result.errors.length,
          processingTime: processingTime,
        });

        // Set error rows for display
        setErrorRows(result.errors.map((error, index) => ({
          row: index + 1,
          message: error.error,
        })));

        // Show success message
        if (result.success.length > 0) {
          toast.success(`Successfully imported ${result.success.length} products!`);
        }

        if (result.errors.length > 0) {
          toast.error(`${result.errors.length} products failed to import`);
        }

        // Move to complete step
        setTimeout(() => {
          setStep("complete");
        }, 1000);

      } catch (error) {
        console.error("Import failed:", error);
        toast.error("Import failed. Please try again.");
        setStep("error");
      } finally {
        setIsProcessing(false);
      }
    };

    processImport();
  }, [data, setStep, setSummary, setErrorRows, isProcessing, total]);

  const progress = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]">
          Importing stock data
        </h4>
      </div>

      <div className="max-w-[80%] mt-10 mx-auto space-y-4 text-center">
        {/* Animated dots */}
        <div className="flex gap-3 items-center justify-center">
          {[0, 0.2, 0.4, 0.6].map((delay, i) => (
            <div
              key={i}
              className={`bg-[#7D7D7D] w-5 h-5 rounded-full animate-pulse`}
              style={{
                animationDelay: `${delay}s`,
                animationDuration: "1.3s",
              }}
            ></div>
          ))}
        </div>
        <p className="pt-2 text-[#444444]">Processing your file...</p>
        <p className="pb-5 text-(--cl-secondary) text-xs">
          Importing {total} product{total !== 1 && "s"}
        </p>

        <Progress value={progress} />
        <p className="text-(--cl-secondary) text-xs">
          {processed} of {total} products processed ({progress}%)
        </p>
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
