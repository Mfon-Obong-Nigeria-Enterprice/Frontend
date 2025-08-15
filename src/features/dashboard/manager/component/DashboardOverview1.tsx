// import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
// import Stats1 from "./Stats1";
// import { type StatCard } from "./Stats1";
// import { useTransactionsStore } from "@/stores/useTransactionStore";
// import { ArrowDown, ArrowUp } from "lucide-react";

// const DashboardOverview1: React.FC = () => {
//   const { getTodaysSales, getSalesPercentageChange } = useTransactionsStore();

//   const todaysSales = getTodaysSales();
//   const { percentage, direction } = getSalesPercentageChange();

//   const salesChange =
//     direction === "increase"
//       ? `${(<ArrowUp />)} +${percentage}%`
//       : `${(<ArrowDown />)}${Math.abs(percentage)}%`;

//   const stats: StatCard[] = [
//     {
//       heading: "Total Sales (Today)",
//       salesValue: `₦${todaysSales.toLocaleString()}`,
//       statValue: `${salesChange} from yesterday`,
//       color: "green",
//     },
//     {
//       heading: "M,
//       statValue: "8% onthly Revenue",
//       salesValue: "₦ 446,850"from last month",
//       color: "green",
//     },
//     {
//       heading: "Outstanding balances",
//       salesValue: "₦ 1,355,800",
//       statValue: "5% Clients with overdue balances",
//       color: "orange",
//     },
//   ];
//   return (
//     <div className="">
//       <main className="flex flex-col gap-4 mb-7">
//         <DashboardTitle
//           heading="Manager Dashboard"
//           description="welcome back! Here’s an overview of your business"
//         />
//         <Stats1 data={stats} />
//       </main>
//     </div>
//   );
// };

// export default DashboardOverview1;

// import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
// import Stats1 from "./Stats1";
// import { type StatCard } from "./Stats1";

// const DashboardOverview1: React.FC = () => {
//   const stats: StatCard[] = [
//     {
//       heading: "Total Sales (Today)",
//       salesValue: ,
//       statValue: ,
//       color:
//         direction === "increase"
//           ? "green"
//           : direction === "decrease"
//           ? "red"
//           : "blue",
//     },
//     {
//       heading: "Monthly Revenue",
//       salesValue: "₦0",
//       statValue: "8% from last month",
//       color: "green",
//     },
//     {
//       heading: "Outstanding balances",
//       salesValue: ,
//       statValue: ,
//       color: "orange",
//     },
//   ];

//   return (
//     <div className="">
//       <main className="flex flex-col gap-4 mb-7">
//         <DashboardTitle
//           heading="Manager Dashboard"
//           description="welcome back! Here's an overview of your business"
//         />
//         <Stats1 data={stats} />
//       </main>
//     </div>
//   );
// };

// export default DashboardOverview1;
