// /** @format */

// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { ExternalLink, ArrowLeft } from "lucide-react";
// import * as XLSX from "xlsx"; // Add this import if not already present
// import Header from "@/components/header/Header";
// import ManagerSidebar from "@/features/sidebar/ManagerSidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";

// // TypeScript interfaces
// interface Activity {
//   activity: string;
//   time: string;
// }

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   status: string;
//   location?: string;
//   profilePicture?: string;
//   createdAt?: string;
//   lastLogin?: string;
//   permissions?: string[];
//   passwordChanged?: boolean;
//   isActive?: boolean;
//   userId?: string;
//   totalLogins?: number;
//   sessionDuration?: string;
//   address?: string;
//   salesRecorded?: number;
//   phone?: string;
//   mobile?: string;
//   department?: string;
// }

// const UserDetailsPage = () => {
//   // API action handlers
//   const token = localStorage.getItem("token") || "";

//   const [user, setUser] = useState<User | null>(null); // Define user state

//   const [deleteModal, setDeleteModal] = useState(false);
//   const [suspendModal, setSuspendModal] = useState(false);
//   const [enableModal, setEnableModal] = useState(false);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [sidebarVisible, setSidebarVisible] = useState(true);
//   const [activeTab, setActiveTab] = useState<"account" | "activities">(
//     "account"
//   );
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token") || "";
//     fetch(`https://mfon-obong-enterprise.onrender.com/api/users/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     })
//       .then(async (res) => {
//         if (!res.ok) throw new Error("Failed to fetch user data");
//         const data = await res.json();
//         setUser(data); // Set the user data
//       })
//       .catch(() => setUser(null)); // Handle errors
//   }, [userId]);

//   const handleExportUserReport = () => {
//     if (!user) return; // Ensure user data is available
//     const wb = XLSX.utils.book_new(); // Create a new workbook
//     const ws = XLSX.utils.json_to_sheet([user]); // Convert user data to a worksheet (wrap in an array)
//     XLSX.utils.book_append_sheet(wb, ws, "User Report"); // Append the worksheet to the workbook
//     XLSX.writeFile(wb, `${user.name}_report.csv`); // Export the workbook to a CSV file with the user's name
//   };

//   // Format account details
//   const accountDetails = [
//     {
//       label: "Created Date",
//       value: user.createdAt
//         ? new Date(user.createdAt).toLocaleDateString()
//         : "-",
//     },
//     { label: "Last Login", value: user.lastLogin || "-" },
//     { label: "Total Logins", value: user.totalLogins || "-" },
//     { label: "Session Duration", value: user.sessionDuration || "-" },
//     { label: "Address", value: user.address || "-" },
//     {
//       label: "Sales Recorded",
//       value: user.salesRecorded ? `₦${user.salesRecorded}` : "-",
//     },
//   ];

//   // Format activities
//   const staffActivities =
//     Array.isArray(activities) && activities.length > 0
//       ? activities
//           .slice(0, 4)
//           .map((a) => ({ activity: a.activity, time: a.time }))
//       : [
//           { activity: "Logged into the system", time: "Today at 9:23 AM" },
//           {
//             activity: "Record a new sales - Udom construction (₦125,000)",
//             time: "Today at 11:45 AM",
//           },
//           { activity: "Profile image updated", time: "3 days ago at 2:13 PM" },
//           {
//             activity:
//               "Recorded partial pickup: 20 bags of cement for Ade properties",
//             time: "Yesterday at 2:00 PM",
//           },
//         ];

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-[#F9F9F9] m-0 p-0 px-6 ">
//         {/* Hamburger for sidebar toggle - top right after sidebar */}
//         {/* Hide hamburger when any modal is active */}
//         {!(deleteModal || suspendModal || enableModal) && (
//           <div
//             className={`fixed top-6 ${
//               sidebarVisible ? "left-[260px]" : "left-6"
//             } z-[100] md:block lg:hidden`}
//           >
//             <Button
//               variant="ghost"
//               size="icon"
//               className="size-8 border border-[#d9d9d9] bg-white"
//               onClick={() => setSidebarVisible((v) => !v)}
//             >
//               {/* Three-line hamburger icon for consistency */}
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="4" y1="6" x2="20" y2="6" />
//                 <line x1="4" y1="12" x2="20" y2="12" />
//                 <line x1="4" y1="18" x2="20" y2="18" />
//               </svg>
//               <span className="sr-only">Toggle Sidebar</span>
//             </Button>
//           </div>
//         )}
//         <div className={sidebarVisible ? "lg:block" : "hidden lg:hidden"}>
//           {/* Desktop sidebar only */}
//           <div className="hidden lg:block">
//             <ManagerSidebar />
//           </div>
//           {/* Mobile sidebar as fixed drawer, no overlay */}
//           <div
//             className={`${
//               sidebarVisible ? "block" : "hidden"
//             } fixed top-0 left-0 h-full w-[260px] bg-white shadow-xl z-[120] lg:hidden`}
//           >
//             <ManagerSidebar />
//           </div>
//         </div>
//         <main className="flex-1 flex flex-col gap-6 mb-0">
//           <Header userRole="manager" />
//           {/* Breadcrumb at top */}
//           <div className="w-full bg-white px-8 pt-6 pb-2 border-b border-[#F0F0F0]">
//             <div className="flex items-center justify-between">
//               <h1>User Details</h1>
//               {/* Desktop: show all buttons inline; Mobile: show hamburger */}

//               {/* Hide popover menu when any modal is active */}
//               {!(deleteModal || suspendModal || enableModal) && (
//                 <div className="md:hidden flex items-center">
//                   {/* Hamburger for mobile actions */}
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="border border-[#d9d9d9]"
//                       >
//                         <svg
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <line x1="4" y1="8" x2="20" y2="8" />
//                           <line x1="4" y1="16" x2="20" y2="16" />
//                         </svg>
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent align="end" className="w-48 p-2">
//                       <div className="flex flex-col gap-2">
//                         <Button
//                           variant="outline"
//                           className="flex items-center gap-2 py-3 w-full"
//                           size="sm"
//                           onClick={() => setSuspendModal(true)}
//                         >
//                           Suspend User
//                         </Button>
//                         <Button
//                           variant="outline"
//                           className="flex items-center gap-2 py-3 w-full"
//                           size="sm"
//                           onClick={() => setEnableModal(true)}
//                         >
//                           Enable User
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           className="flex items-center gap-2 py-3 w-full"
//                           size="sm"
//                           onClick={() => setDeleteModal(true)}
//                         >
//                           <svg
//                             className="w-4 h-4 text-[#fff]"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M3 6h18" />
//                             <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                             <rect x="5" y="6" width="14" height="14" rx="2" />
//                             <path d="M10 11v6M14 11v6" />
//                           </svg>
//                           Delete User
//                         </Button>
//                       </div>
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               )}
//             </div>
//             {/* Mobile: Back to User List below title */}
//             <div className="md:hidden mt-2">
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2 py-4 w-full"
//                 size="sm"
//                 onClick={() => navigate(-1)}
//               >
//                 <ArrowLeft className="size-4" /> Back to User List
//               </Button>
//             </div>
//           </div>
//           {/* Mobile tab navigation for Account Details / Staff Activities */}
//           <div className="w-full py-6 px-0">
//             <div className="md:hidden flex justify-center mb-6">
//               <div className="flex w-full rounded-xl bg-[#F5F5F5] shadow p-1 gap-2">
//                 <button
//                   className={`w-full py-3 rounded-lg text-base font-medium transition-colors duration-150 ${
//                     activeTab === "account"
//                       ? "bg-[#3D80FF] text-white"
//                       : "bg-white text-[#333]"
//                   }`}
//                   onClick={() => setActiveTab("account")}
//                   style={{ minWidth: 0 }}
//                 >
//                   Account Details
//                 </button>
//                 <button
//                   className={`w-full py-3 rounded-lg text-base font-medium transition-colors duration-150 ${
//                     activeTab === "activities"
//                       ? "bg-[#3D80FF] text-white"
//                       : "bg-white text-[#333]"
//                   }`}
//                   onClick={() => setActiveTab("activities")}
//                   style={{ minWidth: 0 }}
//                 >
//                   Staff Activities
//                 </button>
//               </div>
//             </div>
//             {/* Always show user card on all screens */}
//             <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center gap-6 p-8 mb-8 border border-[#F0F0F0] w-full">
//               <Avatar className="w-24 h-24">
//                 <AvatarImage
//                   src={user.profilePicture || "/images/manager-avatar.png"}
//                   alt={user.name}
//                 />
//                 <AvatarFallback>
//                   {user.name ? user.name[0] : "U"}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex-1 w-full">
//                 <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
//                   <span className="text-2xl font-semibold text-[#333]">
//                     {user.name}
//                   </span>
//                   <Badge
//                     variant="default"
//                     className={`capitalize text-xs px-3 py-1 font-medium ${
//                       user.isActive
//                         ? "bg-[#EAFBE7] text-[#2ECC71]"
//                         : "bg-[#FDEDED] text-[#E74C3C]"
//                     }`}
//                   >
//                     {user.isActive ? "Active" : user.status || "Inactive"}
//                   </Badge>
//                 </div>
//                 <div className="flex flex-col gap-1 mb-1">
//                   <span className="text-[#666] text-sm mb-4">{user.email}</span>
//                   <span className="flex items-center gap-2 text-xs text-muted-foreground">
//                     <span className="flex items-center gap-1 font-mono">
//                       <svg
//                         className="w-4 h-4 text-[#888]"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="1.5"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle cx="12" cy="12" r="10" />
//                         <path d="M12 16v-4M12 8h.01" />
//                       </svg>
//                       User ID: {user.userId || user._id}
//                     </span>
//                     <span className="mx-1">|</span>
//                     <span className="flex items-center gap-1">
//                       <svg
//                         className="w-4 h-4 text-[#888]"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="1.5"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                       </svg>
//                       Role: {user.role}
//                     </span>
//                   </span>
//                   <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                     <svg
//                       className="w-4 h-4 text-[#888]"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M17.657 16.657L13.414 12.414a4 4 0 1 0-1.414 1.414l4.243 4.243a1 1 0 0 0 1.414-1.414z" />
//                       <circle cx="9" cy="9" r="3" />
//                     </svg>
//                     Location: {user.location}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-col items-end gap-2">
//                 <span className="text-sm text-[#444] bg-[#F5F5F5] px-4 py-2 rounded-lg border flex items-center gap-2">
//                   <svg
//                     width="18"
//                     height="18"
//                     fill="none"
//                     stroke="#333"
//                     strokeWidth="1.5"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-13Z" />
//                     <path d="M8 10h8M8 14h5" />
//                   </svg>
//                   Cell: {user.phone || user.mobile || "-"}
//                 </span>
//                 <span className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
//                   <span className="flex items-center gap-1">
//                     {/* Calendar Icon for Created */}
//                     <svg
//                       className="w-4 h-4 text-[#888]"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       viewBox="0 0 24 24"
//                     >
//                       <rect x="3" y="4" width="18" height="18" rx="4" />
//                       <path d="M16 2v4M8 2v4M3 10h18" />
//                     </svg>
//                     Created:{" "}
//                     {user.createdAt
//                       ? new Date(user.createdAt).toLocaleDateString()
//                       : "-"}
//                   </span>
//                   <span className="mx-1">|</span>
//                   <span className="flex items-center gap-1">
//                     {/* Briefcase Icon for Department */}
//                     <svg
//                       className="w-4 h-4 text-[#888]"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       viewBox="0 0 24 24"
//                     >
//                       <rect x="2" y="7" width="20" height="13" rx="2" />
//                       <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
//                     </svg>
//                     Department: {user.department || "-"}
//                   </span>
//                 </span>
//               </div>
//             </div>
//             {/* Tab content below user card on mobile */}
//             <div className="md:hidden">
//               {activeTab === "account" && (
//                 <div className="bg-white rounded-xl shadow p-6 border border-[#F0F0F0] w-full">
//                   <h2 className="text-lg font-semibold mb-4 text-[#333]">
//                     Account Details
//                   </h2>
//                   <hr className="border-[#F0F0F0] mb-4 border-1" />
//                   <ul className="divide-y divide-[#F0F0F0]">
//                     {accountDetails.map((detail) => (
//                       <li
//                         key={detail.label}
//                         className="flex justify-between items-center text-base text-[#444] py-3"
//                       >
//                         <span>{detail.label}</span>
//                         <span>{detail.value}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {activeTab === "activities" && (
//                 <div className="bg-white rounded-xl shadow p-6 border border-[#F0F0F0] w-full">
//                   <h2 className="text-lg font-semibold mb-4 text-[#333]">
//                     Staff Activities
//                   </h2>
//                   <hr className="border-[#F0F0F0] mb-4 border-1" />
//                   <ul className="divide-y divide-[#F0F0F0]">
//                     {staffActivities.map((activity, idx) => (
//                       <li key={idx} className="py-3">
//                         <div className="text-base text-[#444] mb-1">
//                           {activity.activity}
//                         </div>
//                         <div className="text-xs text-muted-foreground mb-2">
//                           {activity.time}
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
//                     <span>
//                       Showing 1-4 of {activities.length || 4} Activities
//                     </span>
//                     <div className="flex items-center gap-2">
//                       <button
//                         className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
//                         disabled
//                       >
//                         &#60;
//                       </button>
//                       <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-[#F5EAEA] text-[#B0B0B0] font-semibold text-base">
//                         1
//                       </button>
//                       <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base">
//                         &#62;
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* Details Grid - full width (desktop only) */}
//             <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full">
//               <div className="bg-white rounded-xl shadow p-6 border border-[#F0F0F0] w-full">
//                 <h2 className="text-lg font-semibold mb-4 text-[#333]">
//                   Account Details
//                 </h2>
//                 <hr className="border-[#F0F0F0] mb-4 border-1" />
//                 <ul className="divide-y divide-[#F0F0F0]">
//                   {accountDetails.map((detail) => (
//                     <li
//                       key={detail.label}
//                       className="flex justify-between items-center text-base text-[#444] py-3"
//                     >
//                       <span>{detail.label}</span>
//                       <span>{detail.value}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="bg-white rounded-xl shadow p-6 border border-[#F0F0F0] w-full">
//                 <h2 className="text-lg font-semibold mb-4 text-[#333]">
//                   Staff Activities
//                 </h2>
//                 <hr className="border-[#F0F0F0] mb-4 border-1" />
//                 <ul className="divide-y divide-[#F0F0F0]">
//                   {staffActivities.map((activity, idx) => (
//                     <li key={idx} className="py-3">
//                       <div className="text-base text-[#444] mb-1">
//                         {activity.activity}
//                       </div>
//                       <div className="text-xs text-muted-foreground mb-2">
//                         {activity.time}
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
//                   <span>
//                     Showing 1-4 of {activities.length || 4} Activities
//                   </span>
//                   <div className="flex items-center gap-2">
//                     <button
//                       className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
//                       disabled
//                     >
//                       &#60;
//                     </button>
//                     <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-[#F5EAEA] text-[#B0B0B0] font-semibold text-base">
//                       1
//                     </button>
//                     <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base">
//                       &#62;
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Export Button */}
//             <div className="flex justify-end mb-8"></div>
//             {/* Modals */}
//             {deleteModal && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                 <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
//                   <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
//                   <p className="mb-6 text-base text-[#444]">
//                     You are about to delete this user.
//                     <br />
//                     Are you sure you want to perform this action?
//                     <br />
//                     <span className="font-medium">This can’t be undone...</span>
//                   </p>
//                   <div className="flex gap-4 justify-center">
//                     <button
//                       className="px-6 py-2 rounded-lg text-[#444] font-medium border-2"
//                       onClick={() => setDeleteModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium"
//                       onClick={handleDeleteUser}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//             {suspendModal && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                 <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
//                   <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
//                   <p className="mb-6 text-base text-[#444]">
//                     You are about to suspend this user.
//                     <br />
//                     Are you sure you want to perform this action?
//                     <br />
//                     <span className="font-medium">
//                       This will restrict the user's access.
//                     </span>
//                   </p>
//                   <div className="flex gap-4 justify-center">
//                     <button
//                       className="px-6 py-2 rounded-lg text-[#444] font-medium border-2"
//                       onClick={() => setSuspendModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium"
//                       onClick={handleSuspendUser}
//                     >
//                       Confirm
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//             {enableModal && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//                 <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto text-center">
//                   <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
//                   <p className="mb-6 text-base text-[#444]">
//                     You are about to enable this user.
//                     <br />
//                     Are you sure you want to perform this action?
//                     <br />
//                     <span className="font-medium">
//                       This will restore the user's access.
//                     </span>
//                   </p>
//                   <div className="flex gap-4 justify-center">
//                     <button
//                       className="px-6 py-2 rounded-lg text-[#444] font-medium border-2"
//                       onClick={() => setEnableModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium"
//                       onClick={handleEnableUser}
//                     >
//                       Confirm
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default UserDetailsPage;
