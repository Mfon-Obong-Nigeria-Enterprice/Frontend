// import { TabItem, Tabs } from "flowbite-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChartDaily from "./BarChartDaily";
import BarChartWeekly from "./BarChartWeekly";
import BarChartMonthly from "./BarChartMonthly";

const SalesOverview = () => {
  // const customTheme = {
  //   tablist: {
  //     base: "flex space-x-2 border-b border-gray-200",
  //   },
  //   tab: {
  //     base: "p-4 rounded-t-lg",
  //     active: "bg-blue-500 text-white",
  //     inactive: "bg-gray-200 text-black",
  //   },
  // };

  return (
    <div className=" bg-white rounded-xl px-8 py-6 font-Inter">
      <Tabs defaultValue="daily" className="">
        <div className="grid grid-cols-[50fr_70fr]">
          {/*  grid grid-cols-2 w-full */}
          <TabsList className="bg-transparent">
            {/* <TabsTrigger value="title"> */}
            <p className=" text-xl font-medium text-[var(--cl-text-dark)]">
              Sales overview
            </p>
          </TabsList>
          {/* </TabsTrigger> */}
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
        {/* </div> */}
        {/* </TabsList> */}
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
      {/* <Tabs
        theme={customTheme}
        className="border-none flex justify-between"
        variant="default"
      >
        <TabItem
          disabled
          title={
            <span className="text-xl font-medium text-text-dark">
              Sales Overview
            </span>
          }
          className="text-2xl font-semibold mb-4"
        ></TabItem>
        <TabItem
          active
          aria-selected="true"
          title={
            <span
              className="px-5 py-2.5 rounded-[2px] [&&[aria-selected='true']]:bg-[#D8E5FE] [&[aria-selected='true']]:text-[#3D80FF] text-[0.875rem]"
              aria-selected="true"
            >
              Daily
            </span>
          }
        >
          <BarChartDaily />
        </TabItem>
        <TabItem title={<span className="text-[0.875rem]">Week</span>}>
          <BarChartWeekly />
        </TabItem>
        <TabItem title={<span className="text-[0.875rem]">Month</span>}>
          <BarChartMonthly />
        </TabItem>
      </Tabs> */}
    </div>
  );
};

export default SalesOverview;
