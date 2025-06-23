import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChartDaily from "./BarChartDaily";
import BarChartWeekly from "./BarChartWeekly";
import BarChartMonthly from "./BarChartMonthly";

// This is the sales overview on the dashboard screen
const SalesOverview = () => {
  return (
    <div className=" bg-white rounded-xl px-8 py-6 font-Inter">
      <Tabs defaultValue="daily" className="">
        <div className="grid grid-cols-[50fr_70fr]">
          <TabsList className="bg-transparent">
            <p className=" text-xl font-medium text-[var(--cl-text-dark)]">
              Sales overview
            </p>
          </TabsList>

          <TabsList className="bg-transaprent">
            <TabsTrigger
              value="daily"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF] p-0"
            >
              <span className="px-6 py-4 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Daily
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF] p-0"
            >
              <span className="px-6 py-4 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
                Weekly
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="monthly"
              className="bg-transparent data-[state=active]:[&_span]:bg-[#D8E5FE] data-[state=active]:[&_span]:text-[#3D80FF]  p-0"
            >
              <span className="px-6 py-4 text-[var(--cl-text-gray)] text-[0.875rem] rounded">
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
