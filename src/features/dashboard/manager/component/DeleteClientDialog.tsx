/** @format */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClientMutations } from "@/hooks/useClientMutations";
import type { Client } from "@/types/types";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

interface DeleteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onDeleteSuccess: () => void; // Optional callback for success handling
}
const DeleteClientDialog: React.FC<DeleteClientDialogProps> = ({
  open,
  onOpenChange,
  client,
  onDeleteSuccess,
}) => {
  const { deleteMutate } = useClientMutations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!client._id) {
      toast.error("Client ID is missing. Cannot delete client.");
      return;
    }
    setIsDeleting(true);

    try {
      await deleteMutate.mutateAsync(client._id);
      toast.success("Client deleted successfully");
      onOpenChange(false);
      onDeleteSuccess(); // Call the success callback if provided
    } catch (err) {
      if (isAxiosError(err)) {
        console.error("Error deleting client:", err.response?.data);
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setIsDeleting(false);
    }
    // Handle delete logic here
    console.log("Client deleted");
    // Close the dialog after deletion
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* <DialogOverlay /> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="mb-4">
              Are you sure you want to delete <strong>{client?.name}</strong>{" "}
              This action cannot be undone and will permanently remove the
              client from your records.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">
              <strong>Warning:</strong> This will also delete all transaction
              history and related records.
            </p>
          </div>

          <div className="flex justify-end p-4">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="ml-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete "}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteClientDialog;
