import React from "react";
import Stats from "../../shared/Stats";
import type { StatCard } from "@/types/stats";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { formatChangeText, getChangeText } from "@/utils/helpersfunction";
import { useClientStore } from "@/stores/useClientStore";

const StaffStats: React.FC = () => {
  const { transactions, getTodaysSales, getSalesPercentageChange } =
    useTransactionsStore();
  const { getActiveClients, getTotalClientsPercentageChange } =
    useClientStore();

  const todaysSales = getTodaysSales();
  const dailyChange = getSalesPercentageChange();
  const activeClients = getActiveClients();
  const totalClientsChange = getTotalClientsPercentageChange();
  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: `₦${todaysSales.toLocaleString()}`,
      statValue: getChangeText(
        dailyChange.percentage,
        dailyChange.direction,
        "yesterday"
      ),
      color:
        dailyChange.direction === "increase"
          ? "green"
          : dailyChange.direction === "decrease"
          ? "red"
          : "orange",
    },
    {
      heading: "Transaction handled",
      salesValue: `${transactions?.length || 0}`,
      color: "green",
    },
    {
      heading: "Active Clients Served",
      salesValue: `${activeClients}`,
      hideArrow: true,
      statValue: formatChangeText(totalClientsChange, "last month"),
      color:
        totalClientsChange.direction === "increase"
          ? "green"
          : totalClientsChange.direction === "decrease"
          ? "red"
          : "blue",
    },
  ];
  return (
    <div className="pb-4">
      <Stats data={stats} />
    </div>
  );
};

export default StaffStats;
