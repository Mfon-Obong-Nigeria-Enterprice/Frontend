import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
// import { ScrollRestoration } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error("Admin dashboard error:", error, info);
        }}
      >
        <RouterProvider router={router} />
      </ErrorBoundary>
      {/* <ScrollRestoration /> */}
    </>
  );
}

export default App;
