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
    };
  } else if (balance < 0) {
    return {
      status: "Debt",
      variant: "destructive" as const,
      color: "text-emerald-500",
    };
  }
  return {
    status: "Zero",
    variant: "secondary" as const,
    color: "text-neutral-700",
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
