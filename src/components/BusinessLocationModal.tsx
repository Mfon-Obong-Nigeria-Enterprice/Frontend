// src/components/BusinessLocationModal.tsx
import React, { useState } from "react";
import Modal from "@/components/Modal"; // your teammate's modal
import { createLocation, type LocationResponse } from "@/services/locationService"; // ✅ connect to API
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: LocationResponse) => void;
};

export default function BusinessLocationModal({ isOpen, onClose, onSubmit }: Props) {
  const [locationType, setLocationType] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const reset = () => {
    setLocationType("");
    setAddress("");
    setEmail("");
    setPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Validate
    const newErrors: { [k: string]: string } = {};
    if (!locationType.trim()) newErrors.locationType = "Location type is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (phone && !/^[0-9+\-()\s]{7,20}$/.test(phone)) newErrors.phone = "Invalid phone number";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = { locationType, address, email, phone };

    try {
      setLoading(true);
      console.log("🚀 Sending location data to backend:", payload);
      const res = await createLocation(payload); // ✅ call backend
      console.log("✅ Location created successfully:", res);
      toast.success("Business location created successfully");
      // Notify parent with the created location
      if (onSubmit) {
        onSubmit(res);
      }
      reset();
      onClose();
    } catch (err: any) {
      console.error("❌ Failed to create location:", err);
      console.error("❌ Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url
      });
      
      // Show specific error message
      const errorMessage = err.response?.data?.message || err.message || "Failed to create business location";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => {
                setLocationType(e.target.value);
                if (errors.locationType) setErrors((p) => ({ ...p, locationType: "" }));
              }}
              placeholder="e.g main Office/branch"
              className={`w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${errors.locationType ? "border-red-500" : ""}`}
              required
            />
            {errors.locationType && (
              <p className="mt-1 text-xs text-red-600">{errors.locationType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Address</label>
            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors((p) => ({ ...p, address: "" }));
              }}
              placeholder="e.g 233 Abak Road"
              className={`w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${errors.address ? "border-red-500" : ""}`}
              required
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: "" }));
              }}
              type="email"
              placeholder="Enter company email address"
              className={`w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
              }}
              placeholder="Enter company phone number"
              className={`w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
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
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Location"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
