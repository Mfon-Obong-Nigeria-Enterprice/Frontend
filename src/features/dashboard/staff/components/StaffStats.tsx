/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Stats from "../../shared/Stats";
import type { StatCard } from "@/types/stats";
import { useTransactionsStore } from "@/stores/useTransactionStore";

import * as Helpers from "@/utils/helpersfunction"; 
import { useClientStore } from "@/stores/useClientStore";


const mockGetTransactionChange = () => ({
  percentage: 80, 
  direction: 'increase' as const, 
  statText: '4% more than yesterday', 
});

const StaffStats: React.FC = () => {
  const { transactions, getTodaysSales, getSalesPercentageChange } =
    useTransactionsStore();
  const { getActiveClients } =
    useClientStore();

  const todaysSales = getTodaysSales();
  const dailySalesChange = getSalesPercentageChange();
  const activeClients = getActiveClients();

  const dailyTransactionChange = (useTransactionsStore as any).getTransactionChange ? 
    (useTransactionsStore as any).getTransactionChange() : 
    mockGetTransactionChange();
  
  

  const salesHistory = [
    50,
    75,
    60,
    80,
    120,
    140,
    Math.max(0, Math.round(todaysSales / 1000)),
  ];
  const transactionsHistory = [
    2,
    3,
    5,
    4,
    6,
    7,
    Number(transactions?.length || 0),
  ];
  const clientsHistory = [1, 2, 1, 3, 4, 5, Number(activeClients || 0)];

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: `₦${todaysSales.toLocaleString()}`,
    
      statValue: Helpers.getChangeText(
        dailySalesChange.percentage,
        dailySalesChange.direction,
        "yesterday"
      ),
      color:
        dailySalesChange.direction === "increase"
          ? "blue"
          : dailySalesChange.direction === "decrease"
          ? "blue"
          : "blue",
      chartType: "line",
      chartData: salesHistory,
      format: "currency",
    },
    {
      heading: "Transaction handled",
      salesValue: `${transactions?.length || 0}`,
     
      statValue: dailyTransactionChange.statText || Helpers.getChangeText(
        dailyTransactionChange.percentage,
        dailyTransactionChange.direction,
        "yesterday"
      ),
      color: "orange", 
      displayType: "circular", 
      percentage: dailyTransactionChange.percentage, 
      chartType: "bar",
      chartData: transactionsHistory,
      format: "number",
    },
    {
      heading: "Active Clients Served",
      salesValue: `${activeClients}`,
      
      statValue: "3% new client today", 
      color: "blue", 
      chartType: "bar",
      chartData: clientsHistory,
      format: "number",
    },
  ];

  return (
    <div className="pb-4">
      <Stats data={stats}/>
    </div>
  );
};

export default StaffStats;