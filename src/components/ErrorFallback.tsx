/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

interface ErrorFallbackProps {
  error: any;
  resetErrorBoundary?: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const status = error?.response?.status;

    if (status === 401) {
      logout();
      window.location.href = "/";
    }
  }, [error, logout]);

  const handleTryAgain = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col justify-center items-center p-4 text-center"
    >
      <h1>Oops! Something went wrong.</h1>

      <p className="text-red-600 max-w-[80%] mx-auto text-center">
        {error?.message?.includes("Network Error")
          ? "Network issue detected. Please check your internet connection."
          : error?.message || "An unexpected error occurred."}
      </p>

      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={handleTryAgain}
          className="bg-gradient-to-t from-blue-200 to-blue-100 border border-blue-300 hover:text-blue-700 rounded-lg p-2 transition-color duration-100 ease-in-out"
        >
          Try again
        </button>

        <button
          onClick={() => window.location.reload()}
          className="text-sm text-gray-500 underline"
        >
          Reload the app
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;