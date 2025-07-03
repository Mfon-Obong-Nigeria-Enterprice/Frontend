// // components/LogoutButton.tsx
// import React from "react";
// import { useLogout } from "@/hooks/useLogout";

// interface LogoutButtonProps {
//   className?: string;
//   children?: React.ReactNode;
//   variant?: "button" | "link";
// }

// const LogoutButton: React.FC<LogoutButtonProps> = ({
//   className = "",
//   children = "Logout",
//   variant = "button",
// }) => {
//   const { logout } = useLogout();

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       logout();
//     }
//   };

//   if (variant === "link") {
//     return (
//       <span
//         onClick={handleLogout}
//         className={`cursor-pointer hover:text-red-600 ${className}`}
//         role="button"
//         tabIndex={0}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") {
//             handleLogout();
//           }
//         }}
//       >
//         {children}
//       </span>
//     );
//   }

//   return (
//     <button
//       onClick={handleLogout}
//       className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// export default LogoutButton;
