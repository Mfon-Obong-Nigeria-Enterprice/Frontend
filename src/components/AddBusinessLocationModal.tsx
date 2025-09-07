import { useState } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createLocation } from "@/services/locationService";

type AddBusinessLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddBusinessLocationModal = ({
  isOpen,
  onClose,
}: AddBusinessLocationModalProps) => {
  const [form, setForm] = useState({
    locationType: "",
    address: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [k: string]: string } = {};
    if (!form.locationType.trim()) newErrors.locationType = "Location type is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (form.phone && !/^[0-9+\-()\s]{7,20}$/.test(form.phone)) newErrors.phone = "Invalid phone number";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await createLocation(form);
      toast.success("Business location created successfully");
      onClose();
      setForm({ locationType: "", address: "", email: "", phone: "" });
    } catch (err) {
      console.error("Create location failed", err);
      toast.error("Failed to create business location");
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
            <Button type="submit">Create Location</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddBusinessLocationModal;
