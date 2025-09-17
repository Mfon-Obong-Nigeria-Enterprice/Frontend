import React from "react";
import { useState } from "react";
import {
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { getAllTransactions } from "@/services/transactionService";
import { getAllProducts } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function TotalRevenueTrends() {
  const [selectedTab, setSelectedTab] = useState("daily");

  const {
    transactions,
    setTransactions,
    setProducts,
    getDailyRevenueData,
    getWeeklyRevenueData,
    getMonthlyTrendData,
  } = useRevenueStore();

  // Fetch transactions using useQuery
  const {
    data: transactionData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Fetch products using useQuery
  const {
    data: productData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes (products change less frequently)
    retry: 2,
  });

  // Update store when data is fetched
  React.useEffect(() => {
    if (transactionData) {
      setTransactions(transactionData);
    }
  }, [transactionData, setTransactions]);

  React.useEffect(() => {
    if (productData) {
      setProducts(productData);
    }
  }, [productData, setProducts]);

  // Handle errors with toast notifications
  React.useEffect(() => {
    if (transactionsError) {
      console.error("Failed to fetch transactions:", transactionsError);
      toast.error("Failed to load transaction data");
    }
  }, [transactionsError]);

  React.useEffect(() => {
    if (productsError) {
      console.error("Failed to fetch products:", productsError);
      toast.error("Failed to load product data");
    }
  }, [productsError]);

  // Combined loading and error states
  const isLoading = isTransactionsLoading || isProductsLoading;
  // const error = (transactionsError as Error) || (productsError as Error);

  const getData = () => {
    if (!transactions) return [];

    if (selectedTab === "weekly") return getWeeklyRevenueData();
    if (selectedTab === "monthly") return getMonthlyTrendData();
    return getDailyRevenueData();
  };

  // Get the correct data key for the Line component
  const getDataKey = () => {
    return selectedTab === "monthly" ? "value" : "revenue";
  };

  const getYAxisTickFormatter = (value: number) => {
    if (value === 0) return "₦0";

    if (selectedTab === "monthly") {
      if (value >= 1000000) {
        return `₦${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `₦${(value / 1000).toFixed(0)}k`;
      }
    }

    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}k`;
    }

    return `₦${value.toLocaleString()}`;
  };

  const getTooltipFormatter = (value: number) => {
    return [`₦${value.toLocaleString()}`, "Revenue"];
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Loading chart data...</div>
    </div>
  );

  // Debug: Log the data to see what's being passed to the chart
  const chartData = getData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-7xl mx-auto">
      <div className="flex justify-between flex-wrap">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Revenue Trends
          </h2>
          <p className="text-sm text-gray-500">
            Revenue from transactions and product purchases
          </p>
        </div>

        <div className="flex justify-end gap mb-5">
          {["daily", "weekly", "monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-1.5 text-sm capitalize transition-all duration-300 ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full max-w-7xl">
        {isLoading || !transactions ? (
          <LoadingSkeleton />
        ) : chartData.length === 0 ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-gray-400">
              No data available for {selectedTab} view
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={getYAxisTickFormatter}
                domain={["dataMin", "dataMax"]}
              />
              <Tooltip formatter={getTooltipFormatter} />
              <Area
                dataKey={getDataKey()}
                stroke="#3b82f6"
                fill="#96bfff"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Data summary */}
      {transactions && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>Showing {selectedTab} revenue trends</span>
          <span>{chartData.length} data points</span>
        </div>
      )}
    </div>
  );
}

export default TotalRevenueTrends;
