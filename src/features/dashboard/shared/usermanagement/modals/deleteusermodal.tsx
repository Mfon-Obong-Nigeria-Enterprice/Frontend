import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { deleteUser } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteUserModalProps {
  user: { id: string; name: string };
  onClose: () => void;
}

const DeleteUserModal = ({ user, onClose }: DeleteUserModalProps) => {
  const removeUser = useUserStore((s) => s.removeUser);

  const mutation = useMutation({
    mutationFn: () => deleteUser(user.id),
    onSuccess: () => {
      removeUser(user.id); // update store
      toast.success(`${user.name} deleted successfully`);
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const handleConfirmDelete = () => {
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
        <p className="mb-6 text-base text-[#444]">
          You are about to delete{" "}
          <span className="font-semibold">{user.name}</span>.
          <br />
          Are you sure you want to perform this action?
          <br />
          <span className="font-medium">This can’t be undone...</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className={mutation.isPending ? "cursor-not-allowed" : ""}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={mutation.isPending}
            className={mutation.isPending ? "cursor-not-allowed" : ""}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
