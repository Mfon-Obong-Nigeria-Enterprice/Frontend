import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClientMutations } from "@/hooks/useClientMutations";
import type { Client } from "@/types/types";
import { AxiosError, isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onEditSuccess: () => void; // Optional callback for success handling
}

type FormData = {
  name: string;
  phone: string;
  description: string;
  balance: number;
  address: string;
};

const EditClientDialog: React.FC<EditClientDialogProps> = ({
  open,
  onOpenChange,
  client,
  onEditSuccess,
}) => {
  const { updateMutate } = useClientMutations();
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    description: "",
    balance: 0,
    address: "",
  });

  useEffect(() => {
    if (client && open) {
      setFormData({
        name: client.name || "",
        phone: client.phone || "",
        description: client.description || "",
        balance: client.balance || 0,
        address: client.address || "",
      });
    }
  }, [client, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client._id) {
      toast.error("Client ID is missing. Cannot update client.");
      return;
    }

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");

      return;
    }

    // Basic phone number validation (adjust regex as needed for your format)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");

      return;
    }

    try {
      const clientData = {
        id: client._id,
        data: formData,
      };
      await updateMutate.mutateAsync(clientData);
      onEditSuccess(); // Call the success callback if provided
      toast.success("Client updated successfully");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to add client:", err);

      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;

        // Handle specific error cases
        if (axiosError.response?.status === 409) {
          toast.error(
            "A client with this name or phone number already exists. Please use different details."
          );
        } else if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error("Failed to add client. Please try again.");
        }
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      onOpenChange(false);
      // Reset form when closing
      setFormData({
        name: "",
        description: "",
        balance: 0,
        phone: "",
        address: "",
      });
    }
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          aria-describedby="add-client-dialog z-50"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-medium text-xl pb-4 pt-2 text-[#1E1E1E]">
              Register New Client
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
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
                  disabled={isUpdating}
                  placeholder="Enter client name..."
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                  disabled={isUpdating}
                  placeholder="080 XXX XXX XX"
                  onChange={(e) => handleInputChange("phone", e.target.value)}
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
                  disabled={isUpdating}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
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
                  disabled={isUpdating}
                  value={formData.balance}
                  onChange={(e) => handleInputChange("balance", e.target.value)}
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
                  handleInputChange("description", e.target.value)
                }
                rows={5}
                disabled={isUpdating}
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
                {isUpdating ? "Updating..." : "Update Client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditClientDialog;
