import { formatCurrency } from "./formatCurrency";

export function getDaysSince(dateString: string) {
  const created = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - created.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // days
}

export const getBalanceStatus = (balance: number) => {
  if (balance > 0) {
    return {
      status: "Deposit",
      variant: "default" as const,
      color: "text-green-500",
      text: formatCurrency(Math.abs(balance)),
    };
  } else if (balance < 0) {
    return {
      status: "Debt",
      variant: "destructive" as const,
      color: "text-emerald-500",
      text: formatCurrency(Math.abs(balance)),
    };
  }
  return {
    status: "Zero",
    variant: "secondary" as const,
    color: "text-neutral-700",
    text: formatCurrency(0),
  };
};

// Helper to get transaction display name
export const getTypeDisplay = (type: string) => {
  switch (type) {
    case "PURCHASE":
      return "PURCHASE";
    case "PICKUP":
      return "PICKUP";
    case "DEPOSIT":
      return "DEPOSIT";
    default:
      return type;
  }
};

// Helper to get type styling
export const getTypeStyles = (type: string) => {
  switch (type) {
    case "PURCHASE":
      return "border border-[#F95353] bg-[#FFCACA] text-[#F95353]";
    case "PICKUP":
      return "border border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]";
    case "DEPOSIT":
      return "border border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]";
    default:
      return "bg-gray-100 text-gray-300 border border-gray-300";
  }
};

// Helper function to create change text
export const getChangeText = (
  percentage: number,
  direction: string,
  period: string
) => {
  switch (direction) {
    case "increase":
      return `↑ ${Math.abs(percentage)}% from  ${period}`;
    case "decrease":
      return `↓ ${Math.abs(percentage)}% from  ${period}`;
    default:
      return `0% from  ${period}`;
  }
};

// Format change text helper
export const formatChangeText = (
  change: {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  },
  period: string
) => {
  switch (change.direction) {
    case "increase":
      return `↑${change.percentage}% more than ${period}`;
    case "decrease":
      return `↓${change.percentage}% less than ${period}`;
    default:
      return `—No change from ${period}`;
  }
};

// Helper function to get previous month name
export const getPreviousMonthName = () => {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[previousMonth.getMonth()];
};
