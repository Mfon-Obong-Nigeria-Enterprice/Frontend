export type Period = "daily" | "monthly" | "yearly" | "total";

export interface RevenueData {
  totalRevenue: number;
  previousPeriodRevenue: number;
  percentageChange: number;
  direction: "increase" | "decrease" | "no-change";
}

export interface MonthlyTrendData {
  month: string;
  value: number;
}

export interface YearOverYearData {
  month: string;
  [year: string]: string | number;
}

export interface PaymentMethodData {
  method: string;
  revenue: string;
  amount: number;
  color: string;
}

export interface ProductMarginData {
  name: string;
  value: number;
  color: string;
}

export interface DiscountImpact {
  avgDiscount: number;
  revenueLift: number;
  marginImpact: number;
}
