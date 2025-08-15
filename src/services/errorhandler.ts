import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function handleApiError(
  error: unknown,
  fallbackMessage = "Something went wrong"
) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (message) {
      if (typeof message === "string") {
        toast.error(message);
      } else if (Array.isArray(message)) {
        toast.error(message.join(", "));
      } else {
        toast.error(fallbackMessage);
      }
    } else {
      toast.error(fallbackMessage);
    }

    console.error("API Error:", error.response?.data || error.message);
  } else {
    toast.error(fallbackMessage);
    console.error("Unexpected Error:", error);
  }
}
