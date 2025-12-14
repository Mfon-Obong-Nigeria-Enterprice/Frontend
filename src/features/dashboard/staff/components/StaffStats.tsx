//src\features\dashboard\staff\components\StaffStats.tsx
import React, { useEffect, useState } from "react";
import Stats from "../../shared/Stats";
import type { StatCard } from "@/types/stats";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import * as Helpers from "@/utils/helpersfunction"; 
import { useClientStore } from "@/stores/useClientStore";

const StaffStats: React.FC = () => {
  const [, setLastRefresh] = useState<Date | null>(null);

  // Get store instances
  const transactionsStore = useTransactionsStore();
  const clientStore = useClientStore();

  // Extract functions with safe optional chaining
  const {
    getTodaysSales,
    getSalesPercentageChange,
    getTodaysTransactionCount,
    getYesterdaysTransactionCount,
    refreshTransactions
  } = transactionsStore;

  const {
    getActiveClients,
    getNewClientsThisMonth,
    getNewClientsLastMonth,
    refreshClients
  } = clientStore;

  // Automatic refresh on component mount
  useEffect(() => {
    const refreshData = async () => {
      try {
        await Promise.allSettled([
          refreshTransactions?.(),
          refreshClients?.()
        ]);
        setLastRefresh(new Date());
       
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    };

    refreshData();
  }, [refreshTransactions, refreshClients]);

  // Get all the dynamic data
  const todaysSales = getTodaysSales();
  const dailySalesChange = getSalesPercentageChange();
  const activeClients = getActiveClients();
  const todaysTransactionCount = getTodaysTransactionCount();
  const yesterdaysTransactionCount = getYesterdaysTransactionCount();
  const newClientsThisMonth = getNewClientsThisMonth();
  const newClientsLastMonth = getNewClientsLastMonth();

  // Calculate transaction count percentage change
  const transactionCountChange = calculatePercentageChange(
    todaysTransactionCount,
    yesterdaysTransactionCount
  );

  // Calculate new clients percentage change
  const newClientsChange = calculatePercentageChange(
    newClientsThisMonth,
    newClientsLastMonth
  );

  // Dynamic chart data
  const salesHistory = [
    Math.max(0, Math.round((todaysSales * 0.2) / 1000)),
    Math.max(0, Math.round((todaysSales * 0.4) / 1000)),
    Math.max(0, Math.round((todaysSales * 0.6) / 1000)),
    Math.max(0, Math.round((todaysSales * 0.8) / 1000)),
    Math.max(0, Math.round((todaysSales * 0.9) / 1000)),
    Math.max(0, Math.round((todaysSales * 0.95) / 1000)),
    Math.max(0, Math.round(todaysSales / 1000)),
  ];

  const transactionsHistory = [
    Math.max(1, Math.round(todaysTransactionCount * 0.2)),
    Math.max(1, Math.round(todaysTransactionCount * 0.4)),
    Math.max(1, Math.round(todaysTransactionCount * 0.6)),
    Math.max(1, Math.round(todaysTransactionCount * 0.8)),
    Math.max(1, Math.round(todaysTransactionCount * 0.9)),
    Math.max(1, Math.round(todaysTransactionCount * 0.95)),
    todaysTransactionCount,
  ];

  const clientsHistory = [
    Math.max(1, Math.round(activeClients * 0.2)),
    Math.max(1, Math.round(activeClients * 0.4)),
    Math.max(1, Math.round(activeClients * 0.6)),
    Math.max(1, Math.round(activeClients * 0.8)),
    Math.max(1, Math.round(activeClients * 0.9)),
    Math.max(1, Math.round(activeClients * 0.95)),
    activeClients,
  ];

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: todaysSales,
      statValue: Helpers.getChangeText(
        dailySalesChange.percentage,
        dailySalesChange.direction,
        "yesterday"
      ),
      color: "green",
      chartType: "line",
      chartData: salesHistory,
      format: "currency",
    },
    {
      heading: "Transactions Handled",
      salesValue: todaysTransactionCount,
      statValue: Helpers.getChangeText(
        transactionCountChange.percentage,
        transactionCountChange.direction,
        "yesterday"
      ),
      color: "orange",
      displayType: "circular", 
      percentage: transactionCountChange.percentage, 
      chartType: "bar",
      chartData: transactionsHistory,
      format: "number",
    },
    {
      heading: "Active Clients Served",
      salesValue: activeClients,
      statValue: Helpers.getChangeText(
        newClientsChange.percentage,
        newClientsChange.direction,
        "yesterday"
      ),
      color: "blue",
      chartType: "bar",
      chartData: clientsHistory,
      format: "number",
    },
  ];

  return (
    <div className="pb-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>
        
      </div>

      <div className="">

      <Stats data={stats}/>
      </div>
     
    </div>
  );
};

// Helper function for percentage change calculation
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0 && current === 0) {
    return { percentage: 0, direction: "no-change" as const };
  }
  if (previous === 0 && current > 0) {
    return { percentage: 100, direction: "increase" as const };
  }
  if (previous > 0 && current === 0) {
    return { percentage: -100, direction: "decrease" as const };
  }

  const percentageChange = ((current - previous) / previous) * 100;
  return {
    percentage: Math.round(Math.abs(percentageChange) * 100) / 100,
    direction: percentageChange > 0 ? "increase" as const : percentageChange < 0 ? "decrease" as const : "no-change" as const,
  };
};

export default StaffStats;