import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface SalesDataPoint {
  day: string;
  amount: number;
}

interface SalesPerformanceChartProps {
  data: SalesDataPoint[];
}

const SalesPerformanceChart: React.FC<SalesPerformanceChartProps> = ({
  data,
}) => {
  // Custom tooltip component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      let formattedValue;

      if (value >= 1000000) {
        formattedValue = `₦${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        formattedValue = `₦${(value / 1000).toFixed(0)}k`;
      } else {
        formattedValue = `₦${value.toLocaleString()}`;
      }

      return (
        <div
          className="bg-black bg-opacity-80 text-white p-2 rounded border border-blue-500"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "1px solid #3b82f6",
          }}
        >
          <p className="text-xs">{`Day ${label}`}</p>
          <p className="text-xs text-blue-400">{`Sales: ${formattedValue}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}k`;
    }
    return `₦${value.toLocaleString()}`;
  };

  return (
    <div className="w-full">
      {/* Chart container with responsive height */}
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid stroke="rgba(0, 0, 0, 0.1)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11 }}
              tickLine={{ stroke: "rgba(0, 0, 0, 0.1)" }}
              axisLine={{ stroke: "rgba(0, 0, 0, 0.1)" }}
              label={{
                value: "Day of Month",
                position: "insideBottom",
                offset: -4,
                style: { fontSize: "12px" },
              }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={{ stroke: "rgba(0, 0, 0, 0.1)" }}
              axisLine={{ stroke: "rgba(0, 0, 0, 0.1)" }}
              tickFormatter={formatYAxisTick}
              domain={[0, "dataMax"]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="rgba(59, 130, 246, 0.1)"
              fillOpacity={0.1}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 5, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesPerformanceChart;
