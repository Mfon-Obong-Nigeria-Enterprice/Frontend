import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { QueryProvider } from "./providers/QueryProvider";
import NotificationProvider from "./providers/NotificationsProvider";
import PerformanceMonitor from "./components/PerformanceMonitor";

function App() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <PerformanceMonitor />
        <RouterProvider router={router} />
      </NotificationProvider>
    </QueryProvider>
  );
}

export default App;
