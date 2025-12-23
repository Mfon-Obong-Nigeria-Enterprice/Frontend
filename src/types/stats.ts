export interface StatCard {
  heading: string;
  salesValue: number | string;
  statValue?: string;
  color?: "green" | "orange" | "red" | "blue" | string; // Added string to be safe
  statColor?: string;
  salesColor?: string;
  format?: "currency" | "number" | "text";
  hideArrow?: boolean;
  percentage?: number;
  displayType?: "default" | "circular" | "linear";
  icon?: string;
  
  // --- UPDATED PROPERTIES ---
  chartType?: "line" | "bar" | "area"; // Added "area"
  chartData?: number[]; 
  chartColor?: string; // Added this property
}

// Keep StatCardProps as is if you use it elsewhere, 
// but StatCard is the one used by your BusinessReport.
export type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    type: "up" | "down";
    value: string; 
    label?: string; 
  };
  note?: string; 
  className?: string; 
};