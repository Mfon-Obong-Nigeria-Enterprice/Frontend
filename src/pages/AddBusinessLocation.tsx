import { useState } from "react";
import BusinessLocationModal from "@/components/BusinessLocationModal";

export default function AddBusinessLocation() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Business Location</h1>

      {/* Button to open modal */}
      <button
  onClick={() => {
    alert("Button clicked ✅");
    setOpenModal(true);
  }}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  + Create Business Location
</button>


      {/* Modal */}
      <BusinessLocationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
