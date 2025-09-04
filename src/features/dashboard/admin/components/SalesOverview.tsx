import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChartDaily from "./BarChartDaily";
import BarChartWeekly from "./BarChartWeekly";
import BarChartMonthly from "./BarChartMonthly";
import { BarChart3, TrendingUp } from "lucide-react";

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

// This is the sales overview on the dashboard screen
const SalesOverview = ({ hasData = false }: { hasData?: boolean }) => {
  return (
    <div className="bg-white rounded-xl px-4 sm:px-8 py-6 mx-2 font-Inter">
      <Tabs defaultValue="daily">
        <div className="grid grid-cols-[60fr_40fr] sm:grid-cols-[50fr_70fr]">
          <TabsList className="bg-transparent p-0">
            <p className="text-base sm:text-xl font-medium text-[var(--cl-text-dark)]">
              Sales overview
            </p>
          </TabsList>

          <TabsList className="bg-transaprent">
            <TabsTrigger
              value="daily"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF]"
            >
              <span className="inline-flex items-center h-full w-full px-3 sm:px-6 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Daily
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF]"
            >
              <span className="inline-flex items-center h-full w-full px-3 sm:px-6 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Weekly
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="monthly"
              className="data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF]"
            >
              <span className="px-3 sm:px-6 py-2 inline-flex items-center h-full w-full text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Monthly
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="">
          {hasData ? <BarChartDaily /> : <EmptyOverviewState period="Daily" />}
        </TabsContent>
        <TabsContent value="daily">
          {hasData ? <BarChartDaily /> : <EmptyOverviewState period="Daily" />}
        </TabsContent>
        <TabsContent value="weekly">
          {hasData ? (
            <BarChartWeekly />
          ) : (
            <EmptyOverviewState period="Weekly" />
          )}
        </TabsContent>
        <TabsContent value="monthly">
          {hasData ? (
            <BarChartMonthly />
          ) : (
            <EmptyOverviewState period="Monthly" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesOverview;
