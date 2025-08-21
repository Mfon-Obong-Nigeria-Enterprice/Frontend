export interface StatCard {
  heading: string;
  salesValue: number | string;
  statValue?: string;
  color?: "green" | "orange" | "red" | "blue";
  statColor?: string;
  salesColor?: string;
  format?: "currency" | "number" | "text";
  hideArrow?: boolean;
  percentage?: number;
  displayType?: "default" | "circular" | "linear";
}

export type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    type: "up" | "down";
    value: string; // e.g 12%
    label?: string; // e.g from yesterday
  };
  note?: string; // labels like "Need attention"
  className?: string; // custom styling
};
