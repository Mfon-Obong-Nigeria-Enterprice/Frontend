export interface StatCard {
  heading: string;
  salesValue: number | string;
  statValue?: string;
  color?: "green" | "orange" | "red";
  statColor?: string;
  salesColor?: string;
  format?: "currency" | "number" | "text";
  hideArrow?: boolean;
}
