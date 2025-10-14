// import React from "react";
// import { useWebSocketNotifications } from "@/services/webSocketNotificationService";
// import { useAuthStore } from "@/stores/useAuthStore";

// export const WebSocketStatus: React.FC = () => {
//   const { isConnected, connectionStatus, getStatus } = useWebSocketNotifications(false);
//   const user = useAuthStore((state) => state.user);
//   const status = getStatus();

//   if (!user?.id) {
//     return null; // Don't show if not authenticated
//   }

//   return (
//     <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow-lg p-3 text-xs z-50">
//       <div className="font-semibold text-gray-700 mb-2">Real-time Status</div>
//       <div className="space-y-1">
//         <div className="flex items-center gap-2">
//           <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
//           <span>WebSocket: {connectionStatus}</span>
//         </div>
//         <div className="text-gray-600">
//           User: {user.role} - {user.branch}
//         </div>
//         <div className="text-gray-600">
//           Attempts: {status.attempts}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebSocketStatus;
