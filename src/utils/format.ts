export function toSentenceCaseName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// this is the function for balance or amount with border and background dependent on zero
export function balanceClass(balance: number | null | undefined) {
  if (balance && balance > 0) return "border-[#2ECC71] bg-[#C8F9DD]";
  if (balance && balance < 0) return " border-[#F95353] bg-[#FFE9E9]";
  return "  border-[#7d7d7d] bg-[#f9f9f9]";
}

export function balanceTextClass(balance: number | null | undefined) {
  if (balance && balance > 0) {
    return "text-[#2ECC71]";
  } else if (balance && balance < 0) {
    return "text-[#F95353]";
  } else {
    return "text-[#7d7d7d]";
  }
}
