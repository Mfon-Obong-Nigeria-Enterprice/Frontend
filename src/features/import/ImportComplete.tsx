/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/components/ui/Button";
import { useImportStore } from "@/stores/useImportStore";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

const ImportComplete = () => {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const { data, summary, setStep, reset } = useImportStore();

  const [showCheck, setShowCheck] = useState(false);

  // simulate a short delay before showing the check
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCheck(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const importedData = [
    // { title: "Product Updated", quantity: summary.updated },
    { title: "Product Updated", quantity: data.length },
    { title: "New Product", quantity: summary.new },
    { title: "Errors", quantity: summary.errors },
    { title: "Processing", quantity: 0.3 },
  ];
  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]">Import Complete</h4>
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

      <div className="flex flex-col justify-center items-center gap-3 mt-16">
        <div className="bg-[#E0DDDD] w-22 h-22 flex justify-center items-center rounded-full">
          {showCheck && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-[#2ECC71] w-20 h-20 inline-flex justify-center items-center rounded-full"
            >
              <Check className="text-white" size={70} />
            </motion.div>
          )}
        </div>
        <p className="text-center">Import Successful</p>

        {/* summary grid */}
        <div className="grid grid-cols-4 gap-8 my-5">
          {importedData.map((data, i) => (
            <div
              key={i}
              className="bg-[#F5F5F5] flex flex-col justify-center items-center px-3 py-4 rounded-md"
            >
              <p className="text-[#333333] font-semibold text-lg">
                {i === 3 ? `${data.quantity}s` : `${data.quantity}`}
              </p>
              <p className="text-[#7D7D7D] text-sm">{data.title}</p>
            </div>
          ))}
        </div>
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
