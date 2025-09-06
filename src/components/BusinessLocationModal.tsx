// src/components/BusinessLocationModal.tsx
import React, { useState } from "react";
import Modal from "@/components/Modal"; // your teammate's modal
// removed unused Input, Label

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    locationType: string;
    address: string;
    email: string;
    phone: string;
  }) => void;
};

export default function BusinessLocationModal({ isOpen, onClose, onSubmit }: Props) {
  const [locationType, setLocationType] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const reset = () => {
    setLocationType("");
    setAddress("");
    setEmail("");
    setPhone("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { locationType, address, email, phone };
    onSubmit?.(payload);
    // keep UX: close modal and reset form
    onClose();
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-4">Create Business Location</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Location Type</label>
            <input
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              placeholder="e.g main Office/branch"
              className="w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g 233 Abak Road"
              className="w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter company email address"
              className="w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter company phone number"
              className="w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Footer: grey bar with Cancel (left) and Create Location (right) */}
          <div className="mt-4 border-t pt-4 flex items-center justify-between bg-transparent">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 rounded-md border text-sm bg-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
            >
              Create Location
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
