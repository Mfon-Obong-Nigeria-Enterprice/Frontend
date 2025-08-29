import { format } from "date-fns";
import type { CompanyUser } from "@/stores/useUserStore";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";

interface UserAccountDetailsProps {
  user: CompanyUser;
  activities: ActivityLogs[];
  lastLogin: string | null;
  activityCount: number;
  // onDelete: (id: string) => void;
  // onSuspend: (id: string) => void;
  // onEnable: (id: string) => void;
}

const UserAccountDetails = ({
  user,
  activities,
  lastLogin,
  activityCount,
}: UserAccountDetailsProps) => {
  return (
    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full mt-10">
      {/* Account details */}
      <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full">
        <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
          Account Details
        </h6>
        <hr className="border-[#F0F0F0] mb-4" />
        <div className="divide-y divide-[#F0F0F0] px-6">
          <p className="flex justify-between text-base text-[#444] py-3">
            <span>Created Date:</span>
            <span>{new Date(user.createdAt).toDateString()}</span>
          </p>
          <p className="flex justify-between text-base text-[#444] py-3">
            <span>Last login:</span>
            <span>
              {lastLogin ? format(new Date(lastLogin), "PPpp") : "Never"}
            </span>
          </p>
          <p className="flex justify-between text-base text-[#444] py-3">
            <span>Total logins:</span>
            <span>{activityCount || 0}</span>
          </p>
          <p className="flex justify-between text-base text-[#444] py-3">
            <span>Address:</span>
            <span>{user.address || "N/A"}</span>
          </p>
          <p className="flex justify-between text-base text-[#444] py-3">
            <span>Sales recorded:</span>
            <span>--</span>
          </p>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full">
        <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
          Staff Activities
        </h6>
        <hr className="border-[#F0F0F0] mb-4" />
        <ul className="divide-y divide-[#F0F0F0] px-6">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity._id} className="py-2">
                <p className="text-base text-[#444] mb-1">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(activity.timestamp), "PPpp")}
                </p>
              </li>
            ))
          ) : (
            <p className="text-sm text-[#7d7d7d]">No activity logs</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserAccountDetails;

// import { useActivityLogsStore } from "@/stores/useActivityLogsStore";

// const UserAccountDetails = ({ user, activities, lastLogin, activityCount }) => {
//   const activityLogs = useActivityLogsStore((s) => s.activities);

//   const userActivities =
//     activities ||
//     activityLogs.filter(
//       (log) => log.performedBy === user?.email || log.performedBy === user?._id
//     );

//   return (
//     <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full mt-10">
//       <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full">
//         <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
//           Account Details
//         </h6>
//         <hr className="border-[#F0F0F0] mb-4 border-1" />
//         <div className="divide-y divide-[#F0F0F0] px-6">
//           {/* created date */}
//           <p className="flex justify-between items-center text-base text-[#444] py-3">
//             <span>Created Date:</span>
//             <span>{new Date(user.createdAt).toDateString()}</span>
//           </p>
//           {/* last login */}
//           <p className="flex justify-between items-center text-base text-[#444] py-3">
//             <span>Last login:</span>
//             <span>{user.lastLogin}</span>
//           </p>

//           {/* total logins */}
//           <p className="flex justify-between items-center text-base text-[#444] py-3">
//             <span>Total logins:</span>
//             {/* <span>{user.lastLogin.length}</span> */}
//           </p>

//           {/* session duration */}
//           <p className="flex justify-between items-center text-base text-[#444] py-3">
//             <span>Session Duration:</span>
//             <span>
//               {/* check if logged time between last login and logout */}
//             </span>
//           </p>

//           {/* address */}
//           <p className="flex justify-between items-center text-base text-[#444] py-3">
//             <span>Address:</span>
//             <span>{user.address}</span>
//           </p>

//           {/* sales recorded */}
//           <p className="flex justify-between items-center text-base text-[#444] py-3">
//             <span>Sales recorded:</span>
//             <span>{}</span>
//           </p>
//         </div>
//       </div>
//       <div className="bg-white rounded-xl shadow py-6 border border-[#F0F0F0] w-full">
//         <h6 className="text-lg font-semibold mb-4 text-[#333] px-6">
//           Staff Activities
//         </h6>
//         <hr className="border-[#F0F0F0] mb-4 border-1" />
//         <ul className="divide-y divide-[#F0F0F0] px-6">
//           {userActivities.map((activity) => (
//             <li>
//               <p className="text-base text-[#444] mb-1">{activity.activity}</p>
//               <p className="text-xs text-muted-foreground mb-2">time</p>
//             </li>
//           ))}
//         </ul>
//         <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
//           {/* <span>Showing 1-4 of {activities.length || 4} Activities</span> */}
//           <div className="flex items-center gap-2">
//             <button
//               className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base"
//               disabled
//             >
//               &#60;
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-[#F5EAEA] text-[#B0B0B0] font-semibold text-base">
//               1
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E0E0E0] bg-white text-[#B0B0B0] text-base">
//               &#62;
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserAccountDetails;
