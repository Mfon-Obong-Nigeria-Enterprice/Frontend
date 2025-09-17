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
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm h-full">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-gray-700">
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

  // ⏳ Initial + interval fetching
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
        <div className="flex justify-center items-center h-48 md:h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-red-500">
          Error: {error.message}
        </div>
      );
    }

    if (!basic || !detailed) {
      return (
        <div className="text-center py-8 text-gray-600">
          No health data available.
        </div>
      );
    }

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-lg font-normal pb-2 md:pb-4">System Health</h2>
          <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-[#2ECC71] mr-1 md:mr-2"></span>
              <span>Normal (0-79%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-[#FFA500] mr-1 md:mr-2"></span>
              <span>High (80-89%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-[#F95353] mr-1 md:mr-2"></span>
              <span>Critical (90%+)</span>
            </div>
          </div>
        </div>

        <div className="h-48 sm:h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 15, right: 15, left: 5, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}`}
                tickCount={5}
                tick={{ fontSize: 12 }}
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

        {showMemoryAlert && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded-md mt-4 md:mt-6 flex items-center text-sm">
            <AlertTriangle className="mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="font-semibold">
              High Usage: Memory at {detailed.checks.memory.percentage}% - Monitor closely
            </span>
          </div>
        )}
      </div>
    );
  }, [basic, detailed, error, loading, barChartData, showMemoryAlert]);

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      {renderContent}
    </div>
  );
};
