import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChartDaily from "./BarChartDaily";
import BarChartWeekly from "./BarChartWeekly";
import BarChartMonthly from "./BarChartMonthly";

// This is the sales overview on the dashboard screen
const SalesOverview = () => {
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

        <TabsContent value="title">
          <BarChartDaily />
        </TabsContent>
        <TabsContent value="daily">
          <BarChartDaily />
        </TabsContent>
        <TabsContent value="weekly">
          <BarChartWeekly />
        </TabsContent>
        <TabsContent value="monthly">
          <BarChartMonthly />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesOverview;
