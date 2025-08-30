import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

type LogoutConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LogoutConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <h2 className="text-[#111827] md:text-xl text-center mb-4">
          Do you want to Logout?
        </h2>
        <p className="text-[#6B7280] text-sm md:text-base mb-6 text-center">
          You would need to log your details in to access your account
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : null}
            {isLoading ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
