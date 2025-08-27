import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
// import { useAuthInit } from "./hooks/useAuthInit";
// import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  // const isAuthInitialized = useAuthInit();

  // if (!isAuthInitialized) {
  //   return <LoadingSpinner />;
  // }

  return <RouterProvider router={router} />;
}

export default App;
