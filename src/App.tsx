import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { QueryProvider } from "./providers/QueryProvider";
import NotificationProvider from "./providers/NotificationsProvider";


function App() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </QueryProvider>
  );
}

export default App;
