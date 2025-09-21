import React, { useState } from "react";
import { GoCheck } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { sendSupportRequest } from "@/services/passwordService";
import { useWebSocketNotifications } from "@/services/webSocketNotificationService";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface SupportFeedbackProps {
  onClose: () => void;
}

const SupportFeedback: React.FC<SupportFeedbackProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    issueType: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // WebSocket hook for real-time notifications
  const { emitSupportRequest, isConnected } = useWebSocketNotifications(false);

  // Only authentication-related issues that maintainers need to handle
  const issueTypes = [
    "Forgot Password",
    "Can't Login",
    "Account Locked",
    "Email Verification Issues",
  ];

  const supportMutation = useMutation({
    mutationFn: sendSupportRequest,
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Support request sent successfully!");

      // Also emit via WebSocket for real-time notification to maintainers
      if (isConnected) {
        emitSupportRequest({
          email: formData.email,
          issueType: formData.issueType,
          message: `Support request for: ${formData.issueType}`,
        });
      }
    },
    onError: (error) => {
      console.error("Support request error:", error);
      toast.error("Failed to send support request. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.issueType) {
      toast.error("Please select an issue type");
      return;
    }

    if (!formData.email) {
      toast.error("Please provide your email address");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    supportMutation.mutate({
      email: formData.email,
      message: `Support request for: ${formData.issueType}`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form when closing
  const handleClose = () => {
    setFormData({ issueType: "", email: "" });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <section className="absolute top-0 left-0 w-full min-h-screen bg-black/50 flex justify-center items-center px-2 z-50">
      <div className="bg-white  rounded-xl overflow-hidden ">
        <div className="    font-medium ">
          {isSubmitted ? (
            <p className=" bg-[#F0F0F3] text-center text-[26px] text-[#1E1E1E] px-2">
              Support Request Sent
            </p>
          ) : (
            <p className="text-start pl-4  text-base text-[#1E1E1E] pt-4">
              What's your challenge
            </p>
          )}
        </div>

        <div className="px-5 pb-5">
          {isSubmitted ? (
            // Success state
            <>
              <p className="py-6 font-Inter font-medium text-sm leading-loose text-center text-gray-600 max-w-[20rem] mx-auto">
                Your support request has been sent to our maintainers. Please
                wait for a response or check back later...
              </p>
              <div className="bg-green-500 flex justify-center items-center mx-auto mb-6 w-20 h-20 rounded-full">
                <GoCheck size={48} className="fill-white" />
              </div>

              <Button
                variant="secondary"
                onClick={handleClose}
                className="w-full bg-[#D9D9D9] hover:bg-[#D9D9D9]/90 h-12"
              >
                Close
              </Button>
            </>
          ) : (
            // Form state
            <form
              onSubmit={handleSubmit}
              className="space-y-4 pt-4 w-[505px] max-w-[300px] sm:max-w-[400px]"
            >
              {/* Issue Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select an Issue Type
                </label>
                <Select
                  value={formData.issueType}
                  onValueChange={(value) =>
                    handleInputChange("issueType", value)
                  }
                  disabled={supportMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Please describe or select an issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  disabled={supportMutation.isPending}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={supportMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    supportMutation.isPending || !formData.email.includes("@")
                  }
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {supportMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SupportFeedback;
