import { useState } from "react";
import Modal from "@/components/Modal";

const AddBusinessLocation = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Business Location Page</h1>

      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Open Modal
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-2">Test Modal 🎉</h2>
          <p className="text-sm text-gray-600">If you see this, it works.</p>
          <div className="mt-4 flex justify-end">
            <button
              className="px-3 py-2 border rounded"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddBusinessLocation;
