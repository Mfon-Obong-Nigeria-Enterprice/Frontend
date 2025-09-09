import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { QueryProvider } from "./providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      {/* Your existing app content */}
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
