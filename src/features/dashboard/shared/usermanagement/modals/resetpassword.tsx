import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";

// ui components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// services
import {
  generateTemporaryPassword,
  sendPasswordToBranchAdmin,
} from "@/services/passwordService";

// stores
import { useUserStore } from "@/stores/useUserStore";

// types
import type { CompanyUser } from "@/stores/useUserStore";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

interface ResetPasswordProps {
  user: CompanyUser;
  onClose: () => void;
}

const ResetPassword = ({ user, onClose }: ResetPasswordProps) => {
  const [temporaryPassword, setTemporaryPassword] = useState<string>("");
  const [selectedBranchAdmin, setSelectedBranchAdmin] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string>(
    `Code: _______________\n\nPlease securely communicate this temporary password to the staff member.\nThe password expires in 24 hours.\n\nCurrent active sessions have been terminated for security.`
  );
  // Get all users from store
  const users = useUserStore((s) => s.users);

  // Filter branch admins from userStore
  const branchAdmins = useMemo(() => {
    return users.filter((storeUser) => {
      if (!storeUser.isActive || storeUser.isBlocked) return false;
      if (storeUser.role !== "ADMIN") return false;

      // Match by branchId._id if available, otherwise fallback to branch name
      const userBranch = user.branchId?._id || user.branch;
      const adminBranch = storeUser.branchId?._id || storeUser.branch;

      return userBranch === adminBranch;
    });
  }, [users, user.branchId, user.branch]);

  // Generate temporary password mutation
  const generatePasswordMutation = useMutation({
    mutationFn: () => generateTemporaryPassword(user._id),
    onSuccess: (data) => {
      setTemporaryPassword(data.temporaryPassword);
      const updatedMessage = notificationMessage.replace(
        "Code: _______________",
        `Code: ${data.temporaryPassword}`
      );
      setNotificationMessage(updatedMessage);
      toast.success("Temporary password generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate temporary password");
    },
  });

  // Send password to branch admin mutation
  const sendToBranchAdminMutation = useMutation({
    mutationFn: () =>
      sendPasswordToBranchAdmin({
        userId: user._id,
        branchAdminId: selectedBranchAdmin,
        message: notificationMessage,
        temporaryPassword,
        branchAdminEmail: user.email,
        branchId: user.branchId?._id || user.branch || "",
      }),
    onSuccess: () => {
      toast.success("Password sent to branch admin successfully");
    },
    onError: () => {
      toast.error("Failed to send password to branch admin");
    },
  });

  // Copy password to clipboard
  const handleCopyPassword = async () => {
    if (!temporaryPassword) return;

    try {
      await navigator.clipboard.writeText(temporaryPassword);
      toast.success("Password copied to clipboard");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.message || "Failed to copy password");
      }
    }
  };

  // Handle generate new password
  const handleGeneratePassword = () => {
    generatePasswordMutation.mutate();
  };

  // Handle send to branch admin
  const handleSendToBranchAdmin = () => {
    if (!selectedBranchAdmin) {
      toast.error("Please select a branch admin");
      return;
    }
    if (!temporaryPassword) {
      toast.error("Please generate a password first");
      return;
    }
    sendToBranchAdminMutation.mutate();
  };

  // Reset state when dialog closes
  const handleClose = () => {
    setTemporaryPassword("");
    setSelectedBranchAdmin("");
    setNotificationMessage(
      `Code: _______________\n\nPlease securely communicate this temporary password to the staff member.\nThe password expires in 24 hours.\n\nCurrent active sessions have been terminated for security.`
    );
    onClose();
  };

  return (
    <div className="p-6 font-Inter">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#E6FFF1]">
          <img src="/icons/shield-locked.svg" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Reset Password</h2>
      </div>

      <div className="space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-[#D9D9D9] border-2">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Temporary Password Section */}
        <div>
          <label className="block text-sm font-medium text-[#444444] mb-2">
            New Temporary Password
          </label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm truncate">
              {temporaryPassword || "Click 'Generate New Password' to create"}
            </div>
            <Button
              onClick={handleCopyPassword}
              size="lg"
              disabled={!temporaryPassword}
              className="p-6"
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This password expires in 24 hours
          </p>
        </div>

        {/* Send to Branch Admin Section */}
        <div className="bg-[#FFF2CE] border border-[#F39C12] rounded-lg p-4">
          <h3 className="font-medium text-[#333333] mb-3">
            Send to Branch Admin
          </h3>

          {/* Branch Admin Selection */}
          <div className="mb-3 w-full bg-[#F5F5F5]">
            <Select
              value={selectedBranchAdmin}
              onValueChange={setSelectedBranchAdmin}
              disabled={branchAdmins.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    branchAdmins.length > 0
                      ? "Select Branch Admin"
                      : "No branch admins available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {branchAdmins.length > 0 &&
                  branchAdmins.map((admin) => (
                    <SelectItem key={admin._id} value={admin._id}>
                      {admin.name} - {admin.email}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show message if no branch admins found */}
          {branchAdmins.length === 0 && (
            <p className="text-sm text-amber-600 mb-3">
              No branch administrators found for{" "}
              {user.branchId?.name || user.branch}.
            </p>
          )}

          {/* Notification Message */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Message
            </label>
            <div className=" bg-[#F5F5F5] rounded">
              <Textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="min-h-[120px] text-sm bg-[#F5F5F5] p-2"
                placeholder="Enter notification message..."
              />
            </div>
          </div>

          <Button
            onClick={handleSendToBranchAdmin}
            disabled={
              !selectedBranchAdmin ||
              !temporaryPassword ||
              branchAdmins.length === 0 ||
              sendToBranchAdminMutation.isPending
            }
            className="p-4"
            size="sm"
            variant="outline"
          >
            {sendToBranchAdminMutation.isPending
              ? "Sending..."
              : "Send to Branch Admin"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGeneratePassword}
            variant="outline"
            disabled={generatePasswordMutation.isPending}
            className="flex-1"
          >
            {generatePasswordMutation.isPending
              ? "Generating..."
              : "Generate New Password"}
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
