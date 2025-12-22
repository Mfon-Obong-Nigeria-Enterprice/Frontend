/** @format */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChartDaily from "./BarChartDaily";
import BarChartWeekly from "./BarChartWeekly";
import BarChartMonthly from "./BarChartMonthly";
import { BarChart3, TrendingUp } from "lucide-react";
import { useTransactionsStore } from "@/stores/useTransactionStore";

// Empty State Component
function EmptyOverviewState({ period }: { period: string }) {
  return (
    <div className="w-full py-16 px-4 text-center min-h-[300px] flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
        <BarChart3 className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-3">
        No {period} Sales Data
      </h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        Start making sales to see your {period.toLowerCase()} performance
        metrics here. Your sales analytics will help you track business growth
        and identify trends.
      </p>
      <div className="flex items-center justify-center text-xs text-gray-400">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>Charts will automatically update as you record sales</span>
      </div>
    </div>
  );
}

const SalesOverview = () => {
  const transactions = useTransactionsStore((state) => state.transactions);

  // Check if there are any sales transactions
  const hasSalesData =
    transactions &&
    transactions.length > 0 &&
    transactions.some((t) => t.type === "PURCHASE" || t.type === "PICKUP");

  return (
    <div className="bg-white rounded-xl px-4 sm:px-8 py-6 font-Inter">
      <Tabs defaultValue="daily">
        {/* UPDATED: Use Grid layout instead of Flex to prevent squeezing on tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-4 sm:gap-0 mb-6">
          <TabsList className="bg-transparent p-0 justify-start">
            <p className="text-base sm:text-xl font-medium text-[var(--cl-text-dark)] whitespace-nowrap">
              Sales overview
            </p>
          </TabsList>

          <TabsList className="bg-transparent justify-start sm:justify-end w-full">
            <TabsTrigger
              value="daily"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF]"
            >
              <span className="inline-flex items-center h-full w-full px-3 md:px-6 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Daily
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF]"
            >
              <span className="inline-flex items-center h-full w-full px-3 md:px-6 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Weekly
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="monthly"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF]"
            >
              <span className="inline-flex items-center h-full w-full px-3 md:px-6 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Monthly
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily">
          {hasSalesData ? (
            <BarChartDaily yAxisRange={[0, 5000000]} />
          ) : (
            <EmptyOverviewState period="Daily" />
          )}
        </TabsContent>
        <TabsContent value="weekly">
          {hasSalesData ? (
            <BarChartWeekly yAxisRange={[0, 10000000]} />
          ) : (
            <EmptyOverviewState period="Weekly" />
          )}
        </TabsContent>
        <TabsContent value="monthly">
          {hasSalesData ? (
            <BarChartMonthly yAxisRange={[0, 50000000]} />
          ) : (
            <EmptyOverviewState period="Monthly" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesOverview;