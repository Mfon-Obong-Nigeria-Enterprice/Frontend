import { useState } from "react";
import BusinessLocationModal from "@/components/BusinessLocationModal"; // <- adjust if needed

export default function TestModalPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Modal Test Page</h1>

      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#2ECC71] text-white rounded"
      >
        Open Create Location Modal
      </button>

      <BusinessLocationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          // simple test action — logs to console
          console.log("Business location submitted:", data);
          // you can close here or let the modal close itself after submit
          setOpen(false);
        }}
      />
    </div>
  );
}
