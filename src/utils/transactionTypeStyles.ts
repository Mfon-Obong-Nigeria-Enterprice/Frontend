const TRANSACTION_TYPE_BADGE_STYLES: Record<string, string> = {
  PURCHASE: "border border-[#3D80FF] bg-[#EAF2FF] text-[#3D80FF]",
  PICKUP: "border border-[#FFA500] bg-[#FFF8E1] text-[#FFA500]",
  DEPOSIT: "border border-[#2ECC71] bg-[#E2F3EB] text-[#2ECC71]",
  RETURN: "border border-[#F95353] bg-[#FFECEC] text-[#F95353]",
  WHOLESALE: "border border-[#7C3AED] bg-[#F3E8FF] text-[#7C3AED]",
};

const normalizeTransactionType = (type?: string): string => {
  if (!type) return "";
  const normalized = type.toUpperCase().trim();
  return normalized === "PUCHASE" ? "PURCHASE" : normalized;
};

export const getTransactionTypeBadgeStyles = (type?: string): string => {
  const normalized = normalizeTransactionType(type);
  return (
    TRANSACTION_TYPE_BADGE_STYLES[normalized] ||
    "border border-gray-300 bg-gray-100 text-gray-600"
  );
};

export const getTransactionTypeTextColor = (type?: string): string => {
  const normalized = normalizeTransactionType(type);
  if (normalized === "PURCHASE") return "text-[#3D80FF]";
  if (normalized === "PICKUP") return "text-[#FFA500]";
  if (normalized === "DEPOSIT") return "text-[#2ECC71]";
  if (normalized === "RETURN") return "text-[#F95353]";
  if (normalized === "WHOLESALE") return "text-[#7C3AED]";
  return "text-[#444444]";
};
