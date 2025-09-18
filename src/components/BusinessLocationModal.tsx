// src/components/BusinessLocationModal.tsx
import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

type BusinessLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    locationType: string;
    address: string;
    email: string;
    phone: string;
  }) => void;
};

const BusinessLocationModal = ({ isOpen, onClose, onSubmit }: BusinessLocationModalProps) => {
  const [formData, setFormData] = useState({
    locationType: "",
    address: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    locationType: "",
    address: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // prefer token from Zustand store, fall back to localStorage
  const tokenFromStore = useAuthStore((s) => (s as any).token) as string | null;
  const token = tokenFromStore || localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9+\-\s()]+$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {
      locationType: !formData.locationType ? "Location Type is required" : "",
      address: !formData.address ? "Address is required" : "",
      email: !formData.email ? "Email is required" : !validateEmail(formData.email) ? "Email is invalid" : "",
      phone: !formData.phone ? "Phone number is required" : !validatePhone(formData.phone) ? "Phone number is invalid" : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        name: formData.locationType, // backend expects `name`
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
      };

      // If parent wants to handle the submit (e.g. for local mock/testing)
      if (onSubmit) {
        await onSubmit({
          locationType: formData.locationType,
          address: formData.address,
          email: formData.email,
          phone: formData.phone,
        });
        setMessage({ type: "success", text: "Business location created (handled by parent)!" });
        setTimeout(() => { setMessage(null); onClose(); }, 1200);
        return;
      }

      // call backend via proxy /api/branches (Vite proxy or same-origin)
      const res = await axios.post(
        "/api/branches",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      // success only when status ok
      if (res.status >= 200 && res.status < 300) {
        setMessage({ type: "success", text: "Business location created successfully!" });
        setTimeout(() => { setMessage(null); onClose(); }, 1200);
      } else {
        // unexpected but handle gracefully
        setMessage({ type: "error", text: "Unexpected response from server." });
      }
    } catch (err: any) {
      console.error("Error adding location:", err);
      const apiMessage = err?.response?.data?.message;
      // if API passed array of errors (validation), join them
      const friendly = Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage ?? "Failed to add location. Try again.";
      setMessage({ type: "error", text: friendly });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof typeof errors) =>
    `w-full border rounded-md px-3 py-2 text-sm ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Create Business Location</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Location Type</label>
            <input type="text" name="locationType" value={formData.locationType} onChange={handleChange}
              placeholder="e.g Main Office/Branch" className={inputClass("locationType")} />
            {errors.locationType && <p className="text-red-500 text-sm mt-1">{errors.locationType}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}
              placeholder="e.g 123 Akak Road" className={inputClass("address")} />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Enter company email address" className={inputClass("email")} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="Enter company phone number" className={inputClass("phone")} />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Inline message */}
          {message && (
            <p className={`text-sm mt-2 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Location"}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BusinessLocationModal;
