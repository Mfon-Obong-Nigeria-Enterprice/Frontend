import { Button } from "@/components/ui/button";
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
import { useClientStore } from "@/stores/useClientStore";
import type { Client } from "@/types/types";
import { AxiosError, isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onEditSuccess: () => void;
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
  const { updateClient } = useClientStore();
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
    setIsUpdating(true); // Add this line

    if (!client._id) {
      toast.error("Client ID is missing. Cannot update client.");
      setIsUpdating(false);
      return;
    }

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error("Client name is required");
      setIsUpdating(false);
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      setIsUpdating(false);
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      setIsUpdating(false);
      return;
    }

    try {
      // Only send the fields that can be updated
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        description: formData.description.trim(),
        balance: Number(formData.balance),
        address: formData.address.trim(),
      };

      // Call the API to update the client
      await updateMutate.mutateAsync({
        id: client._id,
        data: {
          ...client,
          ...updateData,
        },
      });

      // Update the local store immediately with the new data
      updateClient(client._id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        description: formData.description.trim(),
        balance: Number(formData.balance),
        address: formData.address.trim(),
      });

      // Call the success callback
      onEditSuccess();

      // Close the dialog
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update client:", err);

      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;

        if (axiosError.response?.status === 409) {
          toast.error(
            "A client with this name or phone number already exists. Please use different details."
          );
        } else if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error("Failed to update client. Please try again.");
        }
      } else {
        toast.error("Failed to update client. Please try again.");
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
          aria-describedby="edit-client-dialog"
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-medium text-xl pb-4 pt-2 text-[#1E1E1E]">
              Edit Client Information
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
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
                  Phone Number
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
                  disabled={isUpdating}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="sm:w-[225px] w-full">
                <Label
                  htmlFor="balance"
                  className="text-sm text-[#333333] font-[400]"
                >
                  Balance
                </Label>
                <Input
                  className="mt-2 font-[400] text-sm border border-[#444444] "
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isUpdating}
                  value={formData.balance}
                  onChange={(e) => handleInputChange("balance", e.target.value)}
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
                onClick={handleClose}
                disabled={isUpdating}
                className="border-[#444444] border p-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-[#2ECC71] p-5"
              >
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
