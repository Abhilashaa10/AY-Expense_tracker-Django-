export const formatINR = (amount: number | string): string => {
  const num = Math.round(Number(amount) * 100) / 100;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};