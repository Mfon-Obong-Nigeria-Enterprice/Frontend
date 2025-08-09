import type { Period } from "@/types/revenue";

interface BackendBreakdownItem {
  date?: string;
  year?: string;
  revenue?: number;
  transactions?: number;
  amountPaid?: number;
}

interface BackendResponse {
  totalRevenue: number;
  transactionCount: number;
  totalAmountPaid: number;
  period: string;
  breakdown: BackendBreakdownItem[];
}

export const mapRevenueToChartData = (
  data: BackendResponse,
  period: Period
) => {
  return data.breakdown.map((item) => ({
    name:
      period === "daily"
        ? item.date
        : period === "monthly"
        ? item.date // e.g. "2025-08"
        : item.year,
    revenue: item.revenue ?? item.amountPaid ?? 0,
  }));
};
