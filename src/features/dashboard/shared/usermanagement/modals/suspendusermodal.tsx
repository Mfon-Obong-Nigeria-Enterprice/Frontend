import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { suspendUser } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SuspendUserModalProps {
  user: { id: string; name: string };
  onClose: () => void;
}

const SuspendUserModal = ({ user, onClose }: SuspendUserModalProps) => {
  const suspend = useUserStore((s) => s.suspendUser);

  const mutation = useMutation({
    mutationFn: () => suspendUser(user.id),
    onSuccess: () => {
      suspend(user.id); // update store
      toast.success(`${user.name} is suspended successfully`);
      onClose();
    },
    onError: () => {
      toast.error("Failed to suspend user");
    },
  });

  const handleConfirmSuspend = () => {
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-4 ">Confirm Action</h2>
        <p className="mb-6 text-base text-[#444]">
          You are about to suspend{" "}
          <span className="font-semibold">{user.name}</span>.
          <br />
          Are you sure you want to perform this action?
          <br />
          <span className="font-medium">
            This will restrict the user's access.
          </span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirmSuspend} disabled={mutation.isPending}>
            {mutation.isPending ? "Suspending" : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuspendUserModal;
