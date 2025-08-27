import { useState, useMemo } from "react";
import DashboardTitle from "../shared/DashboardTitle";
import MySalesActivity from "./components/desktop/MySalesActivity";
// ui
import { Button } from "@/components/ui/button";
import { VscRefresh } from "react-icons/vsc";
import { useTransactionsStore } from "@/stores/useTransactionStore";

import { useAuthStore } from "@/stores/useAuthStore";
import MobileSalesActivity from "./components/mobile/MobileSalesActivity";

const StaffSales = () => {
  const transactions = useTransactionsStore(
    (state) => state.transactions ?? []
  );
  console.log(transactions);
  const [filter, setFilter] = useState<"today" | "week" | "month">("today");
  const { user } = useAuthStore();
  console.log(user?.branchId);

  // filter transaction
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions?.filter((tx) => {
      const txDate = new Date(tx.createdAt);

      if (filter === "today") {
        return (
          txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return txDate >= startOfWeek && txDate <= endOfWeek;
      }

      if (filter === "month") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [transactions, filter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between gap-3">
        <DashboardTitle
          heading="My Sales"
          description="View your sales activity"
        />

        {/* buttons */}
        <div className="flex gap-5">
          <Button
            variant="tertiary"
            onClick={() => window.location.reload()}
            className="min-w-40 border-[#7d7d7d]"
          >
            <VscRefresh />
            Refresh
          </Button>
          <Button className="min-w-40">
            <img src="/icons/brick.svg" alt="" className="w-4" />
            Add Waybill
          </Button>
        </div>
      </div>

      {/* sales activity */}
      <section className="bg-white border rounded-[10px] md:mx-4 mt-5">
        <div className="flex justify-between items-center h-[72px] border px-2 md:px-10 py-6">
          <h4 className="hidden md:block font-medium text-lg text-[#1E1E1E] font-Inter">
            Your Sales Activity
          </h4>
          <div className="flex gap-3 items-center">
            {["today", "week", "month"].map((f) => (
              <p
                key={f}
                onClick={() => setFilter(f as "today" | "week" | "month")}
                className={`cursor-pointer px-5 py-3 rounded-[2px] text-sm font-Inter ${
                  filter === f
                    ? "bg-[#D8E5FE] text-[#3D80FF]"
                    : "bg-transparent text-[#444444]"
                }`}
              >
                {f === "today"
                  ? "Today"
                  : f === "week"
                  ? "This Week"
                  : "This Month"}
              </p>
            ))}
          </div>
        </div>
        <MySalesActivity filteredTransactions={filteredTransactions} />
        <MobileSalesActivity filteredTransactions={filteredTransactions} />
      </section>
    </div>
  );
};

export default StaffSales;
