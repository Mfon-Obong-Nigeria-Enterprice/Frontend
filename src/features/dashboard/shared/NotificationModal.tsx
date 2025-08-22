import { Link } from "react-router-dom";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/useNotificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types/types";

interface NotificationModalProps {
  role: Role;
}

const NotificationModal = ({ role }: NotificationModalProps) => {
  const notifications = useNotificationStore((s) => s.notifications);
  const user = useAuthStore((s) => s.user);

  const visible: Notification[] = notifications.filter((n) =>
    n.recipients.includes(role)
  );

  const previews = visible.slice(0, 5);

  return (
    <div className="p-4">
      {previews.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        <ul>
          {previews.map((n) => (
            <li key={n.id} className="py-2 border-b">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-gray-500">
                {n.createdAt.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={`${
          user?.role === "SUPER_ADMIN"
            ? "/manager/dashboard/manager-notifications"
            : `/${user?.role.toLowerCase()}/dashboard/${user?.role.toLowerCase()}-notifications`
        }`}
        className="flex justify-center"
      >
        <Button className="mt-4">View all notifications</Button>
      </Link>
    </div>
  );
};

export default NotificationModal;

// import { Link } from "react-router-dom";
// import { useNotificationStore } from "@/stores/useNotificationStore";
// import { useAuthStore } from "@/stores/useAuthStore";
// import { Button } from "@/components/ui/button";
// import type { Role } from "@/types/types";

// const NotificationModal = ({ role }: { role: Role }) => {
//   const notifications = useNotificationStore((s) => s.notifications);
//   const user = useAuthStore((s) => s.user);

//   // Show only what this role should see
//   const visible = notifications.filter((n) => n.recipients.includes(role));
//   const previews = visible.slice(0, 5);

//   return (
//     <div className="p-4">
//       {previews.length === 0 ? (
//         <p className="text-sm text-gray-500">No notifications</p>
//       ) : (
//         <ul>
//           {previews.map((n) => (
//             <li key={n.id} className="py-2 border-b">
//               <p className="text-sm font-medium">{n.title}</p>
//               <p className="text-xs text-gray-500">
//                 {new Date(n.createdAt).toLocaleString()}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//       <Link
//         to={`${
//           user?.role === "SUPER_ADMIN"
//             ? "/manager/dashboard/manager-notifications"
//             : `/${user?.role.toLowerCase()}/dashboard/${user?.role.toLowerCase()}-notifications`
//         }`}
//         className="flex justify-center"
//       >
//         <Button
//           // `/${user?.role.toLocaleLowerCase()}/dashboard/${user?.role.toLocaleLowerCase()}-notifications`
//           className="mt-4"
//         >
//           View all notifications
//         </Button>
//       </Link>
//     </div>
//   );
// };

// export default NotificationModal;
