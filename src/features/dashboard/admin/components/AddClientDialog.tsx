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
import { Button } from "@/components/ui/button";
import { useClientMutations } from "@/hooks/useClientMutations";
import { isAxiosError, type AxiosError } from "axios";
import type { CreateClientPayload } from "@/services/clientService";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  phone: string;
  description: string;
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
    address: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, "");
    const limitedDigits = digitsOnly.slice(0, 11);

    setFormData((prev) => ({
      ...prev,
      phone: limitedDigits,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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

    if (!formData.address.trim()) {
      setError("Client address is required");
      setIsLoading(false);
      return;
    }

    const digitsOnly = formData.phone.replace(/\D/g, "");
    if (digitsOnly.length !== 11) {
      setError("Phone number must be exactly 11 digits");
      setIsLoading(false);
      return;
    }

    if (!/^[0-9]+$/.test(digitsOnly)) {
      setError("Phone number must contain only digits");
      setIsLoading(false);
      return;
    }

    try {
      // Build the client data object matching backend requirements
      const clientData: CreateClientPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      if (formData.description.trim()) {
        clientData.description = formData.description.trim();
      }

      await createMutate.mutateAsync(clientData);

      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        description: "",
        address: "",
      });
      setError(null);
    } catch (err) {
      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;

        if (axiosError.response?.status === 409) {
          setError(
            "A client with this name or phone number already exists. Please use different details."
          );
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to add client. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      setFormData({
        name: "",
        phone: "",
        description: "",
        address: "",
      });
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogOverlay className="bg-[#ffffff] fixed inset-0 z-50" />
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
                  Client Name
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
                  Phone Number
                </Label>
                <Input
                  className="w-full mt-2 font-[400] text-sm border border-[#444444] "
                  id="phone"
                  value={formData.phone}
                  disabled={isLoading}
                  placeholder="080 XXX XXX XX"
                  onChange={handlePhoneChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="address"
                className="text-sm text-[#333333] font-[400]"
              >
                Client Address
              </Label>
              <Input
                className="mt-2 font-[400] text-sm border border-[#444444]"
                id="address"
                placeholder="Enter client address"
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

            <div>
              <Label
                htmlFor="description"
                className="text-sm text-[#444444] font-[400] "
              >
                Description (optional)
              </Label>
              <Textarea
                className="mt-2 font-[400] text-sm border border-[#444444]"
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Add any additional notes about this client..."
                rows={5}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-[10px] pt-4 items-end justify-end ">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="border-[#444444] border p-5"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#2ECC71] p-5 hover:bg-[#27AE60]"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
