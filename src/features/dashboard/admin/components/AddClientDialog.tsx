/** @format */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { useClientMutations } from "@/hooks/useClientMutations";
import { isAxiosError, type AxiosError } from "axios";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
interface FormData {
  name: string;
  phone: string;
  description: string;
  balance: number;
  address: string;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const { createMutate } = useClientMutations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    description: "",
    balance: 0,
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Client-side validation
    if (!formData.name.trim()) {
      setError("Client name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      setIsLoading(false);
      return;
    }

    // Basic phone number validation (adjust regex as needed for your format)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      setIsLoading(false);
      return;
    }

    try {
      const clientData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        description: formData.description.trim(),
        balance: Number(formData.balance),
        address: formData.address.trim(),
      };
      await createMutate.mutateAsync(clientData);

      onOpenChange(false);
      // Reset form
      setFormData({
        name: "",
        phone: "",
        description: "",
        balance: 0,
        address: "",
      });
    } catch (err) {
      console.error("Failed to add client:", err);

      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;

        // Handle specific error cases
        if (axiosError.response?.status === 409) {
          setError(
            "A client with this name or phone number already exists. Please use different details."
          );
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to add client. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="bg-[#D9D9D9] fixed inset-0 z-50" />
        <DialogContent aria-describedby="add-client-dialog z-50">
          <DialogHeader>
            <DialogTitle className="font-medium text-xl pb-4 pt-2 text-[#1E1E1E]">
              Register New Client
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            {error && (
              <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            <div className="flex items-center gap-3 flex-wrap ">
              <div className="sm:w-[225px] w-full ">
                <Label
                  htmlFor="name"
                  className="text-sm text-[#333333] font-[400]"
                >
                  Client Name{" "}
                </Label>
                <Input
                  className="w-full mt-2 font-[400] text-sm border-[#444444] border "
                  id="name"
                  value={formData.name}
                  disabled={isLoading}
                  placeholder="Enter client name..."
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="sm:w-[225px] w-full">
                <Label
                  htmlFor="phone"
                  className="text-sm text-[#333333] font-[400]"
                >
                  Phone Number{" "}
                </Label>
                <Input
                  className="w-full mt-2 font-[400] text-sm border border-[#444444] "
                  id="phone"
                  value={formData.phone}
                  disabled={isLoading}
                  placeholder="080 XXX XXX XX"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="sm:w-[225px] w-full">
                <Label
                  htmlFor="address"
                  className="text-sm text-[#333333] font-[400]"
                >
                  Client Address
                </Label>
                <Input
                  className="mt-2 font-[400] text-sm border border-[#444444] "
                  id="address"
                  placeholder="Enter Client address"
                  required
                  disabled={isLoading}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>

              {/*  */}
              <div className="sm:w-[225px] w-full">
                <Label
                  htmlFor="number"
                  className="text-sm text-[#333333] font-[400]"
                >
                  Initial Balance(optional)
                </Label>
                <Input
                  className="mt-2 font-[400] text-sm border border-[#444444] "
                  id="number"
                  type="number"
                  step="1"
                  placeholder="0.00"
                  required
                  disabled={isLoading}
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      balance: Number.parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="Description"
                className="text-sm text-[#444444] font-[400] "
              >
                Description(optional)
              </Label>
              <Textarea
                className="mt-2 font-[400] text-sm border border-[#444444]"
                id="notes"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={5}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-[10px] pt-4 items-end justify-end ">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-[#444444] border p-5"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2ECC71] p-5">
                {isLoading ? "Adding..." : "Add Client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
