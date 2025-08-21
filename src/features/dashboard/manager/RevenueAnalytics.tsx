import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChevronDown,
  MoreVertical,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import { useRevenueSelectors, useRevenueStore } from "@/stores/useRevenueStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { StatCard } from "@/types/stats";

// Mock data for charts
const monthlyTrendData = [
  { month: "May", value: 300000 },
  { month: "Jun", value: 350000 },
  { month: "Jul", value: 400000 },
  { month: "Aug", value: 380000 },
  { month: "Sep", value: 420000 },
  { month: "Oct", value: 450000 },
  { month: "Nov", value: 480000 },
  { month: "Dec", value: 460000 },
  { month: "Jan", value: 500000 },
  { month: "Feb", value: 520000 },
  { month: "Mar", value: 550000 },
  { month: "Apr", value: 580000 },
  { month: "May", value: 600000 },
];

const yearOverYearData = [
  { month: "Jan", "2024": 15, "2025": 35 },
  { month: "Feb", "2024": 18, "2025": 40 },
  { month: "Mar", "2024": 25, "2025": 45 },
  { month: "Apr", "2024": 30, "2025": 50 },
  { month: "May", "2024": 40, "2025": 55 },
  { month: "Jun", "2024": 45, "2025": 52 },
];

const pieData = [
  { name: "Tier", value: 35, color: "#10B981" },
  { name: "Prod", value: 28, color: "#F59E0B" },
  { name: "Content", value: 37, color: "#EF4444" },
];

const paymentMethods = [
  {
    method: "Cash",
    revenue: "₦300,000",
    amount: 300000,
    color: "text-green-600",
  },
  {
    method: "Bank Transfer",
    revenue: "₦450,000",
    amount: 450000,
    color: "text-green-600",
  },
  {
    method: "Credit (Pay Later)",
    revenue: "₦125,000",
    amount: 125000,
    color: "text-red-600",
  },
];

export default function RevenueAnalytics() {
  const { error, getAllRevenueData, clearError, ytdRevenue, monthlyRevenue } =
    useRevenueStore();
  const { isAnyLoading } = useRevenueSelectors();

  const stats: StatCard[] = [
    {
      heading: "Total Revenue (YTD)",
      salesValue: `₦${ytdRevenue?.totalRevenue.toLocaleString()}`,
      statValue: `${
        ytdRevenue?.direction === "increase"
          ? "+"
          : ytdRevenue?.direction === "decrease"
          ? "-"
          : ""
      }${ytdRevenue?.percentageChange}%`,
      color:
        ytdRevenue?.direction === "increase"
          ? "green"
          : ytdRevenue?.direction === "decrease"
          ? "red"
          : "orange",
    },
    {
      heading: "Previous Month ",
      salesValue: `₦${monthlyRevenue?.totalRevenue.toLocaleString()}`,
    },
    {
      heading: " Growth Rate (MOM)",
      salesValue: `${
        monthlyRevenue?.direction === "increase"
          ? "+"
          : monthlyRevenue?.direction === "decrease"
          ? "-"
          : ""
      }${monthlyRevenue?.percentageChange}%`,
      salesColor: "blue",
      percentage: Math.min(monthlyRevenue?.percentageChange ?? 0, 100), // Cap at 100% for circular display
      displayType: "circular",
    },
  ];

  //load data on mount
  useEffect(() => {
    getAllRevenueData();
  }, [getAllRevenueData]);

  // Handle error display
  useEffect(() => {
    if (error) {
      console.error("Revenue Analytics Error:", error);
      // You could show a toast notification here
      toast.error(error);
    }
  }, [error]);

  //
  // LoadingSkeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );

  //
  return (
    <div className="min-h-screen p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <DashboardTitle
            heading="Revenue Analytics"
            description="welcome back! Here’s your revenue performance"
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <span className="text-sm font-medium">Last 12 month</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
              <TrendingUp className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-sm font-medium">Error loading data:</span>
                <span className="text-sm">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-700 hover:text-red-900 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnyLoading() ? <LoadingSkeleton /> : <Stats data={stats} />}

        <div className="space-y-4 sm:space-y-6">
          {/* First Row: Monthly Revenue Trend and Year-Over-Year taking 70% on large screens */}
          <div className="grid md:grid-cols-1 xl:grid-cols-6 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="w-full xl:col-span-4 lg:col-span-3 space-y-4 sm:space-y-6">
              {/* Monthly Revenue Trend */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Monthly Revenue Trend
                  </h3>
                  <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <XAxis
                        dataKey="month"
                        axisLine={true}
                        tickLine={false}
                        className="text-xs text-[#D9D9D9]"
                      />
                      <YAxis hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#3B82F6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Year Over Year Comparison */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Year - Over - Year Comparison
                  </h3>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500"></div>
                      <span>2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500"></div>
                      <span>2025</span>
                    </div>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearOverYearData} barCategoryGap="20%">
                      <XAxis
                        dataKey="month"
                        axisLine={true}
                        tickLine={false}
                        className="text-xs text-[#D9D9D9]"
                      />
                      <YAxis
                        axisLine={true}
                        tickLine={false}
                        className="text-xs text-[#D9D9D9]"
                      />
                      <Bar
                        dataKey="2024"
                        fill="#EF4444"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="2025"
                        fill="#3B82F6"
                        radius={[0, 0, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="w-full xl:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
              <div className=" grid md:grid-cols-2 lg:grid-cols-1 space-y-4  gap-2 transition-all">
                {/* Revenue by Payment Method */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                  <h3 className="text-[16px] lg:text-lg font-semibold text-gray-900 mb-2">
                    Revenue by Payment method
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
                      <span>Method</span>
                      <span>Revenue</span>
                    </div>

                    {paymentMethods.map((method, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-4 items-center py-2 border-b border-gray-200 pb-2"
                      >
                        <span className="text-sm text-gray-900">
                          {method.method}
                        </span>
                        <span
                          className={`text-sm font-semibold ${method.color}`}
                        >
                          {method.revenue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discount Impact */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm  flex flex-col ">
                  <h3 className="lg:text-lg text-[16px] font-semibold text-gray-900 mb-4">
                    Discount Impact
                  </h3>

                  <div className="space-y-4 flex flex-col ">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Avg. Discount:
                      </span>
                      <span className="text-sm font-semibold">7%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Revenue Lift:
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          12%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Margin Impact:
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">
                          3%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" space-y-4 sm:space-y-6">
                {/* Product Margin */}
                <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-6 shadow-sm relative">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Margin
                  </h3>

                  <div className="flex items-center lg:justify-start justify-center ">
                    <div className="relative w-32 h-32 mb-5 sm:mb-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={60}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-2 absolute right-3 bottom-1.5 flex gap-4 md:gap-0 justify-between lg:flex-col  ">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 "></div>
                        <span className="text-sm text-gray-600">Tiles</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 "></div>
                        <span className="text-sm text-gray-600">Rod</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 "></div>
                        <span className="text-sm text-gray-600">Cement</span>
                      </div>
                    </div>
                  </div>
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
