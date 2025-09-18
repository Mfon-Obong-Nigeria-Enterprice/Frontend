import React, { useState } from "react";
import { GoCheck } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // WebSocket hook for real-time notifications
  const { emitSupportRequest, isConnected } = useWebSocketNotifications(false);

  // Issue types that users can select from
  const issueTypes = [
    "Forgot Password",
    "Can't Login",
    "Account Locked",
    "Email Verification Issues",
    "Performance Issues",
    "Data Issues",
    "Other Technical Issues",
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
          message:
            formData.description ||
            `Support request for: ${formData.issueType}`,
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

    // console.log("Submitting support request:", {
    //   issueType: formData.issueType,
    //   email: formData.email,
    //   description: formData.description,
    // });

    supportMutation.mutate({
      issueType: formData.issueType,
      email: formData.email,
      message:
        formData.description || `Support request for: ${formData.issueType}`,
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
    setFormData({ issueType: "", email: "", description: "" });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <section className="absolute top-0 left-0 w-full  min-h-screen bg-black/50 flex justify-center items-center px-2 z-50 ">
      <div className="bg-white min-h-100 rounded-xl overflow-hidden mb-15">
        <h4 className="text-start pl-4 py-4 bg-[#F0F0F3] text-gray-900 text-base font-medium">
          {isSubmitted ? "Support Request Sent" : "What's your challenge"}
        </h4>

        <div className="px-5 pb-5">
          {isSubmitted ? (
            // Success state
            <>
              <p className="py-6 font-Inter font-medium text-sm leading-loose text-center text-gray-600 max-w-[20rem] mx-auto">
                Your support request has been sent to our maintainers. You
                should receive a response within 24 hours. Please check back
                later...
              </p>
              <div className="bg-green-500 flex justify-center items-center mx-auto mb-6 w-20 h-20 rounded-full">
                <GoCheck size={48} className="fill-white" />
              </div>

              {/* Connection status indicator */}
              <div className="text-xs text-center mb-4 text-gray-500">
                {isConnected ? (
                  <span className="text-green-600">
                    ✓ Real-time notifications enabled
                  </span>
                ) : (
                  <span className="text-amber-600">
                    ⚠ Real-time notifications unavailable
                  </span>
                )}
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
                  Select an Issue Type *
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Please provide any additional details about your issue..."
                  className="min-h-[100px] resize-none"
                  disabled={supportMutation.isPending}
                />
              </div>

              {/* Connection status */}
              <div className="text-xs text-gray-500 text-center">
                Real-time notifications:{" "}
                {isConnected ? (
                  <span className="text-green-600">Connected</span>
                ) : (
                  <span className="text-amber-600">Disconnected</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={supportMutation.isPending}
                  className=""
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
                    "Send Support"
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
