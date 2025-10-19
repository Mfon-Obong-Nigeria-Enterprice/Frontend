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

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  phone: string;
  description: string;
  balance: number;
  balanceDisplay: string; // For formatted display
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
    balanceDisplay: "₦0",
    address: "",
  });

  // Format currency display with Naira symbol and commas
  const formatCurrencyDisplay = (value: string) => {
    if (!value) return "₦0";
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly === "") return "₦0";
    const numericValue = parseFloat(digitsOnly);
    return `₦${numericValue.toLocaleString("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Handle balance input change
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove all non-digit characters
    const digitsOnly = inputValue.replace(/\D/g, "");

    // Convert to number
    const numericValue = digitsOnly === "" ? 0 : parseFloat(digitsOnly);

    // Format for display
    const formattedDisplay = formatCurrencyDisplay(digitsOnly);

    setFormData((prev) => ({
      ...prev,
      balance: numericValue,
      balanceDisplay: formattedDisplay,
    }));
  };

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

    if (!formData.address.trim()) {
      setError("Client address is required");
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
        // Only include description if it's not empty
        ...(formData.description.trim() && {
          description: formData.description.trim(),
        }),
        balance: Number(formData.balance) || 0,
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
        balanceDisplay: "₦0",
        address: "",
      });
      setError(null);
    } catch (err) {
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
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      // Reset form when closing
      setFormData({
        name: "",
        phone: "",
        description: "",
        balance: 0,
        balanceDisplay: "₦0",
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

              <div className="sm:w-[225px] w-full">
                <Label
                  htmlFor="balance"
                  className="text-sm text-[#333333] font-[400]"
                >
                  Initial Balance (optional)
                </Label>
                <Input
                  className="mt-2 font-[400] text-sm border border-[#444444] "
                  id="balance"
                  type="text"
                  placeholder="₦0"
                  disabled={isLoading}
                  value={formData.balanceDisplay}
                  onChange={handleBalanceChange}
                />
              </div>
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
