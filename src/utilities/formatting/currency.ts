/**
 * Formats a number as currency (e.g., "$1,234.56")
 * @param amount - Amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | null | undefined,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
    fallback?: string;
  }
): string => {
  const {
    showSymbol = true,
    decimals = 2,
    fallback = "N/A",
  } = options || {};

  if (amount === null || amount === undefined) return fallback;

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showSymbol ? `$${formatted}` : formatted;
};

/**
 * Formats a price with 2 decimal places (e.g., "$9.99")
 * @param price - Price to format
 * @param fallback - Fallback text if price is null/undefined
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number | null | undefined,
  fallback: string = "N/A"
): string => {
  if (price === null || price === undefined) return fallback;
  return `$${price.toFixed(2)}`;
};

/**
 * Formats a price with period suffix (e.g., "$9.99/month" or "$199.99/year")
 * @param price - Price to format
 * @param period - Period string (e.g., "month", "year")
 * @param fallback - Fallback text if price is null/undefined
 * @returns Formatted price string with period
 */
export const formatPriceWithPeriod = (
  price: number | null | undefined,
  period: string,
  fallback: string = "N/A"
): string => {
  if (price === null || price === undefined) return fallback;
  return `$${price.toFixed(2)}/${period}`;
};

/**
 * Formats a large number with locale string (e.g., "1,234")
 * @param value - Number to format
 * @param fallback - Fallback text if value is null/undefined
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined,
  fallback: string = "0"
): string => {
  if (value === null || value === undefined) return fallback;
  return value.toLocaleString();
};

/**
 * Formats a number as a percentage (e.g., "94.8%")
 * @param value - Number to format (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};
