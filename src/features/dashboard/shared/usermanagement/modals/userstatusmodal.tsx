import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { suspendUser, enableUser } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserStatusModalProps {
  user: { id: string; name: string };
  action: "suspend" | "enable";
  onClose: () => void;
}

const UserStatusModal = ({ user, action, onClose }: UserStatusModalProps) => {
  const suspend = useUserStore((s) => s.suspendUser);
  const enable = useUserStore((s) => s.enableUser);

  const mutation = useMutation({
    mutationFn: () =>
      action === "suspend" ? suspendUser(user.id) : enableUser(user.id),
    onSuccess: () => {
      if (action === "suspend") {
        suspend(user.id);
        toast.success(`${user.name} was suspended successfully`);
      } else {
        enable(user.id);
        toast.success(`${user.name} was enabled successfully`);
      }
      onClose();
    },
    onError: () => {
      toast.error(
        `Failed to ${action === "suspend" ? "suspend" : "enable"} user`
      );
    },
  });

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
        <p className="mb-6 text-base text-[#444]">
          You are about to{" "}
          <span className="font-semibold">
            {action} {user.name}
          </span>
          .
          <br />
          Are you sure you want to perform this action?
          <br />
          <span className="font-medium">
            {action === "suspend"
              ? "This will restrict the user's access."
              : "This will restore the user's access."}
          </span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={mutation.isPending}>
            {mutation.isPending
              ? action === "suspend"
                ? "Suspending..."
                : "Enabling..."
              : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusModal;
