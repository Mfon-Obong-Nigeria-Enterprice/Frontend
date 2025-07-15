/** @format */

import { useEffect, useState } from "react";
import { useImportStore } from "@/stores/useImportStore";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";

const ImportLoading = () => {
  const { data, setStep } = useImportStore();
  const [processed, setProcessed] = useState(0);
  const total = data.length || 0;

  useEffect(() => {
    if (processed >= total) {
      const timeout = setTimeout(() => {
        setStep("complete");
      }, 500);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setProcessed((prev) => {
        if (prev < total) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1000); // Adjust speed as needed (10ms per item = ~4.5s for 450)

    return () => clearInterval(interval);
  }, [processed, total, setStep]);

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
