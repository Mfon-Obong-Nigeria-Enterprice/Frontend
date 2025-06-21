import React from "react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div
    role="alert"
    className="min-h-screen flex flex-col justify-center items-center p-4 text-center"
  >
    <h2>Something went wrong.</h2>
    <p className="text-red-600 max-w-[80%] mx-auto text-center">
      {error.message}
    </p>
    <button
      onClick={resetErrorBoundary}
      className="bg-gradient-to-t from-blue-200 to-blue-100 border border-blue-300 hover:text-blue-700 rounded-lg p-2 mt-4 transition-color duration-100 ease-in-out"
    >
      Try again
    </button>
  </div>
);

export default ErrorFallback;
