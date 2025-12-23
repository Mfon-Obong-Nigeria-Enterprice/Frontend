import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MoreVertical } from "lucide-react"; // Import icon for the menu

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
  // Custom tooltip component matching the clean style
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formattedValue = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
      }).format(value);

      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="text-xs text-gray-500 mb-1">{`Day ${label}`}</p>
          <p className="text-sm font-semibold text-[#3D80FF]">{formattedValue}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter to match "₦150k" style
  const formatYAxisTick = (value: number) => {
    if (value === 0) return "₦0";
    if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₦${(value / 1000).toFixed(0)}k`;
    return `₦${value.toLocaleString()}`;
  };

  return (
    <div className="w-full bg-white p-6 rounded-[10px] border border-[#E5E7EB] shadow-sm">
      {/* Header Section matching Figma */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] md:text-lg font-semibold text-[#1F2937]">
          Sales Performance (Last 30 days)
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20, // Increased bottom margin for the X-axis label
            }}
          >
            {/* Solid Grid Lines matching Figma */}
            <CartesianGrid 
              stroke="#E5E7EB" 
              vertical={true} 
              horizontal={true} 
            />
            
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tickMargin={10}
              label={{
                value: "Day of the month",
                position: "insideBottom",
                offset: -15, // Pushes the label down nicely
                style: { 
                  fontSize: "12px", 
                  fill: "#6B7280",
                  marginTop: "20px"
                },
              }}
            />
            
            <YAxis
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tickFormatter={formatYAxisTick}
              domain={[0, "auto"]} // Let it scale automatically based on data
            />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#3D80FF", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            
            <Line
              type="monotone" // Smooth curve
              dataKey="amount"
              stroke="#3D80FF" // The specific blue from your design
              strokeWidth={2}
              dot={false} // REMOVED DOTS to match Figma screenshot 171012
              activeDot={{ r: 6, fill: "#3D80FF", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesPerformanceChart;