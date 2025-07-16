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
import { useClientStore } from "@/stores/useClientStore";
import { Button } from "@/components/ui/Button";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const { addClient } = useClientStore();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
    balance: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clientData = {
      ...formData,
      _id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: "", // or undefined if optional
      address: "", // or undefined
      balance: formData.balance,
      transactions: [], // default empty array
      isActive: true,
      isRegistered: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastTransactionDate: undefined,
    };

    addClient(clientData);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      notes: "",
      balance: 0,
    });
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
                  placeholder="080 XXX XXX XX"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="number"
                className="text-sm text-[#333333] font-[400]"
              >
                Balance
              </Label>
              <Input
                className="mt-2 font-[400] text-sm border border-[#444444] "
                id="number"
                type="number"
                required
                value={formData.balance}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    balance: Number(e.target.value),
                  }))
                }
              />
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
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={5}
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
                Add Client
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
