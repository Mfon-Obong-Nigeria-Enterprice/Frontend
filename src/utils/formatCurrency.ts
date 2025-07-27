export const formatCurrency = (value: number) => {
  return ` ${value < 0 ? "-" : value <= 0 ? "" : "+"}₦${Math.abs(
    Number(value)
  ).toLocaleString()}`;
};
