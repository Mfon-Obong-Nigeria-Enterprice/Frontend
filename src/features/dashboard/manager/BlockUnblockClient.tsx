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
import { toast } from "react-toastify";

interface BlockUnblockClientProps {
  open: boolean;
  onOpenchange: (open: boolean) => void;
  client: Client;
  isBlocked: boolean;
  onSuccess?: () => void;
}

const BlockUnblockClient: React.FC<BlockUnblockClientProps> = ({
  open,
  onOpenchange,
  isBlocked,
  client,
  onSuccess,
}) => {
  const { blockMutate, unblockMutate } = useClientMutations();
  const [isProcessing, setIsProcessing] = useState(false);
  //
  const handleAction = async () => {
    if (!client._id) {
      toast.error("CLient ID id missing, cannot perform action");
      return;
    }
    setIsProcessing(true);
    try {
      if (isBlocked) {
        await unblockMutate.mutateAsync(client._id);
        toast.success("Client unblocked Succesfully");
      } else {
        await blockMutate.mutateAsync(client._id);
        toast.success("Client blocked Succesfully");
      }
      onOpenchange(false);
      onSuccess?.();
    } catch (err) {
      if (isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          `Failed to ${isBlocked ? "unblock" : "block"} client`;
        toast.error(errorMessage);
        // console.error(
        //   `Error ${isBlocked ? "unblocking" : "blocking"} client:`,
        //   err.response?.data
        // );
      } else {
        toast.error(
          `An unexpected error occurred while ${
            isBlocked ? "unblocking" : "blocking"
          } the client`
        );
        // console.error("Unexpected error:", err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  //
  const actionText = isBlocked ? "unblock" : "block";
  const actionTextCapitalized =
    actionText.charAt(0).toUpperCase() + actionText.slice(1);

  //
  return (
    <Dialog open={open} onOpenChange={onOpenchange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionTextCapitalized} Client</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to {actionText}{" "}
            <strong>{client?.name}</strong>?
          </p>

          {!isBlocked ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Blocking this client will prevent them
                from making new transactions until they are unblocked.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-700">
                <strong>Note:</strong> Unblocking this client will restore their
                ability to make transactions.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4">
          <Button
            variant="secondary"
            onClick={() => onOpenchange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant={isBlocked ? "default" : "destructive"}
            onClick={handleAction}
            disabled={isProcessing}
            className={isBlocked ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isProcessing
              ? `${actionTextCapitalized}ing...`
              : actionTextCapitalized}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUnblockClient;
