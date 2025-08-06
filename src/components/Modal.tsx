import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ModalSize = "md" | "lg" | "xl" | "xxl" | string;

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: ModalSize;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  xxl: "max-w-3xl",
};

const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  size = "lg",
}: ModalProps) => {
  // prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Don't render if closed
  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        className
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-xl",
          sizeClasses[size as ModalSize] ?? size,
          "w-full max-h-[98vh] overflow-y-auto hide-scrollbar"
        )}
        onClick={(e) => e.stopPropagation()} //prevent closing on content click
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
export default Modal;
