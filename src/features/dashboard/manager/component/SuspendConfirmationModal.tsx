/** @format */

import React from "react";

interface SuspendConfirmationModalProps {
  open: boolean;
  name: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const SuspendConfirmationModal: React.FC<SuspendConfirmationModalProps> = ({
  open,
  name,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
        <p className="mb-6 text-base text-[#444]">
          By clicking <span className="font-semibold">confirm</span>,{" "}
          <span className="font-semibold">{name}</span> will automatically be
          deactivated from the system.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="px-6 py-2 rounded-lg text-[#444] font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded bg-green-600 text-white font-medium"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendConfirmationModal;
