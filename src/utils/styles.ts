import { cn } from "@/lib/utils";

export function toSentenceCaseName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// export const formatCurrency = (value: number): string => {
//   return ` ${value < 0 ? "-" : ""}₦${Math.abs(Number(value)).toLocaleString()}`;
// };

export const formatCurrency = (value: number): string => {
  return `${value < 0 ? "-" : ""}₦${Math.abs(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export function balanceClass(balance: number | null | undefined) {
  return cn("text-sm text-center ", {
    "text-[#2ECC71] bg-[#C8F9DD] border-[#2ECC71] ":
      balance != null && balance > 0,
    "text-[#7d7d7d] bg-[#F5F5F5] border-[#7D7D7D]":
      balance == null || balance === 0,
    "text-[#F95353] bg-[#FFE9E9] border-[#F95353]":
      balance !== null && balance && balance < 0,
  });
}
export function balanceClassT(balance: number | null | undefined) {
  return cn("text-sm text-center ", {
    "text-[#2ECC71]  border-[#2ECC71] ": balance != null && balance > 0,
    "text-[#7d7d7d]  border-[#7D7D7D]": balance == null || balance === 0,
    "text-[#F95353] border-[#F95353]":
      balance !== null && balance && balance < 0,
  });
}

// export function balanceTextClass(balance: number | null | undefined) {
//   if (balance && balance > 0) {
//     return "text-[#2ECC71]";
//   } else {
//     return "text-[#F95353]";
//   }
// }
export function balanceTextClass(balance: number | null | undefined) {
  if (balance == null) return "text-[#F95353]";

  if (balance > 0) return "text-[#2ECC71]";
  if (balance === 0) return "text-[#7d7d7d]";

  return "text-[#F95353]";
}
