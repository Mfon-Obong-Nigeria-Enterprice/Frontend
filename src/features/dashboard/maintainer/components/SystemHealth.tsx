import React, { useEffect, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  useBasicHealth,
  useDetailedHealth,
  useHealthLoading,
  useHealthError,
  useFetchHealth,
} from "@/stores/useHealthStore";

const BAR_COLORS = {
  normal: "#2ECC71",
  high: "#FFA500",
  critical: "#F95353",
};

interface TooltipPayload {
  payload: {
    name: string;
    value: number;
    status: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-md shadow-sm">
        <p className="font-medium text-gray-900 text-xs sm:text-sm">
          {data.name}
        </p>
        <p className="text-gray-700 text-xs sm:text-sm">
          {data.name === "Database" ? `${data.value}ms` : `${data.value}%`}
        </p>
        <p className="text-xs text-gray-500">
          Status:{" "}
          <span
            className={
              data.status === "up" || data.status === "healthy"
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {data.status.toUpperCase()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const SystemHealth: React.FC = () => {
  const basic = useBasicHealth();
  const detailed = useDetailedHealth();
  const loading = useHealthLoading();
  const error = useHealthError();
  const fetchHealth = useFetchHealth();

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const getBarColor = (value: number, status?: string) => {
    if (status === "degraded") return "#FFA500";
    if (value >= 90) return BAR_COLORS.critical;
    if (value >= 80) return BAR_COLORS.high;
    return BAR_COLORS.normal;
  };

  const barChartData = useMemo(() => {
    if (!detailed) return [];

    return [
      {
        name: "Database",
        value: detailed.checks.database.responseTime,
        status: detailed.checks.database.status,
        threshold: 100,
      },
      {
        name: "Memory",
        value: detailed.checks.memory.percentage,
        status: detailed.checks.memory.status,
        threshold: 100,
      },
    ];
  }, [detailed]);

  const showMemoryAlert = useMemo(() => {
    const memoryPercentage = detailed?.checks.memory?.percentage;
    return typeof memoryPercentage === "number" && memoryPercentage >= 80;
  }, [detailed]);

  const renderContent = useMemo(() => {
    if (loading && !basic) {
      return (
        <div className="flex justify-center items-center h-52 lg:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-3 sm:p-4 text-red-500 text-sm">
          Error: {error.message}
        </div>
      );
    }

    if (!basic || !detailed) {
      return (
        <div className="text-center py-6 sm:py-8 text-gray-600 text-sm">
          No health data available.
        </div>
      );
    }

    return (
      <>
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-normal pb-2 sm:pb-4">
            System Health
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
            <div className="flex items-center">
              <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#2ECC71] mr-1 sm:mr-2"></span>
              <span className="whitespace-nowrap">Normal (0-79%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#FFA500] mr-1 sm:mr-2"></span>
              <span className="whitespace-nowrap">High (80-89%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#F95353] mr-1 sm:mr-2"></span>
              <span className="whitespace-nowrap">Critical (90%+)</span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-52 md:h-56 lg:h-64 xl:h-72 2xl:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{
                top: 8,
                right: 8,
                left: 0,
                bottom: 8,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                className="text-xs sm:text-sm"
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}`}
                tickCount={5}
                tick={{ fontSize: 9 }}
                className="text-xs"
                width={30}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
              />
              <Bar dataKey="value" minPointSize={5}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Alert */}
        {showMemoryAlert && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-2 sm:p-3 rounded-md mt-3 sm:mt-4 flex items-start sm:items-center text-xs sm:text-sm">
            <AlertTriangle className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="font-semibold leading-tight">
              High Usage: Memory at {detailed.checks.memory.percentage}% -
              Monitor closely
            </span>
          </div>
        )}
      </>
    );
  }, [basic, detailed, error, loading, barChartData, showMemoryAlert]);

  return (
    <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow-md h-full flex flex-col">
      {renderContent}
    </div>
  );
};
