import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";

// create the query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("App Error:", error, info);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-center" />
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
