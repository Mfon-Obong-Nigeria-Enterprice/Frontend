import { useState } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createLocation } from "@/services/locationService";
import { useBranchStore } from "@/stores/useBranchStore";
import { useQueryClient } from "@tanstack/react-query";

type AddBusinessLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddBusinessLocationModal = ({
  isOpen,
  onClose,
}: AddBusinessLocationModalProps) => {
  const branches = useBranchStore((s) => s.branches);
  const setBranches = useBranchStore((s) => s.setBranches);
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    locationType: "",
    address: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!import.meta.env.PROD) console.log("🔥 Form submit triggered!");
    e.preventDefault();
    e.stopPropagation();
    if (!import.meta.env.PROD) console.log("🔥 Form prevented default and stopped propagation");
    
    const newErrors: { [k: string]: string } = {};
    const email = form.email.trim();
    const phone = form.phone.trim();

    // Basic requireds
    if (!form.locationType.trim()) newErrors.locationType = "Location type is required";
    if (!form.address.trim()) newErrors.address = "Address is required";

    // Stricter email validation: basic RFC-like + TLD letters 2-24
    if (email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/.test(email)) {
      newErrors.email = "Enter a valid email (e.g., name@example.com)";
    }

    // Phone: keep digits and + only, length 7-15 after stripping spaces/dashes/() 
    if (phone) {
      const normalizedPhone = phone.replace(/[\s\-()]/g, "");
      if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
        newErrors.phone = "Enter a valid phone (7-15 digits, optional +)";
      }
    }
    // Prevent duplicates by name (case-insensitive)
    const normalizedName = form.locationType.trim().toLowerCase();
    const duplicate = branches.some((b) => (b.name || "").trim().toLowerCase() === normalizedName);
    if (duplicate) {
      newErrors.locationType = "A location with this name already exists";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Creating location...", { id: "create-location" });
      if (!import.meta.env.PROD) console.log("🚀 Sending location data to backend:", form);
      const res = await createLocation(form);
      if (!import.meta.env.PROD) console.log("✅ Location created successfully:", res);
      // Optimistically update branch store
      setBranches([...branches, res as any]);
      // Best-effort refetch to ensure eventual consistency
      queryClient.invalidateQueries({ queryKey: ["branches"] }).catch(() => {});
      toast.success("Branch created successfully ✅", { id: "create-location" });
      setForm({ locationType: "", address: "", email: "", phone: "" });
      onClose();
    } catch (err: any) {
      if (!import.meta.env.PROD) {
        console.error("❌ Failed to create location:", err);
        console.error("❌ Error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
        });
      }
      
      // Show specific error message (handle 409 duplicate nicely)
      const isConflict = err.response?.status === 409;
      const errorMessage = isConflict
        ? (err.response?.data?.message || "A location with this name already exists")
        : (err.response?.data?.message || err.message || "Failed to create business location");
      toast.error(errorMessage, { id: "create-location" });
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-6">
          Create Business Location
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="locationType">Location Type</Label>
            <Input
              id="locationType"
              name="locationType"
              placeholder="Enter location type"
              value={form.locationType}
              onChange={handleChange}
              className={errors.locationType ? "border-red-500" : undefined}
            />
          {errors.locationType && (
            <p className="mt-1 text-xs text-red-600">{errors.locationType}</p>
          )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
              className={errors.address ? "border-red-500" : undefined}
            />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600">{errors.address}</p>
          )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : undefined}
            />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500" : undefined}
            />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Location"}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddBusinessLocationModal;
