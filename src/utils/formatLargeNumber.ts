/**
 * Formats a large number into a compact, readable string with suffixes like K, M, B.
 *
 * @param num The number to format.
 * @returns A formatted string (e.g., 1.2M, 500K) or the original number as a string if it's less than 1000.
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return num.toString();
};

export const formatLargeMonetaryNumber = (num: number): string => {
  const currencySymbol = "₦";
  return `${currencySymbol}${formatLargeNumber(num)}`;
};