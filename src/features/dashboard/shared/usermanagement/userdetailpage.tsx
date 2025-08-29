import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// components
import UserAccountDetails from "./useraccountdetails";

// hooks
import { useGoBack } from "@/hooks/useGoBack";

// stores
import { useUserStore } from "@/stores/useUserStore";
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";

// services
import { deleteUser, suspendUser, enableUser } from "@/services/userService";

// ui components
import { Button } from "@/components/ui/button";

// icons
import { ChevronLeft, ChevronRight, MapPin, Trash2 } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineCall } from "react-icons/md";
import { RiCalendar2Line } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const goback = useGoBack();

  const {
    users,
    removeUser,
    suspendUser: suspend,
    enableUser: enable,
  } = useUserStore();

  const activityLogs = useActivityLogsStore((s) => s.activities);

  // Get the passed data from navigation state
  const { userData, activities, lastLogin, activityCount } =
    location.state || {};

  // Fallback: if no state passed, fetch from store
  const user = userData || users.find((u) => u._id === id);

  // If no activities passed, fetch from store
  const userActivities =
    activities ||
    activityLogs.filter(
      (log) => log.performedBy === user?._id || log.performedBy === user?.email
    );

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(id!),
    onSuccess: () => {
      removeUser(id!);
      toast.success("User deleted successfully");
      navigate(-1);
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const suspendMutation = useMutation({
    mutationFn: () => suspendUser(id!),
    onSuccess: () => {
      suspend(id!);
      toast.success("User suspended successfully");
    },
    onError: () => toast.error("Failed to suspend user"),
  });

  const enableMutation = useMutation({
    mutationFn: () => enableUser(id!),
    onSuccess: () => {
      enable(id!);
      toast.success("User enabled successfully");
    },
    onError: () => toast.error("Failed to enable user"),
  });

  // Fallback if no user found
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-lg text-[#444] mt-20">Loading user details...</div>
      </div>
    );
  }

  return (
    <section>
      {/* breadcrumb */}
      <p className="flex items-center gap-0.5 text-sm text-[#444444]">
        <span onClick={goback} className="hover:underline cursor-pointer">
          User management
        </span>
        <ChevronRight className="size-3" />
        <span> View User Data</span>
      </p>

      {/* heading */}
      <div className="flex justify-between items-center mt-10 ">
        <h4 className="text-2xl font-bold text-[#333]">User Details</h4>
        <div className="flex gap-5">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ChevronLeft /> Back to user list
          </Button>
          <Button
            variant="blueoutline"
            onClick={() => suspendMutation.mutate()}
          >
            Suspend user
          </Button>
          <Button variant="blueoutline" onClick={() => enableMutation.mutate()}>
            Enable user
          </Button>
          <Button className="">Reset Password</Button>
          <Button variant="destructive" onClick={() => deleteMutation.mutate()}>
            <Trash2 /> Delete User
          </Button>
        </div>
      </div>

      {/* top user info */}
      <div className="grid grid-cols-1 md:grid-cols-[10fr_50fr_50fr] gap-10 mt-[36px] bg-white rounded-[10px] px-7 py-7 backdrop-blur-2xl">
        {/* image */}
        <div className="w-[94px] h-[94px] rounded-full overflow-hidden">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* details with name, status, email*/}
        <article>
          <div className="flex justify-between gap-5">
            <div className="flex gap-5">
              <div>
                <h6 className="text-[28px] font-medium text-[#333333]">
                  {user?.name}
                </h6>
                <p className="text-[#333333]">{user?.email}</p>
              </div>
              <span
                className={`inline-flex justify-center items-center mt-2 text-sm min-w-[67px] h-[28px] rounded-full p-2.5 ${
                  user.isBlocked
                    ? "bg-[#FFCACA] text-[#F95353]"
                    : user.isActive
                    ? "bg-[#E2F3EB] text-[#1AD410]"
                    : "bg-[#FFE7A4] text-[#F39C12]"
                }`}
              >
                {user.isBlocked
                  ? "Suspended"
                  : user.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
          </div>

          {/* role + branch */}
          <div className="mt-8 flex gap-5">
            <p className="flex items-center-safe gap-1 text-[#333333] text-xs">
              <FaRegUser className="size-2.5" />
              <span className="capitalize">
                Role: {user.role.toLowerCase()}
              </span>
            </p>
            <div className="flex items-center-safe gap-1 text-[#333333] text-xs">
              <MapPin className="size-2.5" />
              <span className="capitalize">Location: {user.branch}</span>
            </div>
          </div>
        </article>

        {/* phone + extra */}
        <article className="flex flex-col justify-between">
          <div className="flex items-center gap-3 w-fit border border-[#d9d9d9] p-4 rounded-[8px] text-[#333333]">
            <MdOutlineCall className="size-4.5" />
            <span>Cell: {user?.phone}</span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center-safe gap-1">
              <RiCalendar2Line className="size-2.5" />
              <span className="text-[#333333] text-xs">
                Created: {new Date(user.createdAt).toDateString()}
              </span>
            </div>
            <p className="h-3.5 w-[1px] bg-[#7D7D7D]"></p>
            <div className="flex items-center-safe gap-1">
              <HiUsers className="size-2.5" />
              <p className="text-[#333333] text-xs">
                Department:{" "}
                <span>
                  {user.role === "STAFF"
                    ? "Sales"
                    : user.role === "ADMIN"
                    ? "Administration"
                    : "System maintainance"}
                </span>
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* account details + activities */}
      <UserAccountDetails
        user={user}
        activities={userActivities}
        lastLogin={lastLogin}
        activityCount={activityCount}
      />
    </section>
  );
};

export default UserDetailsPage;

// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";

// // components
// import UserAccountDetails from "./useraccountdetails";

// // hooks
// import { useGoBack } from "@/hooks/useGoBack";

// // stores
// import { useUserStore } from "@/stores/useUserStore";
// import { useActivityLogsStore } from "@/stores/useActivityLogsStore";

// // services
// import { deleteUser, suspendUser, enableUser } from "@/services/userService";

// // ui components
// import { Button } from "@/components/ui/button";

// // icons
// import { ChevronLeft, ChevronRight, MapPin, Trash2 } from "lucide-react";
// import { FaRegUser } from "react-icons/fa";
// import { MdOutlineCall } from "react-icons/md";
// import { RiCalendar2Line } from "react-icons/ri";
// import { HiUsers } from "react-icons/hi";

// const UserDetailsPage = ({ userId }: { userId: string }) => {
//   const { id } = useParams<{ id?: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const goback = useGoBack();
//   // const  = useUserStore((s) => s.users);
//   const {
//     users,
//     removeUser,
//     suspendUser: suspend,
//     enableUser: enable,
//   } = useUserStore();

//   // Get the passed data from navigation state
//   const { userData, activities, lastLogin, activityCount } =
//     location.state || {};

//   // Fallback: if no state passed, you can still fetch from stores

//   const user = userData || users.find((u) => u._id === id);

//   const deleteMutation = useMutation({
//     mutationFn: () => deleteUser(userId),
//     onSuccess: () => {
//       removeUser(userId);
//       toast.success("User deleted successfully");
//     },
//     onError: () => toast.error("Failed to delete user"),
//   });

//   const suspendMutation = useMutation({
//     mutationFn: () => suspendUser(userId),
//     onSuccess: () => {
//       suspend(userId);
//       toast.success("User suspended successfully");
//     },
//     onError: () => toast.error("Failed to suspend user"),
//   });

//   const enableMutation = useMutation({
//     mutationFn: () => enableUser(userId),
//     onSuccess: () => {
//       enable(userId);
//       toast.success("User enabled successfully");
//     },
//     onError: () => toast.error("Failed to enable user"),
//   });

//   //  fallback if there's no user
//   if (!user) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center">
//         <div className="text-lg text-[#444] mt-20">Loading user details...</div>
//       </div>
//     );
//   }

//   return (
//     <section>
//       <p className="flex items-center gap-0.5 text-sm text-[#444444]">
//         <span onClick={goback} className="hover:underline cursor-pointer">
//           User management
//         </span>
//         <ChevronRight className="size-3" />
//         <span> View User Data</span>
//       </p>
//       {/* heading */}
//       <div className="flex justify-between items-center mt-10 ">
//         <h4 className="text-2xl font-bold text-[#333]">User Details</h4>
//         <div className="flex gap-5">
//           <Button variant="outline" onClick={() => navigate(-1)}>
//             <ChevronLeft /> Back to user list
//           </Button>
//           <Button
//             variant="blueoutline"
//             onClick={() => suspendMutation.mutate()}
//             className=""
//           >
//             Suspend user
//           </Button>
//           <Button
//             variant="blueoutline"
//             onClick={() => enableMutation.mutate()}
//             className=""
//           >
//             Enable user
//           </Button>
//           <Button className="">Reset Password</Button>
//           <Button
//             variant="destructive"
//             onClick={() => deleteMutation.mutate()}
//             className=""
//           >
//             <Trash2 />
//             Delete User
//           </Button>
//         </div>
//       </div>

//       {/* I have three divs, one for image, one for the user name and email and the last for phone number */}
//       <div className="grid grid-cols-1 md:grid-cols-[10fr_50fr_50fr] gap-10 mt-[36px] bg-white rounded-[10px] px-7 py-7 backdrop-blur-2xl">
//         {/* image */}
//         <div className="w-[94px] h-[94px] rounded-full overflow-hidden">
//           <img
//             src={user?.profilePicture}
//             alt={user?.name}
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//         </div>

//         {/* details with name, active status and email*/}
//         <article>
//           <div className="flex justify-between gap-5">
//             {/* name and email details */}
//             <div className="flex gap-5">
//               <div>
//                 <h6 className="text-[28px] font-medium text-[#333333]">
//                   {user?.name}
//                 </h6>
//                 <p className="text-[#333333]">{user?.email}</p>
//               </div>
//               <span
//                 className={`inline-flex justify-center items-center mt-2 text-sm min-w-[67px] h-[28px] rounded-full p-2.5 ${
//                   user.isBlocked
//                     ? "bg-[#FFCACA] text-[#F95353]"
//                     : user.isActive
//                     ? "bg-[#E2F3EB] text-[#1AD410]"
//                     : "bg-[#FFE7A4] text-[#F39C12]"
//                 }`}
//               >
//                 {user?.isBlocked
//                   ? "Suspended"
//                   : user.isActive
//                   ? "Active"
//                   : "Inactive"}
//               </span>
//             </div>
//           </div>

//           {/* other identifiers */}
//           <div className="mt-8 flex gap-5">
//             <p className="flex items-center-safe gap-1 text-[#333333] text-xs">
//               <FaRegUser className="size-2.5" />
//               <span className="capitalize">
//                 Role: {user.role.toLowerCase()}
//               </span>
//             </p>

//             {/* user location */}
//             <div className="flex items-center-safe gap-1 text-[#333333] text-xs">
//               <MapPin className="size-2.5" />
//               <span className="capitalize">Location: {user.branch}</span>
//             </div>
//           </div>
//         </article>

//         {/* phone details */}
//         <article className="flex flex-col justify-between">
//           <div className="flex items-center gap-3 w-fit border border-[#d9d9d9] p-4 rounded-[8px] text-[#333333]">
//             <MdOutlineCall className="size-4.5" />
//             <span className="">Cell: {user?.phone}</span>
//           </div>

//           {/* other details */}
//           <div className="flex gap-4">
//             {/* date created */}
//             <div className="flex items-center-safe gap-1">
//               <RiCalendar2Line className="size-2.5" />
//               <span className="text-[#333333] text-xs">
//                 Created: {new Date(user.createdAt).toDateString()}
//               </span>
//             </div>
//             <p className="h-3.5 w-[1px] bg-[#7D7D7D]"></p>

//             {/* department */}
//             <div className="flex items-center-safe gap-1">
//               <HiUsers className="size-2.5" />
//               <p className="text-[#333333] text-xs">
//                 Department:{" "}
//                 <span>
//                   {user.role === "STAFF"
//                     ? "Sales"
//                     : user.role === "ADMIN"
//                     ? "Administration"
//                     : "System maintainance"}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </article>
//       </div>

//       {/* user account details and activities */}
//       <UserAccountDetails
//         user={user}
//         activities={activities}
//         lastLogin={lastLogin}
//         activityCount={activityCount}
//       />

//       {/* Export button */}
//       <div className="mt-10 flex justify-end">
//         <Button
//           variant="outline"
//           size="sm"
//           className="!bg-white border border-[#d7d7d7] flex items-center gap-2 py-5"
//           // onClick={handleExportUserReport} // Call the export function on click
//         >
//           Export User Report
//         </Button>
//       </div>
//     </section>
//   );
// };

// export default UserDetailsPage;
