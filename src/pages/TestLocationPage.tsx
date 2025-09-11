// src/pages/TestLocationPage.tsx
import { useState } from "react";
import BusinessLocationModal from "@/components/BusinessLocationModal";

export default function TestLocationPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Test Business Location</h1>

      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Add Location
      </button>

      {/* Modal */}
      <BusinessLocationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
